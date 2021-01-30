const request = require('request');
const uuid = require('uuid').v4;

const Payment = require('./payment');
const Refund = require('./refund');
const PaymentError = require('./payment-error');
const utils = require('./utils');

const DEFAULT_URL = 'https://api.yookassa.ru/v3/';
const DEFAULT_DEBUG = false;
const DEFAULT_TIMEOUT = 120000; // 2 minutes (Node's default timeout)
const DEFAULT_DELAY = 60000; // 1 minute

class YooKassa {
    /**
     * @param {string} shopId
     * @param {string} secretKey
     * @param {string} apiUrl
     * @param {string} debug
     * @param {string} timeout
     * @param {string} retryDelay
     * @returns {YooKassa}
     */
    constructor({
        shopId,
        secretKey,
        apiUrl = DEFAULT_URL,
        debug = DEFAULT_DEBUG,
        timeout = DEFAULT_TIMEOUT,
        retryDelay = DEFAULT_DELAY
    }) {
        this.shopId = shopId;
        this.secretKey = secretKey;
        this.apiUrl = apiUrl;
        this.debug = debug;
        this.timeout = timeout;
        this.retryDelay = retryDelay;
    }

    /**
     * Create a payment
     * @see https://yookassa.ru/developers/api#create_payment
     * @param {Object} payload
     * @param {string} idempotenceKey
     * @returns {Promise<Payment>}
     */
    createPayment(payload, idempotenceKey) {
        return this.request('POST', 'payments', payload, idempotenceKey)
            .then(data => {
                return new Payment(this, data);
            });
    }

    /**
     * Get info about a payment by id
     * @see https://yookassa.ru/developers/api#get_payment
     * @param {string} paymentId
     * @param {string} idempotenceKey
     * @returns {Promise<Payment>}
     */
    getPayment(paymentId, idempotenceKey) {
        return this.request('GET', `payments/${paymentId}`, {}, idempotenceKey)
            .then(data => {
                return new Payment(this, data);
            });
    }

    /**
     * Capture a payment with status 'waiting_for_capture'. status change to 'succeeded'
     * @see https://yookassa.ru/developers/api#capture_payment
     * @param {string} paymentId
     * @param {Object} amount
     * @param {string} idempotenceKey
     * @returns {Promise<Payment>}
     */
    capturePayment(paymentId, amount, idempotenceKey) {
        return this.request('POST', `payments/${paymentId}/capture`, { amount }, idempotenceKey)
            .then(data => {
                return new Payment(this, data);
            });
    }

    /**
     * Cancel a payment with status 'waiting_for_capture'. status change to 'canceled'
     * @see https://kassa.yandex.ru/docs/checkout-api/#otmena-platezha
     * @param {string} paymentId
     * @param {string} idempotenceKey
     * @returns {Promise<Payment>}
     */
    cancelPayment(paymentId, idempotenceKey) {
        return this.request('POST', `payments/${paymentId}/cancel`, {}, idempotenceKey)
            .then(data => {
                return new Payment(this, data);
            });
    }

    /**
     * Create a refund
     * @see https://yookassa.ru/developers/api#create_refund
     * @param {string} paymentId
     * @param {Object} amount
     * @param {string} idempotenceKey
     * @returns {Promise<Refund>}
     */
    createRefund(paymentId, amount, idempotenceKey) {
        return this.request('POST', 'refunds', { payment_id: paymentId, amount }, idempotenceKey)
            .then(data => {
                return new Refund(this, data);
            });
    }

    /**
     * Get info about a refund by id
     * @see https://yookassa.ru/developers/api#get_refund
     * @param {string} refundId
     * @param {string} idempotenceKey
     * @returns {Promise<Refund>}
     */
    getRefund(refundId, idempotenceKey) {
        return this.request('GET', `refunds/${refundId}`, {}, idempotenceKey)
            .then(data => {
                return new Refund(this, data);
            });
    }

    request(method, path, payload, idempotenceKey) {
        /**
         * Generate idempotence key if not present
         * @see https://yookassa.ru/developers/using-api/basics#idempotence
         */
        if (!idempotenceKey) {
            idempotenceKey = uuid();
        }

        const uri = this.apiUrl + path;

        if (this.debug) {
            // eslint-disable-next-line no-console
            console.log(`${method}: ${uri}`);
        }

        return new Promise((resolve, reject) => {
            request({
                method,
                uri,
                json: true,
                body: payload,
                timeout: this.timeout,
                /**
                 * @see https://yookassa.ru/developers/using-api/basics#auth
                 */
                auth: {
                    user: this.shopId,
                    pass: this.secretKey
                },
                resolveWithFullResponse: true,
                headers: {
                    /**
                     * @see https://yookassa.ru/developers/using-api/basics#idempotence
                     */
                    'Idempotence-Key': idempotenceKey
                }
            }, function(error, response, body) {
                if (error) return reject(error);

                if (response.body.type === 'error') {
                    return reject(response.body);
                }

                resolve(response);
            });
        }).then(response => {
            switch (response.statusCode) {
                /**
                 * Retry request
                 * @see https://yookassa.ru/developers/using-api/basics#sync
                 */
                case 202:
                    return utils.delay(response.body.retry_after || this.retryDelay).
                        then(this.request.bind(this, method, path, payload, idempotenceKey));

                /**
                 * Normal response
                 */
                default:
                    return response.body;
            }
        }).catch(error => {
            /**
             * @see https://yookassa.ru/developers/using-api/basics#http-codes
             */
            return Promise.reject(new PaymentError(error));
        });
    }
}

module.exports = YooKassa;

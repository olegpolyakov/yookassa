const request = require('request');
const uuid = require('uuid/v4');

const Payment = require('./payment');
const Refund = require('./refund');
const utils = require('./utils');

const DEFAULT_URL = 'https://api.yookassa.ru/v3/';
const DEFAULT_DEBUG = false;
const DEFAULT_TIMEOUT = 120000; // (2 minutes) Node's default timeout

class YooKassa {
    /**
     * @param {string} shopId
     * @param {string} secretKey
     * @param {string} root
     * @param {string} debug
     * @param {string} timeout
     * @returns {YooKassa}
     */
    constructor({ shopId, secretKey, root = DEFAULT_URL, debug = DEFAULT_DEBUG, timeout = DEFAULT_TIMEOUT }) {
        this.shopId = shopId;
        this.secretKey = secretKey;
        this.root = root;
        this.debug = debug;
        this.timeout = timeout;
    }

    /**
     * Create new payment
     * @see https://kassa.yandex.ru/docs/checkout-api/#sozdanie-platezha
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
     * Get info about payment by id
     * @see https://kassa.yandex.ru/docs/checkout-api/#informaciq-o-platezhe
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
     * Capture payment with status 'waiting_for_capture'. status change to 'succeeded'
     * @see https://kassa.yandex.ru/docs/checkout-api/#podtwerzhdenie-platezha
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
     * Cancel payment with status 'waiting_for_capture'. status change to 'canceled'
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
     * Create new refund
     * @see https://kassa.yandex.ru/docs/checkout-api/#sozdanie-wozwrata
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
     * Get info about refund by id
     * @see https://kassa.yandex.ru/docs/checkout-api/#informaciq-o-wozwrate
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
         * @see https://kassa.yandex.ru/docs/checkout-api/#idempotentnost
         */
        if (!idempotenceKey) {
            idempotenceKey = uuid();
        }

        const uri = this.root + path;

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
                 * @see https://kassa.yandex.ru/docs/checkout-api/#autentifikaciq
                 */
                auth: {
                    user: this.shopId,
                    pass: this.secretKey
                },
                resolveWithFullResponse: true,
                headers: {
                    /**
                     * @see https://kassa.yandex.ru/docs/checkout-api/#idempotentnost
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
                 * Implementation of async actions with retries
                 * @see https://kassa.yandex.ru/docs/checkout-api/#asinhronnost
                 */
                case 202:
                    return utils.delay(response.body.retry_after).
                        then(this.request.bind(this, method, path, payload, idempotenceKey));

                /**
                 * Normal response
                 */
                default:
                    return response.body;
            }
        }).catch(error => {
            /**
             * @see https://kassa.yandex.ru/docs/checkout-api/#oshibki
             */
            return Promise.reject(utils.processError(error));
        });
    }
}

module.exports = YooKassa;
const { PaymentMethod, PaymentStatus } = require('./constants');

class Payment {
    /**
     * Статус платежа
     * @see https://yookassa.ru/developers/payments/payment-process#lifecycle
     * @readonly
     * @enum {string}
     */
    static Status = PaymentStatus;

    /**
     * Способ оплаты
     * @see https://yookassa.ru/developers/payment-methods/overview#all
     * @readonly
     * @enum {string}
     */
    static Method = PaymentMethod;

    /**
     * @param {Object} data - Данные платежа
     * @param {YooKassa} instance - Экземпляр кассы
     * @returns {Payment}
     */
    constructor(data, instance) {
        Object.assign(this, data, { _instance: instance });
    }

    /**
     * Is payment pending
     * @see https://kassa.yandex.ru/docs/guides/#platezhi
     * @returns {Boolean}
     */
    get isPending() {
        return this.status === Payment.Status.PENDING;
    }

    /**
     * Is payment waiting for capture
     * @see https://kassa.yandex.ru/docs/guides/#platezhi
     * @returns {Boolean}
     */
    get isWaitingForCapture() {
        return this.status === Payment.Status.WAITING_FOR_CAPTURE;
    }

    /**
     * Is payment succeeded
     * @see https://kassa.yandex.ru/docs/guides/#platezhi
     * @returns {Boolean}
     */
    get isSucceeded() {
        return this.status === Payment.Status.SUCCEEDED;
    }

    /**
     * Is payment canceled
     * @see https://kassa.yandex.ru/docs/guides/#platezhi
     * @returns {Boolean}
     */
    get isCanceled() {
        return this.status === Payment.Status.CANCELED;
    }

    /**
     * Is payment succeeded or canceled
     * @see https://kassa.yandex.ru/docs/guides/#platezhi
     * @returns {Boolean}
     */
    get isResolved() {
        return (
            this.status === Payment.Status.SUCCEEDED ||
            this.status === Payment.Status.CANCELED
        );
    }

    get confirmationUrl() {
        return this.confirmation ? this.confirmation.confirmation_url : undefined;
    }

    /**
     * Retrieve payment info
     * @returns {Promise<bool>}
     */
    reload() {
        return this._instance.getPayment(this.id)
            .then(data => {
                Object.assign(this, data);
                return true;
            });
    }

    /**
     * Capture payment
     * @param amount
     * @returns {*}
     */
    capture(amount) {
        return this._instance.capturePayment(this.id, amount || this.amount)
            .then(data => {
                Object.assign(this, data);
                return true;
            });
    }

    /**
     * Cancel Payment
     * @returns {*}
     */
    cancel() {
        return this._instance.cancelPayment(this.id)
            .then(data => {
                Object.assign(this, data);
                return true;
            });
    }

    /**
     * Create refund
     * @param amount
     * @returns {*|Promise.<Refund>}
     */
    refund(amount) {
        return this._instance.createRefund(this.id, amount || this.amount);
    }
}

module.exports = Payment;
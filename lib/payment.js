"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Payment_1 = require("./types/Payment");
class Payment {
    constructor(instance, data) {
        Object.assign(this, data, { _instance: instance });
    }
    get isPending() {
        return this.status === Payment_1.PaymentStatusEnum.PENDING;
    }
    get isWaitingForCapture() {
        return this.status === Payment_1.PaymentStatusEnum.WAITING_FOR_CAPTURE;
    }
    get isSucceeded() {
        return this.status === Payment_1.PaymentStatusEnum.SUCCEEDED;
    }
    get isCanceled() {
        return this.status === Payment_1.PaymentStatusEnum.CANCELED;
    }
    get isResolved() {
        return (this.status === Payment_1.PaymentStatusEnum.SUCCEEDED ||
            this.status === Payment_1.PaymentStatusEnum.CANCELED);
    }
    get confirmationUrl() {
        return this.confirmation &&
            this.confirmation.type === Payment_1.ConfirmationTypesEnum.redirect
            ? this.confirmation.confirmation_url
            : undefined;
    }
    reload() {
        return this._instance.getPayment(this.id).then((data) => {
            Object.assign(this, data);
            return true;
        });
    }
    capture(amount) {
        return this._instance
            .capturePayment(this.id, amount || this.amount)
            .then((data) => {
            Object.assign(this, data);
            return true;
        });
    }
    cancel() {
        return this._instance.cancelPayment(this.id).then((data) => {
            Object.assign(this, data);
            return true;
        });
    }
    refund(amount) {
        return this._instance.createRefund(this.id, amount || this.amount);
    }
}
exports.default = Payment;
//# sourceMappingURL=payment.js.map
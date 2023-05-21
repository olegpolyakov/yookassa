"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentError extends Error {
    constructor(error) {
        super(error.message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PaymentError);
        }
        else {
            this.stack = new Error().stack;
        }
        this.name = 'PaymentError';
        this.message = error.message;
    }
}
exports.default = PaymentError;
//# sourceMappingURL=payment-error.js.map
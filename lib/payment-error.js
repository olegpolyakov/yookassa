class PaymentError extends Error {
    constructor(error) {
        super(error.message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PaymentError);
        } else {
            this.stack = (new Error()).stack;
        }

        this.name = 'PaymentError';
        this.message = error.description;
        this.id = error.id;
        this.code = error.code;
        this.parameter = error.parameter;
    }
}

module.exports = PaymentError;
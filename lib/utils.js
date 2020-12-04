const PaymentError = require('./payment-error');

module.exports = {
    delay(ms) {
        return new Promise(resolve => {
            const timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                resolve();
            }, ms);
        });
    },

    processError(error) {
        if (error.statusCode !== 404) {
            return new PaymentError(error);
        }

        return error;
    }
};
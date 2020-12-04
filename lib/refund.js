class Refund {
    constructor(instance, data) {
        Object.assign(this, data, { _instance: instance });
    }

    reload() {
        return this._instance.getRefund(this.id)
            .then(data => {
                Object.assign(this, data);
                return true;
            });
    }
}

module.exports = Refund;
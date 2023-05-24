"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Refund {
    constructor(instance, data) {
        Object.assign(this, data, { _instance: instance });
    }
    reload() {
        return this._instance.getRefund(this.id).then((data) => {
            Object.assign(this, data);
            return true;
        });
    }
}
exports.default = Refund;
//# sourceMappingURL=refund.js.map
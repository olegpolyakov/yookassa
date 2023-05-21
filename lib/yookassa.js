"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const payment_1 = __importDefault(require("./payment"));
const refund_1 = __importDefault(require("./refund"));
const payment_error_1 = __importDefault(require("./payment-error"));
const utils = __importStar(require("./utils"));
const DEFAULT_URL = 'https://api.yookassa.ru/v3/';
const DEFAULT_DEBUG = false;
const DEFAULT_TIMEOUT = 120000;
const DEFAULT_DELAY = 60000;
class YooKassa {
    constructor({ shopId, secretKey, apiUrl = DEFAULT_URL, debug = DEFAULT_DEBUG, timeout = DEFAULT_TIMEOUT, retryDelay = DEFAULT_DELAY, }) {
        this.shopId = shopId;
        this.secretKey = secretKey;
        this.apiUrl = apiUrl;
        this.debug = debug;
        this.timeout = timeout;
        this.retryDelay = retryDelay;
    }
    createPayment(payload, idempotenceKey = null) {
        return this.request('POST', 'payments', payload, idempotenceKey).then((data) => {
            return new payment_1.default(this, data);
        });
    }
    getPayment(paymentId, idempotenceKey = null) {
        return this.request('GET', `payments/${paymentId}`, {}, idempotenceKey).then((data) => {
            return new payment_1.default(this, data);
        });
    }
    capturePayment(paymentId, amount, idempotenceKey = null) {
        return this.request('POST', `payments/${paymentId}/capture`, { amount }, idempotenceKey).then((data) => {
            return new payment_1.default(this, data);
        });
    }
    cancelPayment(paymentId, idempotenceKey = null) {
        return this.request('POST', `payments/${paymentId}/cancel`, {}, idempotenceKey).then((data) => {
            return new payment_1.default(this, data);
        });
    }
    createRefund(paymentId, amount, idempotenceKey = null) {
        return this.request('POST', 'refunds', { payment_id: paymentId, amount }, idempotenceKey).then((data) => {
            return new refund_1.default(this, data);
        });
    }
    getRefund(refundId, idempotenceKey = null) {
        return this.request('GET', `refunds/${refundId}`, {}, idempotenceKey).then((data) => {
            return new refund_1.default(this, data);
        });
    }
    request(method, path, payload, idempotenceKey = null) {
        if (!idempotenceKey) {
            idempotenceKey = (0, uuid_1.v4)();
        }
        const uri = this.apiUrl + path;
        if (this.debug) {
            console.log(`${method}: ${uri}`);
        }
        return (0, axios_1.default)({
            method,
            url: uri,
            data: payload,
            timeout: this.timeout,
            auth: {
                username: this.shopId,
                password: this.secretKey,
            },
            headers: {
                'Idempotence-Key': idempotenceKey,
            },
        })
            .then((response) => {
            switch (response.status) {
                case 202:
                    return utils
                        .delay(response.data.retry_after || this.retryDelay)
                        .then(this.request.bind(this, method, path, payload, idempotenceKey));
                default:
                    return response.data;
            }
        })
            .catch((error) => {
            return Promise.reject(new payment_error_1.default(error));
        });
    }
}
exports.default = YooKassa;
//# sourceMappingURL=yookassa.js.map
import Payment from './payment';
import Refund from './refund';
export default class YooKassa {
    shopId: string;
    secretKey: string;
    apiUrl: string;
    debug: boolean;
    timeout: number;
    retryDelay: number;
    constructor({ shopId, secretKey, apiUrl, debug, timeout, retryDelay, }: {
        shopId: any;
        secretKey: any;
        apiUrl?: string;
        debug?: boolean;
        timeout?: number;
        retryDelay?: number;
    });
    createPayment(payload: any, idempotenceKey: any): Promise<Payment>;
    getPayment(paymentId: any, idempotenceKey?: any): Promise<Payment>;
    capturePayment(paymentId: any, amount: any, idempotenceKey?: any): Promise<Payment>;
    cancelPayment(paymentId: any, idempotenceKey?: any): Promise<Payment>;
    createRefund(paymentId: any, amount: any, idempotenceKey?: any): Promise<Refund>;
    getRefund(refundId: any, idempotenceKey?: any): Promise<Refund>;
    request(method: any, path: any, payload: any, idempotenceKey?: any): Promise<any>;
}

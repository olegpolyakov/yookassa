import Payment from './payment';
import Refund from './refund';
import { ICreatePaymentRequest } from './types/Payment';
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
    createPayment(payload: ICreatePaymentRequest, idempotenceKey: string): Promise<Payment>;
    getPayment(paymentId: string, idempotenceKey?: string): Promise<Payment>;
    capturePayment(paymentId: string, amount: number, idempotenceKey?: string): Promise<Payment>;
    cancelPayment(paymentId: string, idempotenceKey?: string): Promise<Payment>;
    createRefund(paymentId: any, amount: any, idempotenceKey?: any): Promise<Refund>;
    getRefund(refundId: any, idempotenceKey?: any): Promise<Refund>;
    request<T>(method: any, path: any, payload: any, idempotenceKey?: any): Promise<T>;
}

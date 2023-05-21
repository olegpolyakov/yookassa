import Payment from './payment';
import Refund from './refund';
import { ICreatePaymentRequest } from './types/Payment';
import { IAmount } from './types/Common';
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
    createPayment(payload: ICreatePaymentRequest, idempotenceKey?: string): Promise<Payment>;
    getPayment(paymentId: string, idempotenceKey?: string): Promise<Payment>;
    capturePayment(paymentId: string, amount: IAmount, idempotenceKey?: string): Promise<Payment>;
    cancelPayment(paymentId: string, idempotenceKey?: string): Promise<Payment>;
    createRefund(paymentId: string, amount: IAmount, idempotenceKey?: any): Promise<Refund>;
    getRefund(refundId: string, idempotenceKey?: string): Promise<Refund>;
    request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD', path: string, payload: unknown, idempotenceKey?: string): Promise<T>;
}

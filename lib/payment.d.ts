import { IConfirmation, IPayment, PaymentStatusEnum } from './types/Payment';
import { IAmount } from './types/Common';
import { IPaymentMethod } from './types/PaymentMethod';
import { ReceiptRegistrationEnum } from './types/Receipt';
import YooKassa from './yookassa';
export default class Payment implements IPayment {
    _instance: YooKassa;
    amount: IAmount;
    captured_at: string;
    confirmation: IConfirmation;
    created_at: string;
    description: string;
    expires_at: string;
    id: string;
    income_amount: IAmount;
    metadata: object;
    paid: boolean;
    payment_method: IPaymentMethod;
    receipt_registration: ReceiptRegistrationEnum;
    recipient: {
        account_id: string;
        gateway_id: string;
    };
    refundable: boolean;
    refunded_amount: IAmount;
    status: PaymentStatusEnum;
    test: boolean;
    constructor(instance: YooKassa, data: Payment);
    get isPending(): boolean;
    get isWaitingForCapture(): boolean;
    get isSucceeded(): boolean;
    get isCanceled(): boolean;
    get isResolved(): boolean;
    get confirmationUrl(): string;
    reload(): Promise<boolean>;
    capture(amount: number): Promise<boolean>;
    cancel(): Promise<boolean>;
    refund(amount: number): Promise<import("./refund").default>;
}

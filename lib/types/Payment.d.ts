import { IPaymentMethod } from './PaymentMethod';
import { IReceipt, ReceiptRegistrationEnum } from './Receipt';
import { IAmount, LocaleEnum } from './Common';
export declare enum PaymentStatusEnum {
    PENDING = "pending",
    WAITING_FOR_CAPTURE = "waiting_for_capture",
    SUCCEEDED = "succeeded",
    CANCELED = "canceled"
}
export interface ICreatePaymentRequest {
    amount: IAmount;
    description?: string;
    receipt?: IReceipt;
    recipient?: {
        gateway_id: string;
    };
    payment_method_data?: IPaymentMethod;
    capture: boolean;
    confirmation: IConfirmation;
    save_payment_method?: boolean;
    merchant_customer_id?: string;
}
export type IConfirmation = IConfirmationRedirect | IConfirmationEmbedded | IConfirmationQR | IConfirmationExternal | IConfirmationMobileApp;
export declare enum ConfirmationTypesEnum {
    embedded = "embedded",
    external = "external",
    mobile_application = "mobile_application",
    qr = "qr",
    redirect = "redirect"
}
export interface IConfirmationRedirect {
    type: 'redirect';
    confirmation_url: string;
    enforce?: boolean;
    locale?: LocaleEnum;
    return_url: string;
}
export interface IConfirmationEmbedded {
    type: ConfirmationTypesEnum.embedded;
    locale?: LocaleEnum;
}
export interface IConfirmationQR {
    type: ConfirmationTypesEnum.qr;
    any: unknown;
}
export interface IConfirmationExternal {
    type: ConfirmationTypesEnum.external;
    any: unknown;
}
export interface IConfirmationMobileApp {
    type: ConfirmationTypesEnum.mobile_application;
    any: unknown;
}
export interface IPayment {
    id: string;
    status: PaymentStatusEnum;
    amount: IAmount;
    income_amount?: IAmount;
    description?: string;
    recipient: {
        account_id: string;
        gateway_id: string;
    };
    payment_method?: IPaymentMethod;
    captured_at?: string;
    created_at: string;
    expires_at?: string;
    confirmation?: IConfirmation;
    test: boolean;
    refunded_amount?: IAmount;
    paid: boolean;
    refundable: boolean;
    receipt_registration?: ReceiptRegistrationEnum;
    metadata?: object;
}

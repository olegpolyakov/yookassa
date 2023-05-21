import { IAmount } from './Common';
export type IPaymentMethod = IPaymentMethodAlfabank | IPaymentMethodMobileBalance | IPaymentMethodCard | IPaymentMethodInstallments | IPaymentMethodCash | IPaymentMethodSbp | IPaymentMethodB2b_sberbank | IPaymentMethodTinkoff_bank | IPaymentMethodYooMoney | IPaymentMethodQiwi | IPaymentMethodSberbank;
export declare enum PaymentMethodsEnum {
    bank_card = "bank_card",
    yoo_money = "yoo_money",
    qiwi = "qiwi",
    sberbank = "sberbank",
    alfabank = "alfabank",
    tinkoff_bank = "tinkoff_bank",
    b2b_sberbank = "b2b_sberbank",
    sbp = "sbp",
    mobile_balance = "mobile_balance",
    cash = "cash",
    installments = "installments"
}
export interface IPaymentMethodCard {
    type: PaymentMethodsEnum.bank_card;
    card?: {
        number: string;
        expiry_year?: string;
        expiry_month: string;
        csc?: string;
        cardholder?: string;
    };
}
export interface IPaymentMethodMobileBalance {
    type: PaymentMethodsEnum.mobile_balance;
    phone: string;
}
export interface IPaymentMethodYooMoney {
    type: PaymentMethodsEnum.yoo_money;
}
export interface IPaymentMethodQiwi {
    type: PaymentMethodsEnum.qiwi;
    phone?: string;
}
export interface IPaymentMethodSberbank {
    type: PaymentMethodsEnum.sberbank;
    phone?: string;
}
export interface IPaymentMethodAlfabank {
    type: PaymentMethodsEnum.alfabank;
    login?: string;
}
export interface IPaymentMethodTinkoff_bank {
    type: PaymentMethodsEnum.tinkoff_bank;
}
export interface IPaymentMethodB2b_sberbank {
    type: PaymentMethodsEnum.b2b_sberbank;
    payment_purpose: string;
    vat_data: {
        type: 'mixed' | 'calculated' | 'untaxed';
        amount?: IAmount;
    };
}
export interface IPaymentMethodSbp {
    type: PaymentMethodsEnum.sbp;
}
export interface IPaymentMethodCash {
    type: PaymentMethodsEnum.cash;
    phone?: string;
}
export interface IPaymentMethodInstallments {
    type: PaymentMethodsEnum.installments;
}

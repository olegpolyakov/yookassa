import { IAmount } from './Common';
export declare enum VatCodesEnum {
    'ndsNone' = 1,
    'nds0' = 2,
    'nds10' = 3,
    'nds20' = 4,
    'nds10/110' = 5,
    'nds20/120' = 6
}
export declare enum TaxSystemCodesEnum {
    'OSN' = 1,
    'USN6' = 2,
    'USN15' = 3,
    'ENVD' = 4,
    'ESN' = 5,
    'PSN' = 6
}
export declare enum ReceiptRegistrationEnum {
    pending = "pending",
    succeeded = "succeeded",
    canceled = "canceled"
}
export interface ICustomer {
    full_name?: string;
    inn?: string;
    email?: string;
    phone?: string;
}
export interface IReceiptItem {
    description: string;
    amount: IAmount;
    vat_code: VatCodesEnum;
    quantity: string;
    measure?: string;
    mark_quantity?: {
        numerator: number;
        denominator: number;
    };
}
export interface IReceipt {
    customer?: ICustomer;
    items: IReceiptItem[];
    tax_system_code?: TaxSystemCodesEnum;
}

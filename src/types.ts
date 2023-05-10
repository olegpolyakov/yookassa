import { CurrencyEnum } from './constants'

export interface ICustomer {
	full_name?: string
	email?: string
	phone?: string
	inn?: string
}

export interface IReceiptItem {
	description: string
	amount: {
		value: string // format: 10.00
		currency: CurrencyEnum
	}
	quantity: number

	/**
	 * 1	Без НДС
	 * 2	НДС по ставке 0%
	 * 3	НДС по ставке 10%
	 * 4	НДС чека по ставке 20%
	 * 5	НДС чека по расчетной ставке 10/110
	 * 6	НДС чека по расчетной ставке 20/120
	 */
	vat_code: 1 | 2 | 3 | 4 | 5 | 6
}

export interface ICreatePaymentRequest {
	amount: {
		value: string
		currency: CurrencyEnum
	}
	payment_method_data: {
		type: 'bank_card'
	}
	capture: boolean
	confirmation: {
		type: 'redirect'
		return_url: 'https://www.example.com/return_url'
	}
	description: 'Заказ №1'
	receipt: {
		customer: ICustomer
		items: IReceiptItem[]

		/**
		 * ФЗ-54
		 * 1  Общая система налогообложения
		 * 2  Упрощенная (УСН, доходы)
		 * 3  Упрощенная (УСН, доходы минус расходы)
		 * 4  Единый налог на вмененный доход (ЕНВД)
		 * 5  Единый сельскохозяйственный налог (ЕСН)
		 * 6  Патентная система налогообложения
		 */
		tax_system_code: 1 | 2 | 3 | 4 | 5 | 6
	}
}

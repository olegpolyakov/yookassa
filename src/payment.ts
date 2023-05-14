import {
	ConfirmationTypesEnum,
	IConfirmation,
	IPayment,
	PaymentStatusEnum,
} from './types/Payment'
import { IAmount } from './types/Common'
import { IPaymentMethod } from './types/PaymentMethod'
import { ReceiptRegistrationEnum } from './types/Receipt'
import YooKassa from './yookassa'

export default class Payment implements IPayment {
	_instance: YooKassa
	amount: IAmount
	captured_at: string
	confirmation: IConfirmation
	created_at: string
	description: string
	expires_at: string
	id: string
	income_amount: IAmount
	metadata: object
	paid: boolean
	payment_method: IPaymentMethod
	receipt_registration: ReceiptRegistrationEnum
	recipient: { account_id: string; gateway_id: string }
	refundable: boolean
	refunded_amount: IAmount
	status: PaymentStatusEnum
	test: boolean

	constructor(instance, data) {
		Object.assign(this, data, { _instance: instance })
	}

	/**
	 * Is payment pending
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isPending() {
		return this.status === PaymentStatusEnum.PENDING
	}

	/**
	 * Is payment waiting for capture
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isWaitingForCapture() {
		return this.status === PaymentStatusEnum.WAITING_FOR_CAPTURE
	}

	/**
	 * Is payment succeeded
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isSucceeded() {
		return this.status === PaymentStatusEnum.SUCCEEDED
	}

	/**
	 * Is payment canceled
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isCanceled() {
		return this.status === PaymentStatusEnum.CANCELED
	}

	/**
	 * Is payment succeeded or canceled
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isResolved() {
		return (
			this.status === PaymentStatusEnum.SUCCEEDED ||
			this.status === PaymentStatusEnum.CANCELED
		)
	}

	get confirmationUrl() {
		return this.confirmation &&
			this.confirmation.type === ConfirmationTypesEnum.redirect
			? this.confirmation.confirmation_url
			: undefined
	}

	/**
	 * Retrieve payment info
	 * @returns {Promise<bool>}
	 */
	reload() {
		return this._instance.getPayment(this.id).then((data) => {
			Object.assign(this, data)
			return true
		})
	}

	/**
	 * Capture payment
	 * @param amount
	 * @returns {*}
	 */
	capture(amount) {
		return this._instance
			.capturePayment(this.id, amount || this.amount)
			.then((data) => {
				Object.assign(this, data)
				return true
			})
	}

	/**
	 * Cancel Payment
	 * @returns {*}
	 */
	cancel() {
		return this._instance.cancelPayment(this.id).then((data) => {
			Object.assign(this, data)
			return true
		})
	}

	/**
	 * Create refund
	 * @param amount
	 * @returns {*|Promise.<Refund>}
	 */
	refund(amount) {
		return this._instance.createRefund(this.id, amount || this.amount)
	}
}

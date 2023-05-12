import { IPayment, PaymentStatusEnum } from './types/Payment'

export class Payment {
	_instance: IPayment
	constructor(data?: IPayment) {
		this._instance = data
	}

	/**
	 * Is payment pending
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isPending() {
		return this._instance.status === PaymentStatusEnum.PENDING
	}

	/**
	 * Is payment waiting for capture
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isWaitingForCapture() {
		return this._instance.status === PaymentStatusEnum.WAITING_FOR_CAPTURE
	}

	/**
	 * Is payment succeeded
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isSucceeded() {
		return this._instance.status === PaymentStatusEnum.SUCCEEDED
	}

	/**
	 * Is payment canceled
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isCanceled() {
		return this._instance.status === PaymentStatusEnum.CANCELED
	}

	/**
	 * Is payment succeeded or canceled
	 * @see https://kassa.yandex.ru/docs/guides/#platezhi
	 * @returns {Boolean}
	 */
	get isResolved() {
		return (
			this._instance.status === PaymentStatusEnum.SUCCEEDED ||
			this._instance.status === PaymentStatusEnum.CANCELED
		)
	}

	get confirmationUrl() {
		return this._instance.confirmation
			? this._instance.confirmation.confirmation_url
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

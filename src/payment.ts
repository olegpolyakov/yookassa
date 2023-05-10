export enum PaymentStatusEnum {
	// Платеж создан, но не завершен
	PENDING = 'pending',

	// Платеж завершен и ожидает ваших действий
	WAITING_FOR_CAPTURE = 'waiting_for_capture',

	// Платеж успешно завершен, деньги придут на ваш расчетный счет
	SUCCEEDED = 'succeeded',

	// Платеж отменен
	CANCELED = 'canceled',
}

export class Payment {
	private status: PaymentStatusEnum = null
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
		return this.status === PaymentStatusEnum.SUCCEEDED || this.status === PaymentStatusEnum.CANCELED
	}

	get confirmationUrl() {
		return this.confirmation ? this.confirmation.confirmation_url : undefined
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

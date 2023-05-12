import request from 'axios'
import { v4 as uuid } from 'uuid'
import { Payment } from './payment'
import { ICreatePaymentRequest, IPayment } from './types/Payment'

const DEFAULT_URL = 'https://api.yookassa.ru/v3/'
const DEFAULT_DEBUG = false
/** 2 minutes (Node's default timeout) */
const DEFAULT_TIMEOUT = 120000
/** 1 minute */
const DEFAULT_DELAY = 60000

export class YooKassa {
	private shopId: string
	private secretKey: string
	private apiUrl = DEFAULT_URL
	private debug = DEFAULT_DEBUG
	private timeout = DEFAULT_TIMEOUT
	private retryDelay = DEFAULT_DELAY

	constructor({
		shopId,
		secretKey,
		apiUrl = DEFAULT_URL,
		debug = DEFAULT_DEBUG,
		timeout = DEFAULT_TIMEOUT,
		retryDelay = DEFAULT_DELAY,
	}) {
		this.shopId = shopId
		this.secretKey = secretKey
		this.apiUrl = apiUrl
		this.debug = debug
		this.timeout = timeout
		this.retryDelay = retryDelay
	}

	/**
	 * Create a payment
	 * @see https://yookassa.ru/developers/api#create_payment
	 * @param {ICreatePaymentRequest} payload
	 * @param {string} idempotenceKey
	 * @returns {Promise<Payment>}
	 */
	async createPayment(payload: ICreatePaymentRequest, idempotenceKey: string) {
		const response = await this.request<IPayment>(
			'POST',
			'payments',
			payload,
			idempotenceKey,
		)
		return new Payment(response)
	}

	/**
	 * Get info about a payment by id
	 * @see https://yookassa.ru/developers/api#get_payment
	 * @param {string} paymentId
	 * @param {string} idempotenceKey
	 * @returns {Promise<Payment>}
	 */
	async getPayment(paymentId, idempotenceKey) {
		const response = await this.request<IPayment>(
			'GET',
			`payments/${paymentId}`,
			null,
			idempotenceKey,
		)
		return new Payment(response)
	}

	/**
	 * Capture a payment with status 'waiting_for_capture'. status change to 'succeeded'
	 * @see https://yookassa.ru/developers/api#capture_payment
	 * @param {string} paymentId
	 * @param {Object} amount
	 * @param {string} idempotenceKey
	 * @returns {Promise<Payment>}
	 */
	capturePayment(paymentId, amount, idempotenceKey) {
		return this.request<IPayment>(
			'POST',
			`payments/${paymentId}/capture`,
			{ amount },
			idempotenceKey,
		).then((data) => {
			return new Payment(this, data)
		})
	}

	/**
	 * Cancel a payment with status 'waiting_for_capture'. status change to 'canceled'
	 * @see https://kassa.yandex.ru/docs/checkout-api/#otmena-platezha
	 * @param {string} paymentId
	 * @param {string} idempotenceKey
	 * @returns {Promise<Payment>}
	 */
	cancelPayment(paymentId, idempotenceKey) {
		return this.request(
			'POST',
			`payments/${paymentId}/cancel`,
			null,
			idempotenceKey,
		).then((data) => {
			return new Payment(this, data)
		})
	}

	/**
	 * Create a refund
	 * @see https://yookassa.ru/developers/api#create_refund
	 * @param {string} paymentId
	 * @param {Object} amount
	 * @param {string} idempotenceKey
	 * @returns {Promise<Refund>}
	 */
	createRefund(paymentId, amount, idempotenceKey) {
		return this.request(
			'POST',
			'refunds',
			{ payment_id: paymentId, amount },
			idempotenceKey,
		).then((data) => {
			return new Refund(this, data)
		})
	}

	/**
	 * Get info about a refund by id
	 * @see https://yookassa.ru/developers/api#get_refund
	 * @param {string} refundId
	 * @param {string} idempotenceKey
	 * @returns {Promise<Refund>}
	 */
	getRefund(refundId, idempotenceKey) {
		return this.request('GET', `refunds/${refundId}`, {}, idempotenceKey).then(
			(data) => {
				return new Refund(this, data)
			},
		)
	}

	async request<T>(
		method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
		path: string,
		payload?: ICreatePaymentRequest,
		idempotenceKey?: string,
	): Promise<T> {
		/**
		 * Generate idempotence key if not present
		 * @see https://yookassa.ru/developers/using-api/basics#idempotence
		 */
		idempotenceKey = idempotenceKey || uuid()
		const uri = this.apiUrl + path

		if (this.debug) {
			// eslint-disable-next-line no-console
			console.log(`${method}: ${uri}`)
		}

		const response = await request<IPayment>({
			method,
			url: uri,
			timeout: this.timeout,
			data: payload,
			auth: {
				username: this.shopId,
				password: this.secretKey,
			},
			headers: {
				/**
				 * @see https://yookassa.ru/developers/using-api/basics#idempotence
				 */
				'Idempotence-Key': idempotenceKey,
			},
		})
		return response.data
	}
}

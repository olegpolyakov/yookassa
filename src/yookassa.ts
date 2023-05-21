import request from 'axios'
import { v4 as uuid } from 'uuid'
import Payment from './payment'
import Refund from './refund'
import PaymentError from './payment-error'
import * as utils from './utils'
import { ICreatePaymentRequest } from './types/Payment'
import { IAmount } from './types/Common'

const DEFAULT_URL = 'https://api.yookassa.ru/v3/'
const DEFAULT_DEBUG = false
const DEFAULT_TIMEOUT = 120000 // 2 minutes (Node's default timeout)
const DEFAULT_DELAY = 60000 // 1 minute

export default class YooKassa {
	shopId: string
	secretKey: string
	apiUrl: string
	debug: boolean
	timeout: number
	retryDelay: number

	/**
	 * @param {string} shopId
	 * @param {string} secretKey
	 * @param {string} apiUrl
	 * @param {string} debug
	 * @param {string} timeout
	 * @param {string} retryDelay
	 * @returns {YooKassa}
	 */
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
	 * @param {Object} payload
	 * @param {string} idempotenceKey
	 * @returns {Promise<Payment>}
	 */
	createPayment(payload: ICreatePaymentRequest, idempotenceKey: string) {
		return this.request<Payment>(
			'POST',
			'payments',
			payload,
			idempotenceKey,
		).then((data) => {
			return new Payment(this, data)
		})
	}

	/**
	 * Get info about a payment by id
	 * @see https://yookassa.ru/developers/api#get_payment
	 * @param {string} paymentId
	 * @param {string} idempotenceKey
	 * @returns {Promise<Payment>}
	 */
	getPayment(paymentId: string, idempotenceKey: string = null) {
		return this.request<Payment>(
			'GET',
			`payments/${paymentId}`,
			{},
			idempotenceKey,
		).then((data) => {
			return new Payment(this, data)
		})
	}

	/**
	 * Capture a payment with status 'waiting_for_capture'. status change to 'succeeded'
	 * @see https://yookassa.ru/developers/api#capture_payment
	 * @param {string} paymentId
	 * @param {Object} amount
	 * @param {string} idempotenceKey
	 * @returns {Promise<Payment>}
	 */
	capturePayment(
		paymentId: string,
		amount: IAmount,
		idempotenceKey: string = null,
	) {
		return this.request<Payment>(
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
	cancelPayment(paymentId: string, idempotenceKey: string = null) {
		return this.request<Payment>(
			'POST',
			`payments/${paymentId}/cancel`,
			{},
			idempotenceKey,
		).then((data: Payment) => {
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
	createRefund(paymentId: string, amount: IAmount, idempotenceKey = null) {
		return this.request<Payment>(
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
	getRefund(refundId: string, idempotenceKey: string = null) {
		return this.request<Refund>(
			'GET',
			`refunds/${refundId}`,
			{},
			idempotenceKey,
		).then((data) => {
			return new Refund(this, data)
		})
	}

	request<T>(
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD',
		path: string,
		payload: unknown,
		idempotenceKey: string = null,
	): Promise<T> {
		/**
		 * Generate idempotence key if not present
		 * @see https://yookassa.ru/developers/using-api/basics#idempotence
		 */
		if (!idempotenceKey) {
			idempotenceKey = uuid()
		}

		const uri = this.apiUrl + path

		if (this.debug) {
			// eslint-disable-next-line no-console
			console.log(`${method}: ${uri}`)
		}

		return request({
			method,
			url: uri,
			data: payload,
			timeout: this.timeout,
			auth: {
				username: this.shopId,
				password: this.secretKey,
			},
			headers: {
				'Idempotence-Key': idempotenceKey,
			},
		})
			.then((response) => {
				switch (response.status) {
					/**
					 * Retry request
					 * @see https://yookassa.ru/developers/using-api/basics#sync
					 */
					case 202:
						return utils
							.delay(response.data.retry_after || this.retryDelay)
							.then(
								this.request.bind(this, method, path, payload, idempotenceKey),
							)

					/**
					 * Normal response
					 */
					default:
						return response.data
				}
			})
			.catch((error) => {
				/**
				 * @see https://yookassa.ru/developers/using-api/basics#http-codes
				 */
				return Promise.reject(new PaymentError(error))
			})
	}
}

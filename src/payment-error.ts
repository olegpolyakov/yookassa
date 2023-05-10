export class PaymentError extends Error {
	private parameter: any
	constructor(error: Error) {
		super(error.message)

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, PaymentError)
		} else {
			this.stack = new Error().stack
		}

		this.name = 'PaymentError'
		this.message = error.message
	}
}

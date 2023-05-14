import YooKassa from './yookassa'

export default class Refund {
	_instance: YooKassa
	id: string
	constructor(instance, data) {
		Object.assign(this, data, { _instance: instance })
	}

	reload() {
		return this._instance.getRefund(this.id).then((data) => {
			Object.assign(this, data)
			return true
		})
	}
}

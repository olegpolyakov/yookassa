import { IPaymentMethod } from './PaymentMethod'
import { IReceipt, ReceiptRegistrationEnum } from './Receipt'
import { IAmount, LocaleEnum } from './Common'

export enum PaymentStatusEnum {
	/** Платеж создан, но не завершен */
	PENDING = 'pending',

	/** Платеж завершен и ожидает ваших действий */
	WAITING_FOR_CAPTURE = 'waiting_for_capture',

	/** Платеж успешно завершен, деньги придут на ваш расчетный счет */
	SUCCEEDED = 'succeeded',

	/** Платеж отменен */
	CANCELED = 'canceled',
}

export interface ICreatePaymentRequest {
	/** Сумма платежа. Иногда партнеры ЮKassa берут с пользователя дополнительную комиссию, которая не входит в эту сумму. */
	amount: IAmount
	/** Описание транзакции (не более 128 символов), которое вы увидите в личном кабинете ЮKassa, а пользователь — при оплате. Например: «Оплата заказа № 72 для user@yoomoney.ru». */
	description?: string
	/** Данные для формирования чека.
	 * Необходимо передавать в этих случаях:
	 * вы компания или ИП, используете решение ЮKassa для оплаты по 54-ФЗ  и отправляете данные для формирования чеков по одному из сценариев: Платеж и чек одновременно  или Сначала чек, потом платеж ;
	 * вы самозанятый и используете решение ЮKassa для автоотправки чеков
	 **/
	receipt?: IReceipt
	/** Получатель платежа. Нужен, если вы разделяете потоки платежей в рамках одного аккаунта или создаете платеж в адрес другого аккаунта. */
	recipient?: {
		/** Идентификатор субаккаунта. Используется для разделения потоков платежей в рамках одного аккаунта. */
		gateway_id: string
	}
	/** Данные для оплаты конкретным способом  (payment_method). Вы можете не передавать этот объект в запросе. В этом случае пользователь будет выбирать способ оплаты на стороне ЮKassa. */
	payment_method_data?: IPaymentMethod
	/** Автоматический прием  поступившего платежа. */
	capture: boolean
	/** Данные, необходимые для инициирования выбранного сценария подтверждения платежа пользователем. Подробнее о сценариях подтверждения  */
	confirmation: IConfirmation
	/** Сохранение платежных данных (с их помощью можно проводить повторные безакцептные списания ). Значение true инициирует создание многоразового payment_method. */
	save_payment_method?: boolean
	/** Идентификатор покупателя в вашей системе, например электронная почта или номер телефона. Не более 200 символов. Присутствует, если вы хотите запомнить банковскую карту и отобразить ее при повторном платеже в виджете ЮKassa . */
	merchant_customer_id?: string
}

/** === CONFIRMATION == */
export type IConfirmation =
	| IConfirmationRedirect
	| IConfirmationEmbedded
	| IConfirmationQR
	| IConfirmationExternal
	| IConfirmationMobileApp

export enum ConfirmationTypesEnum {
	embedded = 'embedded',
	external = 'external',
	mobile_application = 'mobile_application',
	qr = 'qr',
	redirect = 'redirect',
}

export interface IConfirmationRedirect {
	/** Код сценария подтверждения. */
	type: 'redirect'
	/** URL, на который необходимо перенаправить пользователя для подтверждения оплаты. */
	confirmation_url: string
	/** Запрос на проведение платежа с аутентификацией по 3-D Secure. Будет работать, если оплату банковской картой вы по умолчанию принимаете без подтверждения платежа пользователем. В остальных случаях аутентификацией по 3-D Secure будет управлять ЮKassa. Если хотите принимать платежи без дополнительного подтверждения пользователем, напишите вашему менеджеру ЮKassa. */
	enforce?: boolean
	/** Язык интерфейса, писем и смс, которые будет видеть или получать пользователь. Формат соответствует ISO/IEC 15897. Возможные значения: ru_RU, en_US. Регистр важен. */
	locale?: LocaleEnum
	/** URL, на который вернется пользователь после подтверждения или отмены платежа на веб-странице. Не более 2048 символов. */
	return_url: string
}

export interface IConfirmationEmbedded {
	/** Код сценария подтверждения. */
	type: ConfirmationTypesEnum.embedded
	/** Язык интерфейса, писем и смс, которые будет видеть или получать пользователь. Формат соответствует ISO/IEC 15897. Возможные значения: ru_RU, en_US. Регистр важен. */
	locale?: LocaleEnum
}

export interface IConfirmationQR {
	type: ConfirmationTypesEnum.qr
	//TODO: Добавить типы для QR-код
	any: unknown
}

export interface IConfirmationExternal {
	type: ConfirmationTypesEnum.external
	//TODO: Добавить типы для External
	any: unknown
}

export interface IConfirmationMobileApp {
	type: ConfirmationTypesEnum.mobile_application
	//TODO: Добавить типы для MobileApplication
	any: unknown
}

export interface IPayment {
	/** Идентификатор платежа в ЮKassa. */
	id: string
	/** Статус платежа. Возможные значения: pending, waiting_for_capture, succeeded и canceled.  */
	status: PaymentStatusEnum
	/** Сумма платежа. Иногда партнеры ЮKassa берут с пользователя дополнительную комиссию, которая не входит в эту сумму. */
	amount: IAmount
	/** Сумма платежа, которую получит магазин, — значение amount за вычетом комиссии ЮKassa. Если вы партнер  и для аутентификации запросов используете OAuth-токен, запросит */
	income_amount?: IAmount
	/** Описание транзакции (не более 128 символов), которое вы увидите в личном кабинете ЮKassa, а пользователь — при оплате. Например: «Оплата заказа № 72 для user@yoomoney.ru». */
	description?: string
	/** Получатель платежа. */
	recipient: {
		/** Идентификатор магазина в ЮKassa. */
		account_id: string
		/** Идентификатор субаккаунта. Используется для разделения потоков платежей в рамках одного аккаунта. */
		gateway_id: string
	}
	/** Способ оплаты , который был использован для этого платежа. */
	payment_method?: IPaymentMethod
	/** Время подтверждения платежа. Указывается по UTC и передается в формате ISO 8601. */
	captured_at?: string
	/** Время создания заказа. Указывается по UTC и передается в формате ISO 8601. Пример: 2017-11-03T11:52:31.827Z*/
	created_at: string
	/** Время, до которого вы можете бесплатно отменить или подтвердить платеж. В указанное время платеж в статусе waiting_for_capture будет автоматически отменен. Указывается по UTC и передается в формате ISO 8601. Пример: 2017-11-03T11:52:31.827Z */
	expires_at?: string
	/** Выбранный способ подтверждения платежа. Присутствует, когда платеж ожидает подтверждения от пользователя. Подробнее о сценариях подтверждения */
	confirmation?: IConfirmation
	/** Признак тестовой операции. */
	test: boolean
	/** Сумма, которая вернулась пользователю. Присутствует, если у этого платежа есть успешные возвраты. */
	refunded_amount?: IAmount
	/** Признак оплаты заказа. */
	paid: boolean
	/** Возможность провести возврат по API. */
	refundable: boolean
	/** Статус регистрации чека. Присутствует, если вы используете решения ЮKassa для отправки чеков в налоговую. */
	receipt_registration?: ReceiptRegistrationEnum
	/** Любые дополнительные данные, которые нужны вам для работы (например, ваш внутренний идентификатор заказа). Передаются в виде набора пар «ключ-значение» и возвращаются в ответе от ЮKassa. Ограничения: максимум 16 ключей, имя ключа не больше 32 символов, значение ключа не больше 512 символов, тип данных — строка в формате UTF-8. */
	metadata?: object
}

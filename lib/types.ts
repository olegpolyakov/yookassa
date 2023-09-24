export enum PaymentMethod {
    ALFABANK = 'alfabank',
    MOBILE_BALANCE = 'mobile_balance',
    BANK_CARD = 'bank_card',
    INSTALLMENTS = 'installments',
    CASH = 'cash',
    B2B_SBERBANK = 'b2b_sberbank',
    SBERBANK = 'sberbank',
    TINKOFF_BANK = 'tinkoff_bank',
    YOO_MONEY = 'yoo_money',
    APPLE_PAY = 'apple_pay',
    GOOGLE_PAY = 'google_pay',
    QIWI = 'qiwi',
    WECHAT = 'wechat',
    WEBMONEY = 'webmoney'
}

export enum PaymentStatus {
    /** Платеж создан, но не завершен */
    PENDING = 'pending',
    /** Платеж завершен и ожидает ваших действий */
    WAITING_FOR_CAPTURE = 'waiting_for_capture',
    /** Платеж успешно завершен, деньги придут на ваш расчетный счет */
    SUCCEEDED = 'succeeded',
    /** Платеж отменен */
    CANCELED = 'canceled'
}

export enum PaymentSubject {
    COMMODITY = 'commodity',
    EXCISE = 'excise',
    JOB = 'job',
    SERVICE = 'service',
    GAMBLING_BET = 'gambling_bet',
    GAMBLING_PRIZE = 'gambling_prize',
    LOTTERY = 'lottery',
    LOTTERY_PRIZE = 'lottery_prize',
    INTELLECTUAL_ACTIVITY = 'intellectual_activity',
    PAYMENT = 'payment',
    AGENT_COMMISSION = 'agent_commission',
    PROPERTY_RIGHT = 'property_right',
    NON_OPERATING_GAIN = 'non_operating_gain',
    INSURANCE_PREMIUM = 'insurance_premium',
    SALES_TAX = 'sales_tax',
    RESORT_FEE = 'resort_fee',
    COMPOSITE = 'composite',
    ANOTHER = 'another'
};

export enum TaxSystem {
    /** Общая система налогообложения */
    GENERAL = 1,
    /** Упрощенная (УСН, доходы) */
    SIMPLIFIED_INCOME = 2,
    /** Упрощенная (УСН, доходы минус расходы) */
    SIMPLIFIED_PROFIT = 3,
    /** Единый налог на вмененный доход (ЕНВД) */
    ENVD = 4,
    /** Единый сельскохозяйственный налог (ЕСН) */
    ESN = 5,
    /** Патентная система налогообложения */
    PSN = 6
}

export enum VAT {
    NONE = 1,
    ZERO = 2,
    TEN = 3,
    TWENTY = 4,
    '10_110' = 5,
    '20_120' = 6
}

export interface Payment {
    /** Идентификатор платежа в ЮKassa. */
    id: string;
    /** Статус платежа. */
    status: string;
    amount: {
        value: string;
        currency: string;
    };
    income_amount?: {
        value: string;
        currency: string;
    };
    description?: string;

}
/**
 * @see https://yookassa.ru/developers/api#payment_object
 * @typedef {object} Payment
 * @property {string} id - Идентификатор платежа в ЮKassa.
 * @property {boolean} status - Статус платежа.
 * @property {object} amount - Сумма платежа.
 * @property {string} amount.value - Сумма в выбранной валюте.
 * @property {string} amount.currency - Код валюты в формате ISO-4217.
 * * @property {object} [income_amount] - Сумма платежа, которую получит магазин.
 * @property {string} income_amount.value - Сумма в выбранной валюте.
 * @property {string} income_amount.currency - Код валюты в формате ISO-4217.
 * @property {string} [description] - Описание транзакции.
 * @property {object} recipient - Получатель платежа.
 * @property {string} recipient.account_id - Идентификатор магазина в ЮKassa.
 * @property {string} recipient.gateway_id - Идентификатор субаккаунта.
 * @property {object} [payment_method] - Способ оплаты.
 * @property {string} payment_method.type - Код способа оплаты.
 * @property {string} payment_method.id - Идентификатор способа оплаты.
 * @property {boolean} payment_method.saved - С помощью сохраненного способа оплаты можно проводить безакцептные списания.
 * @property {string} [payment_method.title] - Название способа оплаты.
 * @property {string} [payment_method.login] - Логин пользователя в Альфа-Клике (привязанный телефон или дополнительный логин).
 * @property {object} [payment_method.card] - Данные банковской карты.
 * @property {string} [payment_method.card.first6] - Первые 6 цифр номера карты (BIN).
 * @property {string} payment_method.card.last4 - Последние 4 цифры номера карты.
 * @property {string} payment_method.card.expiry_year - Срок действия, год, YYYY.
 * @property {string} payment_method.card.expiry_month - Срок действия, месяц, MM.
 * @property {string} payment_method.card.card_type - Тип банковской карты.
 * @property {string} [payment_method.card.issuer_country] - Код страны, в которой выпущена карта.
 * @property {string} [payment_method.card.issuer_name] - Наименование банка, выпустившего карту.
 * @property {string} [payment_method.card.source] - Источник данных банковской карты.
 * @property {string} [captured_at] - Время подтверждения платежа.
 * @property {string} created_at - Время создания заказа.
 * @property {string} [expires_at] - Время, до которого вы можете бесплатно отменить или подтвердить платеж.
 * @property {object} [confirmation] - Выбранный способ подтверждения платежа.
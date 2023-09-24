const PaymentMethod = {
    ALFABANK: 'alfabank',
    MOBILE_BALANCE: 'mobile_balance',
    BANK_CARD: 'bank_card',
    INSTALLMENTS: 'installments',
    CASH: 'cash',
    B2B_SBERBANK: 'b2b_sberbank',
    SBERBANK: 'sberbank',
    TINKOFF_BANK: 'tinkoff_bank',
    YOO_MONEY: 'yoo_money',
    APPLE_PAY: 'apple_pay',
    GOOGLE_PAY: 'google_pay',
    QIWI: 'qiwi',
    WECHAT: 'wechat',
    WEBMONEY: 'webmoney'
};

const PaymentMode = {

};

const PaymentStatus = {
    /** Платеж создан, но не завершен */
    PENDING: 'pending',
    /** Платеж завершен и ожидает ваших действий */
    WAITING_FOR_CAPTURE: 'waiting_for_capture',
    /** Платеж успешно завершен, деньги придут на ваш расчетный счет */
    SUCCEEDED: 'succeeded',
    /** Платеж отменен */
    CANCELED: 'canceled'
};

const PaymentSubject = {
    COMMODITY: 'commodity',
    EXCISE: 'excise',
    JOB: 'job',
    SERVICE: 'service',
    GAMBLING_BET: 'gambling_bet',
    GAMBLING_PRIZE: 'gambling_prize',
    LOTTERY: 'lottery',
    LOTTERY_PRIZE: 'lottery_prize',
    INTELLECTUAL_ACTIVITY: 'intellectual_activity',
    PAYMENT: 'payment',
    AGENT_COMMISSION: 'agent_commission',
    PROPERTY_RIGHT: 'property_right',
    NON_OPERATING_GAIN: 'non_operating_gain',
    INSURANCE_PREMIUM: 'insurance_premium',
    SALES_TAX: 'sales_tax',
    RESORT_FEE: 'resort_fee',
    COMPOSITE: 'composite',
    ANOTHER: 'another'
};

const TaxSystem = {
    /** Общая система налогообложения */
    GENERAL: 1,
    /** Упрощенная (УСН, доходы) */
    SIMPLIFIED_INCOME: 2,
    /** Упрощенная (УСН, доходы минус расходы) */
    SIMPLIFIED_PROFIT: 3,
    /** Единый налог на вмененный доход (ЕНВД) */
    ENVD: 4,
    /** Единый сельскохозяйственный налог (ЕСН) */
    ESN: 5,
    /** Патентная система налогообложения */
    PSN: 6
};

const VAT = {
    NONE: 1,
    '0': 2,
    '10': 3,
    '20': 4,
    '10_110': 5,
    '20_120': 6
};

module.exports = {
    PaymentMethod,
    PaymentMode,
    PaymentStatus,
    PaymentSubject,
    TaxSystem,
    VAT
};
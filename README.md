# YooKassa API для Node.js

Клиент для работы с платежами по API YooKassa. Подходит тем, у кого способ подключения называется API.

## Требования

1. Node.js
2. npm

## Установка

```sh
npm i yookassa
```

## Начало работы

```js
const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
    shopId: '<Идентификатор магазина>',
    secretKey: '<Секретный ключ>'
});

const payment = await yooKassa.createPayment({
    amount: {
      value: "2.00",
      currency: "RUB"
    },
    payment_method_data: {
        type: "bank_card"
    },
    confirmation: {
      type: "redirect",
      return_url: "https://www.merchant-website.com/return_url"
    },
    description: "Заказ №72"
});
```

## API кассы

| Метод            | Описание                                                                    |
| ---              | ---                                                                         |
| `createPayment`  | [Создание платежа](https://yookassa.ru/developers/api#create_payment)       |
| `getPayment`     | [Информация о платеже](https://yookassa.ru/developers/api#get_payment)      |
| `capturePayment` | [Подтверждение платежа](https://yookassa.ru/developers/api#capture_payment) |
| `cancelPayment`  | [Отмена платежа](https://yookassa.ru/developers/api#cancel_payment)         |
| `createRefund`   | [Создание возврата](https://yookassa.ru/developers/api#create_refund)       |
| `getRefund`      | [Информация о возврате](https://yookassa.ru/developers/api#get_refund)      |


## API платежа

### Свойства

| Название              | Описание                                           |
| ---                   | ---                                                |
| `isPending`           | Равен ли статус платежа `pending`                  |
| `isWaitingForCapture` | Равен ли статус платежа `waiting_for_capture`      |
| `isSucceeded`         | Равен ли статус платежа `succeeded`                |
| `isCanceled`          | Равен ли статус платежа `canceled`                 |
| `isResolved`          | Равен ли статус платежа `succeeded` или `canceled` |
| `confirmationUrl`     | URL для подтверждения                              |


### Методы

| Название  | Аргументы | Описание                      |
| ---       | ---       | ---                           |
| `reload`  |           | Получить информацию о платеже |
| `capture` | amount    | Подтвердить платеж            |
| `cancel`  |           | Отменить платеж               |
| `refund`  | amount    | Вернуть платеж                |


## API возврата

### Методы

| Название  | Аргументы | Описание                       |
| ---       | ---       | ---                            |
| `reload`  |           | Получить информацию о возврате |
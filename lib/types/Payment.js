"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationTypesEnum = exports.PaymentStatusEnum = void 0;
var PaymentStatusEnum;
(function (PaymentStatusEnum) {
    PaymentStatusEnum["PENDING"] = "pending";
    PaymentStatusEnum["WAITING_FOR_CAPTURE"] = "waiting_for_capture";
    PaymentStatusEnum["SUCCEEDED"] = "succeeded";
    PaymentStatusEnum["CANCELED"] = "canceled";
})(PaymentStatusEnum = exports.PaymentStatusEnum || (exports.PaymentStatusEnum = {}));
var ConfirmationTypesEnum;
(function (ConfirmationTypesEnum) {
    ConfirmationTypesEnum["embedded"] = "embedded";
    ConfirmationTypesEnum["external"] = "external";
    ConfirmationTypesEnum["mobile_application"] = "mobile_application";
    ConfirmationTypesEnum["qr"] = "qr";
    ConfirmationTypesEnum["redirect"] = "redirect";
})(ConfirmationTypesEnum = exports.ConfirmationTypesEnum || (exports.ConfirmationTypesEnum = {}));
//# sourceMappingURL=Payment.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptRegistrationEnum = exports.TaxSystemCodesEnum = exports.VatCodesEnum = void 0;
var VatCodesEnum;
(function (VatCodesEnum) {
    VatCodesEnum[VatCodesEnum["ndsNone"] = 1] = "ndsNone";
    VatCodesEnum[VatCodesEnum["nds0"] = 2] = "nds0";
    VatCodesEnum[VatCodesEnum["nds10"] = 3] = "nds10";
    VatCodesEnum[VatCodesEnum["nds20"] = 4] = "nds20";
    VatCodesEnum[VatCodesEnum["nds10/110"] = 5] = "nds10/110";
    VatCodesEnum[VatCodesEnum["nds20/120"] = 6] = "nds20/120";
})(VatCodesEnum = exports.VatCodesEnum || (exports.VatCodesEnum = {}));
var TaxSystemCodesEnum;
(function (TaxSystemCodesEnum) {
    TaxSystemCodesEnum[TaxSystemCodesEnum["OSN"] = 1] = "OSN";
    TaxSystemCodesEnum[TaxSystemCodesEnum["USN6"] = 2] = "USN6";
    TaxSystemCodesEnum[TaxSystemCodesEnum["USN15"] = 3] = "USN15";
    TaxSystemCodesEnum[TaxSystemCodesEnum["ENVD"] = 4] = "ENVD";
    TaxSystemCodesEnum[TaxSystemCodesEnum["ESN"] = 5] = "ESN";
    TaxSystemCodesEnum[TaxSystemCodesEnum["PSN"] = 6] = "PSN";
})(TaxSystemCodesEnum = exports.TaxSystemCodesEnum || (exports.TaxSystemCodesEnum = {}));
var ReceiptRegistrationEnum;
(function (ReceiptRegistrationEnum) {
    ReceiptRegistrationEnum["pending"] = "pending";
    ReceiptRegistrationEnum["succeeded"] = "succeeded";
    ReceiptRegistrationEnum["canceled"] = "canceled";
})(ReceiptRegistrationEnum = exports.ReceiptRegistrationEnum || (exports.ReceiptRegistrationEnum = {}));
//# sourceMappingURL=Receipt.js.map
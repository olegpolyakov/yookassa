"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
const delay = (ms) => {
    return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            resolve(true);
        }, ms);
    });
};
exports.delay = delay;
//# sourceMappingURL=utils.js.map
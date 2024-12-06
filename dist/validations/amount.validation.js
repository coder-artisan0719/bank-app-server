"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSufficientBalance = exports.validateAmount = void 0;
const validateAmount = (amount) => {
    if (amount <= 0) {
        return "Amount must be positive";
    }
    return null;
};
exports.validateAmount = validateAmount;
const validateSufficientBalance = (balance, amount) => {
    if (balance < amount) {
        return "Insufficient funds";
    }
    return null;
};
exports.validateSufficientBalance = validateSufficientBalance;

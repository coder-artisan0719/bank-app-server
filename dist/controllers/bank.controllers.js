"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.history = exports.totalAmount = exports.transfer = exports.withdraw = exports.deposit = void 0;
const client_1 = require("@prisma/client");
const cards_validation_1 = require("../validations/cards.validation");
const amount_validation_1 = require("../validations/amount.validation");
const prisma = new client_1.PrismaClient();
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { amount } = req.body;
    const account = yield (0, cards_validation_1.validateAccountExists)(id);
    const amountError = (0, amount_validation_1.validateAmount)(amount);
    if (amountError)
        return res.status(400).json({ msg: amountError });
    if (typeof account !== "string") {
        const newBalance = (parseFloat(account.balance.replace(/,/g, "")) +
            parseFloat(amount.toFixed(2))).toLocaleString();
        yield prisma.deposit.create({
            data: {
                user: id,
                amount: `${amount.toLocaleString()}`,
                balance: newBalance,
                date: new Date().toLocaleString(),
            },
        });
        yield prisma.users.update({
            where: { userId: id },
            data: { date: new Date().toLocaleString(), balance: newBalance },
        });
        return res.status(200).json({ msg: "Deposit yourID" });
    }
    else
        return res.status(400).json({ msg: "Account not found" });
});
exports.deposit = deposit;
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { amount } = req.body;
    const amountError = (0, amount_validation_1.validateAmount)(amount);
    if (amountError)
        return res.status(400).json({ msg: amountError });
    const account = yield (0, cards_validation_1.validateAccountExists)(id);
    if (typeof account !== "string") {
        const balance = parseFloat(account.balance.replace(/,/g, ""));
        const balanceError = (0, amount_validation_1.validateSufficientBalance)(balance, amount);
        if (balanceError)
            return res.status(400).json({ msg: balanceError });
        const newBalance = (balance - amount).toLocaleString();
        const updatedAccount = yield prisma.withdraw.create({
            data: {
                user: id,
                amount: amount.toLocaleString(),
                date: new Date().toLocaleString(),
                balance: newBalance,
            },
        });
        yield prisma.users.update({
            where: { userId: id },
            data: { balance: newBalance, date: new Date().toLocaleString() },
        });
        return res.status(200).json(updatedAccount);
    }
    else {
        return res.status(400).json({ msg: "Account not found" });
    }
});
exports.withdraw = withdraw;
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { amount, cardId } = req.body;
    if (id === cardId)
        return res.status(400).json({ msg: "ID to send is yours" });
    const amountError = (0, amount_validation_1.validateAmount)(amount);
    if (amountError)
        return res.status(400).json({ msg: amountError });
    const sendAccount = yield (0, cards_validation_1.validateAccountExists)(id);
    if (typeof sendAccount !== "string") {
        const receiveAccount = yield (0, cards_validation_1.validateAccountExists)(cardId);
        if (typeof receiveAccount === "string")
            return res.status(400).json("Not Found ID to send");
        const sendBalance = parseFloat(sendAccount.balance.replace(/,/g, ""));
        const receiveBalance = parseFloat(receiveAccount.balance.replace(/,/g, ""));
        const balanceError = (0, amount_validation_1.validateSufficientBalance)(sendBalance, amount);
        if (balanceError)
            return res.status(400).json({ msg: balanceError });
        const newSendBalance = (sendBalance - amount).toLocaleString();
        const newReceiveBalance = (receiveBalance + amount).toLocaleString();
        const updatedSendAccount = yield prisma.transferSend.create({
            data: {
                sendId: id,
                receiveId: cardId,
                amount: amount.toLocaleString(),
                date: new Date().toLocaleString(),
                balance: newSendBalance,
            },
        });
        yield prisma.transferReceive.create({
            data: {
                sendId: id,
                receiveId: cardId,
                amount: amount.toLocaleString(),
                date: new Date().toLocaleString(),
                balance: newReceiveBalance,
            },
        });
        yield prisma.users.update({
            where: { userId: cardId },
            data: { balance: newReceiveBalance, date: new Date().toLocaleString() },
        });
        yield prisma.users.update({
            where: { userId: id },
            data: { balance: newSendBalance, date: new Date().toLocaleString() },
        });
        return res.status(200).json(updatedSendAccount);
    }
    else {
        return res.status(400).json({ msg: "Account not found" });
    }
});
exports.transfer = transfer;
const totalAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const card = yield prisma.users.findUnique({
        where: { userId: id },
    });
    if (!card)
        return res.status(400).json("Not found ID");
    const amount = parseFloat(card.balance.replace(/,/g, ""));
    return res.status(200).json(amount);
});
exports.totalAmount = totalAmount;
const history = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { page } = req.body;
    const limit = 5;
    const offset = (page - 1) * limit;
    const combinedHistory = yield prisma.$queryRaw `
    SELECT amount, balance, date, "user" AS id, 'deposits' AS type FROM "Deposit" WHERE "user" = ${id}
    UNION ALL
    SELECT amount, balance, date, "user" AS id, 'withdraws' AS type FROM "Withdraw" WHERE "user" = ${id}
    UNION ALL
    SELECT amount, balance, date, "receiveId" AS id, 'send' AS type FROM "TransferSend" WHERE "sendId" = ${id}
    UNION ALL
    SELECT amount, balance, date, "sendId" AS id, 'receive' AS type FROM "TransferReceive" WHERE "receiveId" = ${id}
    ORDER BY date DESC
    LIMIT ${limit} OFFSET ${offset};
  `;
    const totalCount = yield prisma.$queryRaw `
   SELECT 1 FROM "Deposit" WHERE "user" = ${id}
    UNION ALL
    SELECT 1 FROM "Withdraw" WHERE "user" = ${id}
    UNION ALL
    SELECT 1 FROM "TransferSend" WHERE "sendId" = ${id}
    UNION ALL
    SELECT 1 FROM "TransferReceive" WHERE "receiveId" = ${id}
  `;
    const total = Math.round((totalCount.length || 0) / limit);
    return res.status(200).json({ data: combinedHistory, total: total });
});
exports.history = history;

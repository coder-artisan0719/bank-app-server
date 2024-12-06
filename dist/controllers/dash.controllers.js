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
exports.dashes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSum = (data) => data.reduce((total, { amount }) => total + Math.abs(parseFloat(amount.replace(/,/g, ""))), 0);
const dashes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const total = (_a = (yield prisma.users.findUnique({ where: { userId: id } }))) !== null && _a !== void 0 ? _a : {
        balance: 0,
    };
    const totalData = total.balance;
    const [send, receive, deposit, withdraw] = yield Promise.all([
        prisma.transferSend.findMany({ where: { sendId: id } }),
        prisma.transferReceive.findMany({ where: { receiveId: id } }),
        prisma.deposit.findMany({ where: { user: id } }),
        prisma.withdraw.findMany({ where: { user: id } }),
    ]);
    const sendData = getSum(send);
    const receiveData = getSum(receive);
    const depositData = getSum(deposit);
    const withdrawData = getSum(withdraw);
    const come = {
        send: (sendData + withdrawData).toLocaleString(),
        receive: (receiveData + depositData).toLocaleString(),
    };
    const combinedHistory = yield prisma.$queryRaw `
    SELECT amount, balance, date, "user" AS id, 'deposits' AS type FROM "Deposit" WHERE "user" = ${id}
    UNION ALL
    SELECT amount, balance, date, "user" AS id, 'withdraws' AS type FROM "Withdraw" WHERE "user" = ${id}
    UNION ALL
    SELECT amount, balance, date, "receiveId" AS id, 'send' AS type FROM "TransferSend" WHERE "sendId" = ${id}
    UNION ALL
    SELECT amount, balance, date, "sendId" AS id, 'receive' AS type FROM "TransferReceive" WHERE "receiveId" = ${id}
    ORDER BY date DESC
    LIMIT 7;
  `;
    res.status(200).json({ data: combinedHistory, rela: come, total: totalData });
});
exports.dashes = dashes;

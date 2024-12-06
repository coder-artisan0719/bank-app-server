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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bank_controllers_1 = require("../controllers/bank.controllers");
const router = express_1.default.Router();
router.post("/:id/deposit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bank_controllers_1.deposit)(req, res);
}));
router.post("/:id/withdraw", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bank_controllers_1.withdraw)(req, res);
}));
router.post("/:id/transfer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bank_controllers_1.transfer)(req, res);
}));
router.get("/:id/total", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bank_controllers_1.totalAmount)(req, res);
}));
router.post("/:id/history", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, bank_controllers_1.history)(req, res);
}));
exports.default = router;

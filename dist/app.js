"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const bank_routes_1 = __importDefault(require("./routes/bank.routes"));
const dash_routes_1 = __importDefault(require("./routes/dash.routes"));
const app = (0, express_1.default)();
exports.app = app;
const corsOptions = {
    origin: process.env.FRONTEND,
    methods: process.env.FRONTENDMETHODS,
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, body_parser_1.json)());
// Routes
app.use("/bank", bank_routes_1.default);
app.use("/dash", dash_routes_1.default);

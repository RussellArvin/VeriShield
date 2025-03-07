"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    redditAccessToken: process.env.REDDIT_ACCESS_TOKEN || "",
    port: process.env.PORT || 4000,
};

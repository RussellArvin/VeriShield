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
exports.suggestSubreddits = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = require("./config");
const openai = new openai_1.default({
    apiKey: config_1.config.openaiApiKey,
});
const suggestSubreddits = (keywords) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an AI that suggests relevant subreddit names based on given topics. List each subreddit as 'r/Name' on a new line.",
                },
                {
                    role: "user",
                    content: `Given the keywords: "${keywords}", suggest relevant subreddit names. List each one starting with "r/" and separate them by new lines.`,
                },
            ],
            max_tokens: 100, // Increased to allow more suggestions
        });
        const suggestedText = ((_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        // Extract all subreddit patterns (r/...) and remove 'r/' prefix
        const subredditMatches = suggestedText.match(/r\/[\w]+/g) || [];
        return subredditMatches.map(sub => sub.replace('r/', '').toLowerCase());
    }
    catch (error) {
        console.error("Error generating subreddit recommendations:", error);
        return [];
    }
});
exports.suggestSubreddits = suggestSubreddits;

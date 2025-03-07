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
const redditService_1 = require("./redditService");
const openaiService_1 = require("./openaiService");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// API Endpoint: Retrieve posts from relevant subreddits
app.post("/get-reddit-posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keywords, subreddits } = req.body;
    let allSubreddits = subreddits || [];
    if (allSubreddits.length === 0) {
        allSubreddits = yield (0, openaiService_1.suggestSubreddits)(keywords);
    }
    console.log("Fetching from subreddits:", allSubreddits);
    // Fetch posts from suggested subreddits
    const results = yield Promise.all(allSubreddits.map(redditService_1.fetchRedditPosts));
    const flattenedResults = results.flat();
    res.json(flattenedResults);
}));
// Start Express Server
app.listen(config_1.config.port, () => console.log(`Server running on port ${config_1.config.port}`));

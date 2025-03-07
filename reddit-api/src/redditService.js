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
exports.fetchRedditPosts = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
// Function to fetch new posts from a subreddit
const fetchRedditPosts = (subreddit) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const REDDIT_API_URL = `https://oauth.reddit.com/r/${subreddit}/new`;
    try {
        const response = yield axios_1.default.get(REDDIT_API_URL, {
            headers: {
                Authorization: `Bearer ${config_1.config.redditAccessToken}`,
                "User-Agent": "scraper/1.0 by Cultural-Will3920",
                'Accept': 'application/json'
            },
            timeout: 5000,
        });
        // Handle rate limiting - check remaining requests
        const remaining = response.headers['x-ratelimit-remaining'];
        const reset = response.headers['x-ratelimit-reset'];
        if (remaining && parseInt(remaining) < 2) {
            console.log(`Approaching rate limit. Resets in ${reset} seconds`);
            yield new Promise(resolve => setTimeout(resolve, (parseInt(reset) + 1) * 1000));
        }
        return {
            subreddit: subreddit,
            posts: response.data.data.children.map((post) => ({
                title: post.data.title,
                url: post.data.url,
                content: post.data.selftext || "",
                metadata: {
                    created_at: post.data.created_utc,
                    score: post.data.score
                }
            }))
        };
    }
    catch (error) {
        console.error(`Error fetching posts from r/${subreddit}:`, (_a = error.response) === null || _a === void 0 ? void 0 : _a.status, ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message);
        // Handle token expiration specifically
        if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 401) {
            console.log('Access token might be expired. Refresh required.');
        }
        return {
            subreddit: subreddit,
            posts: []
        };
    }
});
exports.fetchRedditPosts = fetchRedditPosts;

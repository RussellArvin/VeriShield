import { Router } from 'express';
import { getNewsArticles } from '../controllers/newsController';

const router = Router();

/**
 * @route POST /api/news
 * @desc Get news articles based on keywords and organization
 * @access Public
 */
router.post('/', getNewsArticles);

export default router;
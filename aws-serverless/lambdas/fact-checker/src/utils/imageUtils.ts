import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes the provided URL for all image links except .svg.
 * @param url The URL to scrape.
 * @returns Array of image links excluding .svg files.
 */
export const scrapeImagesFromURL = async (url: string): Promise<string[]> => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const imageLinks: string[] = [];

        $('img').each((_, element) => {
            const imgSrc = $(element).attr('src') || $(element).attr('data-src');
            
            if (imgSrc) {
                const absoluteURL = new URL(imgSrc, url).href;

                // Exclude .svg images
                if (!absoluteURL.match(/\.svg$/i)) {
                    imageLinks.push(absoluteURL);
                }
            }
        });

        return imageLinks;
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        throw new Error(`Failed to retrieve image links from ${url}`);
    }
};
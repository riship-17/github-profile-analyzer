const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

class BaseScraper {
    constructor(sourceName, baseUrl) {
        this.sourceName = sourceName;
        this.baseUrl = baseUrl;
        this.userAgents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        ];
    }

    getUserAgent() {
        return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
    }

    async fetch(url) {
        try {
            logger.info(`Fetching ${url}...`);
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': this.getUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                },
                timeout: 30000
            });
            return cheerio.load(response.data);
        } catch (err) {
            logger.error(`Failed to fetch ${url}`, err.message);
            throw err;
        }
    }

    async scrape() {
        throw new Error('scrape() method must be implemented');
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = BaseScraper;

const puppeteer = require('puppeteer');
const BaseScraper = require('./BaseScraper');
const logger = require('../utils/logger');

class UnstopScraper extends BaseScraper {
    constructor(keywords = []) {
        const query = keywords.length > 0 ? keywords.join(',').toLowerCase() : 'frontend,fullstack,backend';
        super('unstop', `https://unstop.com/internships?filters=,${query}`);
        this.keywords = keywords;
    }

    async scrape() {
        logger.info('Starting Unstop Scrape (Puppeteer)...');

        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const jobs = [];

        try {
            const page = await browser.newPage();
            await page.setUserAgent(this.getUserAgent());

            await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 60000 });

            try {
                await page.waitForSelector('a[href*="/internships/"]', { timeout: 15000 });
            } catch (e) {
                logger.info('Unstop: No listings found.');
                return [];
            }

            const listings = await page.evaluate(() => {
                const items = document.querySelectorAll('a[href*="/internships/"]');
                const results = [];

                items.forEach(item => {
                    try {
                        const titleEl = item.querySelector('h3.double-wrap, .double-wrap, h2');
                        const companyEl = item.querySelector('.single-wrap, .cptn p');
                        const tags = Array.from(item.querySelectorAll('.un-chip, .un_tag, .chip_text')).map(t => t.innerText.trim());

                        if (titleEl && companyEl) {
                            results.push({
                                title: titleEl.innerText.trim(),
                                company: companyEl.innerText.trim(),
                                url: item.href,
                                tags: tags
                            });
                        }
                    } catch (e) {}
                });
                return results;
            });

            listings.forEach(l => {
                jobs.push({
                    title: l.title,
                    company: l.company,
                    location: 'Remote/India',
                    url: l.url,
                    source: 'unstop',
                    datePosted: new Date(),
                    isInternship: true,
                    description: `Tags: ${l.tags.join(', ')}`,
                    tags: ['intern', ...l.tags.slice(0, 3)]
                });
            });

            logger.info(`Unstop: Found ${jobs.length} jobs.`);
        } catch (err) {
            logger.error('Unstop Scrape Failed:', err);
        } finally {
            await browser.close();
        }

        return jobs;
    }
}

module.exports = UnstopScraper;

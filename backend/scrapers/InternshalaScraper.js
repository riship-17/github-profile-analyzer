const puppeteer = require('puppeteer');
const BaseScraper = require('./BaseScraper');
const logger = require('../utils/logger');

class InternshalaScraper extends BaseScraper {
    constructor(keywords = []) {
        const query = keywords.length > 0 ? keywords.join('-').toLowerCase() : 'frontend-development,full-stack-development';
        super('internshala', `https://internshala.com/internships/${query}-internship`);
        this.keywords = keywords;
    }

    async scrape() {
        logger.info('Starting Internshala Scrape (Puppeteer)...');

        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
        });

        const page = await browser.newPage();
        const jobs = [];

        try {
            await page.setUserAgent(this.getUserAgent());
            await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

            await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 60000 });
            await page.waitForSelector('.individual_internship', { timeout: 15000 });

            const listings = await page.evaluate(() => {
                const items = document.querySelectorAll('.individual_internship:not(.jos_native_ad_text)');
                const results = [];

                items.forEach(item => {
                    try {
                        const titleEl = item.querySelector('.job-title-href');
                        const companyEl = item.querySelector('.company-name');
                        const locationEl = item.querySelector('.locations span');
                        const stipendEl = item.querySelector('.stipend');
                        const descriptionEl = item.querySelector('.about_job .text');

                        if (titleEl && companyEl) {
                            results.push({
                                title: titleEl.innerText.trim(),
                                company: companyEl.innerText.trim(),
                                location: locationEl ? locationEl.innerText.trim() : 'Remote',
                                url: titleEl.href,
                                stipend: stipendEl ? stipendEl.innerText.trim() : 'N/A',
                                descriptionSummary: descriptionEl ? descriptionEl.innerText.trim() : ''
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
                    location: l.location,
                    url: l.url,
                    source: 'internshala',
                    datePosted: new Date(),
                    isInternship: true,
                    description: `Stipend: ${l.stipend}. ${l.descriptionSummary.substring(0, 200)}...`,
                    tags: ['intern', 'frontend', 'fullstack']
                });
            });

            logger.info(`Internshala: Successfully found ${jobs.length} jobs.`);
        } catch (err) {
            logger.error('Internshala Scrape Failed:', err);
        } finally {
            await browser.close();
        }
        return jobs;
    }
}

module.exports = InternshalaScraper;

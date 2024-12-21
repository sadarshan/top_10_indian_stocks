// Core scraping functionality
export class Scraper {
  constructor(selector, nextPageSelector) {
    this.selector = selector;
    this.nextPageSelector = nextPageSelector;
    this.scrapedData = [];
  }

  async start() {
    const elements = document.querySelectorAll(this.selector);
    for (const element of elements) {
      const data = {
        timestamp: new Date().toISOString(),
        text: element.textContent.trim(),
        url: element.href || window.location.href,
        type: element.tagName === 'A' ? 'link' : 'text'
      };
      this.scrapedData.push(data);
    }
    
    return this.scrapedData;
  }

  getNextPageButton() {
    return document.querySelector(this.nextPageSelector);
  }
}
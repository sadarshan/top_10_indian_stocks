import { Storage } from '../utils/storage.js';
import { Scraper } from '../utils/scraper.js';

export class Automator {
  constructor() {
    this.isRunning = false;
    this.delay = 2000;
  }

  async init() {
    const config = await Storage.getConfig();
    this.isRunning = config.isRunning;
    this.delay = config.delay;
  }

  async start(selectors) {
    this.isRunning = true;
    await Storage.saveConfig({ isRunning: true, delay: this.delay });
    
    const scraper = new Scraper(selectors.elements, selectors.nextPage);
    
    while (this.isRunning) {
      // Scrape current page
      const newData = await scraper.start();
      const existingData = await Storage.getData();
      await Storage.saveData([...existingData, ...newData]);

      // Find and click next page
      const nextButton = scraper.getNextPageButton();
      if (!nextButton) {
        this.isRunning = false;
        break;
      }

      nextButton.click();
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  async stop() {
    this.isRunning = false;
    await Storage.saveConfig({ isRunning: false, delay: this.delay });
  }
}
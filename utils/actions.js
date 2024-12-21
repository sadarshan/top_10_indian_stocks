// Individual scraping actions
export class Actions {
  static async click(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.click();
      return true;
    }
    return false;
  }

  static async getText(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : '';
  }

  static async getLink(selector) {
    const element = document.querySelector(selector);
    return element?.href || '';
  }

  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async exists(selector) {
    return !!document.querySelector(selector);
  }
}
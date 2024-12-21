export const Storage = {
  async getFlows() {
    const result = await chrome.storage.local.get(['flows']);
    return result.flows || {};
  },

  async saveFlow(name, flow) {
    const flows = await this.getFlows();
    flows[name] = flow;
    await chrome.storage.local.set({ flows });
  },

  async getResults() {
    const result = await chrome.storage.local.get(['results']);
    return result.results || [];
  },

  async saveResults(results) {
    await chrome.storage.local.set({ results });
  }
}
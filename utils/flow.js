export class Flow {
  constructor(name) {
    this.name = name;
    this.steps = [];
    this.currentStep = 0;
    this.running = false;
  }

  addStep(action, params = {}) {
    this.steps.push({ action, params });
    return this;
  }

  async execute() {
    if (this.running) return [];
    
    this.running = true;
    const results = [];
    
    try {
      for (const step of this.steps) {
        const result = await step.action(step.params);
        results.push({
          timestamp: new Date().toISOString(),
          ...result
        });
        
        if (result === false) {
          break; // Stop if action fails
        }
      }
    } finally {
      this.running = false;
    }
    
    return results;
  }

  stop() {
    this.running = false;
  }
}
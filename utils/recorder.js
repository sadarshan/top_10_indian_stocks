import { Storage } from './storage.js';

export class Recorder {
  constructor() {
    this.recording = false;
    this.currentFlow = null;
  }

  startRecording(flowName) {
    this.recording = true;
    this.currentFlow = [];
    document.addEventListener('click', this.handleClick);
  }

  stopRecording() {
    this.recording = false;
    document.removeEventListener('click', this.handleClick);
    return this.currentFlow;
  }

  handleClick = async (event) => {
    if (!this.recording) return;

    const element = event.target;
    const action = {
      type: 'click',
      selector: this.getSelector(element),
      text: element.textContent.trim(),
      url: element.href || ''
    };

    this.currentFlow.push(action);
    await Storage.saveFlow(this.currentFlow);
  }

  getSelector(element) {
    // Simple selector generation
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }
}
import { Recorder } from './utils/recorder.js';
import { Flow } from './utils/flow.js';
import { Actions } from './utils/actions.js';
import { Storage } from './utils/storage.js';

const recorder = new Recorder();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.action) {
    case 'startRecording':
      recorder.startRecording(request.flowName);
      break;

    case 'stopRecording':
      const flow = recorder.stopRecording();
      await Storage.saveFlow(request.flowName, flow);
      break;

    case 'runFlow':
      const flows = await Storage.getFlows();
      const flowSteps = flows[request.flowName];
      
      if (flowSteps) {
        const iterations = request.iterations || 1;
        
        for (let i = 0; i < iterations; i++) {
          const flow = new Flow(request.flowName);
          
          for (const step of flowSteps) {
            switch (step.type) {
              case 'click':
                flow.addStep(() => Actions.click(step.selector));
                if (step.url) {
                  flow.addStep(() => Actions.wait(1000)); // Wait for navigation
                }
                break;
            }
          }

          const results = await flow.execute();
          // Add iteration number to results
          const resultsWithIteration = results.map(r => ({
            ...r,
            iteration: i + 1
          }));
          await Storage.saveResults(resultsWithIteration);
          
          // Wait between iterations
          if (i < iterations - 1) {
            await Actions.wait(2000);
          }
        }
      }
      break;
  }
});
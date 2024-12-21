import { Storage } from './utils/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  const recordButton = document.getElementById('recordFlow');
  const runButton = document.getElementById('runFlow');
  const runLoopButton = document.getElementById('runLoopFlow');
  const deleteButton = document.getElementById('deleteFlow');
  const exportButton = document.getElementById('exportResults');
  const flowList = document.getElementById('flowList');
  const loopCount = document.getElementById('loopCount');
  const status = document.getElementById('status');

  // Load saved flows
  async function updateFlowList() {
    const flows = await Storage.getFlows();
    flowList.innerHTML = Object.keys(flows)
      .map(name => `<option value="${name}">${name}</option>`)
      .join('');
  }
  
  await updateFlowList();

  // Record flow
  recordButton.addEventListener('click', async () => {
    const flowName = document.getElementById('flowName').value;
    if (!flowName) {
      status.textContent = 'Please enter a flow name';
      status.className = 'error';
      return;
    }

    const isRecording = recordButton.classList.contains('recording');
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: isRecording ? 'stopRecording' : 'startRecording',
        flowName
      });
    });

    recordButton.textContent = isRecording ? 'Start Recording' : 'Stop Recording';
    recordButton.classList.toggle('recording');
    await updateFlowList();
  });

  // Run flow once
  runButton.addEventListener('click', () => {
    runFlow(1);
  });

  // Run flow in loop
  runLoopButton.addEventListener('click', () => {
    const loops = parseInt(loopCount.value);
    if (loops < 1) {
      status.textContent = 'Please enter a valid loop count';
      status.className = 'error';
      return;
    }
    runFlow(loops);
  });

  async function runFlow(iterations) {
    const flowName = flowList.value;
    if (!flowName) {
      status.textContent = 'Please select a flow';
      status.className = 'error';
      return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'runFlow',
        flowName,
        iterations
      });
    });

    status.textContent = `Running flow ${iterations} time(s)...`;
    status.className = '';
  }

  // Delete flow
  deleteButton.addEventListener('click', async () => {
    const flowName = flowList.value;
    if (!flowName) return;

    const flows = await Storage.getFlows();
    delete flows[flowName];
    await Storage.saveFlows(flows);
    await updateFlowList();
    
    status.textContent = `Flow "${flowName}" deleted`;
    status.className = '';
  });

  // Export results
  exportButton.addEventListener('click', async () => {
    const results = await Storage.getResults();
    if (results.length === 0) {
      status.textContent = 'No results to export';
      status.className = 'error';
      return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Timestamp,Action,Selector,Text,URL,Iteration\n' +
      results.map(r => 
        `${r.timestamp},"${r.action}","${r.selector}","${r.text}","${r.url}","${r.iteration}"`
      ).join('\n');

    const encodedUri = encodeURI(csvContent);
    chrome.downloads.download({
      url: encodedUri,
      filename: 'scraping_results.csv'
    });
    
    status.textContent = 'Results exported successfully';
    status.className = '';
  });
});
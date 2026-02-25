// State
let isRunning = false;
let stopRequested = false;
let currentMode = 'unstarred';
let startTime = null;

// DOM refs
const blastBtn = document.getElementById('blastBtn');
const stopBtn = document.getElementById('stopBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const statusLog = document.getElementById('statusLog');
const statArchived = document.getElementById('statArchived');
const statRounds = document.getElementById('statRounds');
const statRate = document.getElementById('statRate');
const gmailWarning = document.getElementById('gmailWarning');
const mainUI = document.getElementById('mainUI');
const daysConfig = document.getElementById('daysConfig');
const daysInput = document.getElementById('daysInput');
const modeTabs = document.querySelectorAll('.mode-tab');

// Mode tab switching
modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (isRunning) return;
    modeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentMode = tab.dataset.mode;
    daysConfig.classList.toggle('visible', currentMode === 'older');
  });
});

// Init: check if we're on Gmail
async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url || !tab.url.includes('mail.google.com')) {
    gmailWarning.classList.add('visible');
    mainUI.style.display = 'none';
  }
}

init();

// Update UI stats
function updateStats(archived, rounds) {
  statArchived.textContent = archived.toLocaleString();
  statRounds.textContent = rounds;
  statRate.textContent = rounds > 0 ? Math.round(archived / rounds) : '—';

  // Indeterminate progress animation while running
  if (isRunning) {
    const fakeProgress = Math.min(95, (rounds / (rounds + 5)) * 100);
    progressFill.style.width = fakeProgress + '%';
  }
}

function setStatus(msg, type = '') {
  statusLog.textContent = msg;
  statusLog.className = 'status-log' + (type ? ' ' + type : '');
}

function setRunning(running) {
  isRunning = running;
  blastBtn.disabled = running;
  blastBtn.textContent = running ? '⏳ BLASTING...' : '💥 BLAST IT';
  blastBtn.classList.toggle('running', running);
  stopBtn.classList.toggle('visible', running);
  progressSection.classList.add('visible');
  if (running) progressSection.querySelector('.status-log')?.classList.add('running-pulse');
}

// The content script injected into Gmail
function gmailArchiver(config) {
  return new Promise((resolve) => {
    const { mode, days } = config;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function simulateClick(el) {
      ['mousedown', 'mouseup', 'click'].forEach(type => {
        el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }));
      });
    }

    function isOlderThan(row, days) {
      // Gmail stores date in the .xW span or similar time element
      const dateEl = row.querySelector('.xW span, .xW');
      if (!dateEl) return false;
      const dateStr = dateEl.getAttribute('title') || dateEl.textContent;
      if (!dateStr) return false;
      const msgDate = new Date(dateStr);
      if (isNaN(msgDate)) return false;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return msgDate < cutoff;
    }

    function shouldArchive(row) {
      if (mode === 'unstarred') {
        const starEl = row.querySelector('.T-KT');
        return !starEl || starEl.getAttribute('aria-label') !== 'Starred';
      } else if (mode === 'older') {
        return isOlderThan(row, days);
      }
      return false;
    }

    // Listen for stop messages
    let stopped = false;
    const stopListener = (event) => {
      if (event.data && event.data.type === 'BIB_STOP') {
        stopped = true;
      }
    };
    window.addEventListener('message', stopListener);

    async function run() {
      let totalArchived = 0;
      let round = 0;

      while (!stopped) {
        round++;
        await delay(1500);

        const rows = document.querySelectorAll('tr.zA');
        if (!rows.length) {
          window.removeEventListener('message', stopListener);
          resolve({ done: true, totalArchived, rounds: round - 1, reason: 'empty' });
          return;
        }

        const toArchive = [];
        rows.forEach(row => {
          if (shouldArchive(row)) toArchive.push(row);
        });

        if (!toArchive.length) {
          window.removeEventListener('message', stopListener);
          resolve({ done: true, totalArchived, rounds: round - 1, reason: 'none_left' });
          return;
        }

        // Send progress update
        window.postMessage({ type: 'BIB_PROGRESS', totalArchived, rounds: round, found: toArchive.length }, '*');

        // Click checkboxes
        toArchive.forEach(row => {
          const checkbox = row.querySelector('.oZ-jc');
          if (checkbox) simulateClick(checkbox);
        });

        await delay(800);

        const checkedCount = document.querySelectorAll('.oZ-jc[aria-checked="true"]').length;
        if (checkedCount === 0) {
          window.removeEventListener('message', stopListener);
          resolve({ done: false, totalArchived, rounds: round, reason: 'checkboxes_failed' });
          return;
        }

        const archiveBtn = document.querySelector('[data-tooltip="Archive"][aria-disabled="false"]');
        if (!archiveBtn) {
          window.removeEventListener('message', stopListener);
          resolve({ done: false, totalArchived, rounds: round, reason: 'no_archive_btn' });
          return;
        }

        simulateClick(archiveBtn);
        totalArchived += toArchive.length;

        await delay(2500);
      }

      window.removeEventListener('message', stopListener);
      resolve({ done: true, totalArchived, rounds: round, reason: 'stopped' });
    }

    run();
  });
}

// Main blast handler
blastBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url || !tab.url.includes('mail.google.com')) {
    gmailWarning.classList.add('visible');
    mainUI.style.display = 'none';
    return;
  }

  stopRequested = false;
  startTime = Date.now();
  setRunning(true);
  updateStats(0, 0);
  setStatus('🚀 Starting blast...', 'running');

  const config = {
    mode: currentMode,
    days: parseInt(daysInput.value) || 30,
  };

  try {
    // Inject progress listener first
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (window._bibProgressListener) {
          window.removeEventListener('message', window._bibProgressListener);
        }
        window._bibProgressListener = (e) => {
          if (e.data && e.data.type === 'BIB_PROGRESS') {
            chrome.runtime.sendMessage({
              type: 'BIB_PROGRESS',
              totalArchived: e.data.totalArchived,
              rounds: e.data.rounds,
              found: e.data.found,
            });
          }
        };
        window.addEventListener('message', window._bibProgressListener);
      }
    });

    // Listen for progress from content script
    const progressListener = (msg) => {
      if (msg.type === 'BIB_PROGRESS') {
        updateStats(msg.totalArchived, msg.rounds);
        setStatus(`Round ${msg.rounds}: archiving ${msg.found} messages...`, 'running');
      }
    };
    chrome.runtime.onMessage.addListener(progressListener);

    // Run the archiver
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: gmailArchiver,
      args: [config],
    });

    chrome.runtime.onMessage.removeListener(progressListener);

    const { totalArchived, rounds, reason } = result.result;
    updateStats(totalArchived, rounds);
    progressFill.style.width = '100%';

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    if (reason === 'stopped') {
      setStatus(`⏹ Stopped. Archived ${totalArchived.toLocaleString()} messages in ${timeStr}.`, '');
    } else if (reason === 'checkboxes_failed') {
      setStatus(`⚠️ Gmail UI issue — checkboxes didn't respond. Try reloading Gmail.`, 'error');
    } else if (reason === 'no_archive_btn') {
      setStatus(`⚠️ Archive button not found. Make sure you're in the inbox view.`, 'error');
    } else {
      setStatus(`✅ Done! Blasted ${totalArchived.toLocaleString()} emails in ${timeStr} across ${rounds} rounds.`, 'success');
    }

  } catch (err) {
    setStatus(`❌ Error: ${err.message}`, 'error');
    console.error(err);
  }

  setRunning(false);
});

// Stop button
stopBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.postMessage({ type: 'BIB_STOP' }, '*'),
  });
  setStatus('⏹ Stopping after this round...', '');
  stopBtn.classList.remove('visible');
});

// Background service worker for Bringetto Inbox Blaster
// Relays messages between content scripts and popup

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BIB_PROGRESS') {
    // Forward progress updates to any open popups
    chrome.runtime.sendMessage(message).catch(() => {
      // Popup may be closed, that's fine
    });
  }
});

/**
 * Background script for My Chrome Extension
 * Runs in the background as a service worker to handle extension events
 */

// Constants
const STORAGE_KEY = 'myExtensionData';
const ALARM_NAME = 'periodicCheck';

/**
 * Initialize the extension when installed or updated
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Set default values in storage
    chrome.storage.local.set({ 
      [STORAGE_KEY]: { 
        installDate: new Date().toISOString(),
        clickCount: 0
      } 
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error initializing storage:', chrome.runtime.lastError);
        return;
      }
      console.log('Extension initialized with default values');
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated to version:', chrome.runtime.getManifest().version);
  }
});

/**
 * Message Handler for communication with popup and content scripts
 * Handles different types of messages from other parts of the extension
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log('Received message:', message, 'from:', sender);
    
    if (message.type === 'ACTION_CLICK') {
      // Handle the action button click
      updateClickCounter()
        .then(count => {
          sendResponse({ success: true, clickCount: count });
        })
        .catch(error => {
          console.error('Error handling action click:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Indicates async response
    } 
    
    if (message.type === 'GET_DATA') {
      // Return stored data
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ success: true, data: result[STORAGE_KEY] });
        }
      });
      return true; // Indicates async response
    }
    
    // Default response for unknown message types
    sendResponse({ success: false, error: 'Unknown message type' });
  } catch (error) {
    console.error('Error processing message:', error);
    sendResponse({ success: false, error: error.message });
  }
  return true;
});

/**
 * Helper function to update click counter in storage
 * @returns {Promise<number>} The updated click count
 */
async function updateClickCounter() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        const data = result[STORAGE_KEY] || { clickCount: 0 };
        const newCount = (data.clickCount || 0) + 1;
        
        chrome.storage.local.set({
          [STORAGE_KEY]: {
            ...data,
            clickCount: newCount,
            lastClick: new Date().toISOString()
          }
        }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(newCount);
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Error handling for uncaught errors in the background script
 */
self.addEventListener('error', (event) => {
  console.error('Background script error:', event.message, 'at', event.filename, ':', event.lineno);
});

/**
 * Log when the service worker starts up
 */
console.log('Background service worker initialized', new Date().toISOString());
/**
 * Popup script for My Chrome Extension
 * Handles user interactions within the popup window
 */

// Constants
const STORAGE_KEY = 'myExtensionData';

// DOM Elements
let actionButton;
let statusMessage;

/**
 * Initialize the popup when DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  setupEventListeners();
  loadData();
});

/**
 * Initialize DOM element references
 */
function initializeElements() {
  actionButton = document.getElementById('actionButton');
  statusMessage = document.getElementById('statusMessage');
  
  // Check if elements exist
  if (!actionButton) console.error('Action button element not found');
  if (!statusMessage) console.error('Status message element not found');
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
  // Action button click event
  if (actionButton) {
    actionButton.addEventListener('click', handleActionButtonClick);
  }
  
  // Add additional event listeners for other UI elements here
}

/**
 * Handle action button click
 * @param {Event} event - The click event
 */
function handleActionButtonClick(event) {
  // Disable the button while processing
  actionButton.disabled = true;
  updateStatus('Processing...', 'processing');
  
  // Send message to background script
  sendMessageToBackground({
    type: 'ACTION_CLICK'
  })
    .then(response => {
      if (response && response.success) {
        updateStatus(`Action successful! Click count: ${response.clickCount}`, 'success');
      } else {
        throw new Error(response.error || 'Unknown error occurred');
      }
    })
    .catch(error => {
      updateStatus(`Error: ${error.message}`, 'error');
      console.error('Action button error:', error);
    })
    .finally(() => {
      // Re-enable the button
      actionButton.disabled = false;
    });
}

/**
 * Load extension data from storage
 */
function loadData() {
  updateStatus('Loading data...', 'loading');
  
  sendMessageToBackground({
    type: 'GET_DATA'
  })
    .then(response => {
      if (response && response.success && response.data) {
        displayData(response.data);
        updateStatus('', ''); // Clear loading status
      } else {
        throw new Error(response.error || 'Failed to load data');
      }
    })
    .catch(error => {
      updateStatus(`Could not load data: ${error.message}`, 'error');
      console.error('Data loading error:', error);
    });
}

/**
 * Display extension data in the popup
 * @param {Object} data - The extension data to display
 */
function displayData(data) {
  if (!data) return;
  
  if (data.clickCount !== undefined) {
    const clickInfo = `Clicked ${data.clickCount} ${data.clickCount === 1 ? 'time' : 'times'}`;
    updateStatus(clickInfo, 'info');
  }
}

/**
 * Update status message in the popup
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info, etc.)
 */
function updateStatus(message, type = 'info') {
  if (!statusMessage) return;
  
  statusMessage.textContent = message;
  
  // Remove all status classes
  statusMessage.classList.remove('success', 'error', 'info', 'loading', 'processing');
  
  // Add the appropriate class if specified
  if (type) {
    statusMessage.classList.add(type);
  }
}

/**
 * Send a message to the background script
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} - Promise resolving to the response
 */
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, response => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Format a date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString || 'Unknown date';
  }
}

/**
 * Error handling for uncaught errors in the popup script
 */
window.addEventListener('error', (event) => {
  console.error('Popup script error:', event.message);
  updateStatus(`An error occurred: ${event.message}`, 'error');
});
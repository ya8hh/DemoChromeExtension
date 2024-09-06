chrome.runtime.onInstalled.addListener(() => {
    console.log('To-Do List Extension Installed');
    
    // Set up an initial alarm or notification
    chrome.alarms.create('reminder', { periodInMinutes: 60 }); // Reminder every hour
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'reminder') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Reminder',
        message: 'Time to check your tasks and take a break!'
      });
    }
  });
  
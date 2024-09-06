document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
  
    let activeTimer = null;
    let activeTaskIndex = null;
  
    function loadTasks() {
      chrome.storage.local.get('tasks', (data) => {
        const tasks = data.tasks || [];
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
          const li = document.createElement('li');
          li.textContent = task.text;
          li.dataset.index = index;
  
          const timeSpan = document.createElement('span');
          timeSpan.textContent = `Time Spent: ${task.timeSpent || 0} min`;
          li.appendChild(timeSpan);
  
          const startButton = document.createElement('button');
          startButton.textContent = 'Start';
          startButton.addEventListener('click', () => startTimer(index));
          li.appendChild(startButton);
  
          const stopButton = document.createElement('button');
          stopButton.textContent = 'Stop';
          stopButton.addEventListener('click', () => stopTimer(index));
          li.appendChild(stopButton);
  
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.addEventListener('click', () => removeTask(index));
          li.appendChild(removeButton);
  
          taskList.appendChild(li);
        });
      });
    }
  
    function saveTask(task) {
      chrome.storage.local.get('tasks', (data) => {
        const tasks = data.tasks || [];
        tasks.push(task);
        chrome.storage.local.set({ tasks }, () => {
          loadTasks();
        });
      });
    }
  
    function updateTask(index, updates) {
      chrome.storage.local.get('tasks', (data) => {
        const tasks = data.tasks || [];
        Object.assign(tasks[index], updates);
        chrome.storage.local.set({ tasks }, () => {
          loadTasks();
        });
      });
    }
  
    function removeTask(index) {
      chrome.storage.local.get('tasks', (data) => {
        const tasks = data.tasks || [];
        tasks.splice(index, 1);
        chrome.storage.local.set({ tasks }, () => {
          loadTasks();
        });
      });
    }
  
    function startTimer(index) {
      if (activeTimer !== null) return;
  
      activeTaskIndex = index;
      activeTimer = setInterval(() => {
        updateTask(index, {
          timeSpent: (tasks[index].timeSpent || 0) + 1
        });
      }, 60000); // Increment every minute
  
      showNotification('Timer started', `Tracking time for task ${tasks[index].text}`);
    }
  
    function stopTimer(index) {
      if (activeTimer !== null) {
        clearInterval(activeTimer);
        activeTimer = null;
        activeTaskIndex = null;
      }
  
      showNotification('Timer stopped', `Stopped tracking time for task ${tasks[index].text}`);
    }
  
    function showNotification(title, message) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: title,
        message: message
      });
    }
  
    addTaskButton.addEventListener('click', () => {
      const taskText = taskInput.value;
      if (taskText) {
        const task = { text: taskText, timeSpent: 0 };
        saveTask(task);
        taskInput.value = '';
      }
    });
  
    loadTasks();
  });
  
const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const studyForm = document.querySelector("#study-form");
const studyList = document.querySelector("#study-list");
const notificationStatus = document.querySelector("#notification-status");
const notificationButton = document.querySelector("#enable-notifications");

let tasks = loadData("studyBuddyTasks");
let studySessions = loadData("studyBuddySessions");

function loadData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveData() {
  localStorage.setItem("studyBuddyTasks", JSON.stringify(tasks));
  localStorage.setItem("studyBuddySessions", JSON.stringify(studySessions));
}

function updateNotificationStatus() {
  if (!("Notification" in window)) {
    notificationStatus.textContent = "This browser does not support desktop notifications. Reminders appear while this page is open.";
    notificationButton.disabled = true;
    notificationButton.hidden = true;
    return;
  }

  notificationButton.disabled = false;
  if (Notification.permission === "granted") {
    notificationStatus.textContent = "Notifications are enabled. Click the button to send a test notification.";
    notificationButton.textContent = "Send test notification";
    notificationButton.hidden = false;
  } else if (Notification.permission === "denied") {
    notificationStatus.textContent = "Browser notifications are blocked. Allow them in your browser settings to receive reminders.";
    notificationButton.hidden = true;
  } else {
    notificationStatus.textContent = "Enable browser notifications to get a reminder at 9:00 AM one day before each task is due.";
    notificationButton.textContent = "Enable reminders";
    notificationButton.hidden = false;
  }
}

function checkTaskReminders() {
  const now = new Date();
  let changed = false;

  tasks.forEach(function (task) {
    if (task.completed || task.reminderSent || !task.dueDate) {
      return;
    }

    const dueDate = new Date(`${task.dueDate}T00:00:00`);
    const reminderAt = new Date(dueDate);
    reminderAt.setDate(reminderAt.getDate() - 1);
    reminderAt.setHours(9, 0, 0, 0);

    if (now >= reminderAt && now < dueDate) {
      if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
      }

      new Notification(`Task due tomorrow: ${task.title}`, {
        body: `${task.subject} — due ${task.dueDate}`,
        tag: `task-reminder-${task.id}`
      });
      task.reminderSent = true;
      changed = true;
    }
  });

  if (changed) saveData();
}

notificationButton.addEventListener("click", async function () {
  if (!("Notification" in window)) {
    updateNotificationStatus();
    return;
  }

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  updateNotificationStatus();
  if (permission === "granted") {
    new Notification("Study Duo test notification", {
      body: "Browser notifications are working.",
      tag: `notification-test-${Date.now()}`
    });
    checkTaskReminders();
  }
});

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach(function (task) {
    const item = document.createElement("li");

    const info = document.createElement("span");
    info.textContent = `${task.title} — ${task.subject} — Due: ${task.dueDate}`;

    if (task.completed) {
      info.style.textDecoration = "line-through";
      info.style.color = "#718096";
    }

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = task.completed ? "Completed" : "Mark Done";
    completeButton.dataset.action = "complete";
    completeButton.dataset.id = task.id;
    completeButton.disabled = task.completed;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = task.id;

    item.append(info, completeButton, deleteButton);
    taskList.appendChild(item);
  });
}

function renderStudySessions() {
  studyList.replaceChildren();

  studySessions.forEach(function (session) {
    const item = document.createElement("li");

    const info = document.createElement("span");
    info.textContent =
      `${session.subject} — ${session.topic} — ${session.date} at ${session.time}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = session.id;

    item.append(info, deleteButton);
    studyList.appendChild(item);
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.querySelector("#task-title").value.trim();
  const subject = document.querySelector("#task-subject").value.trim();
  const dueDate = document.querySelector("#task-due-date").value;

  if (!title || !subject || !dueDate) {
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    title: title,
    subject: subject,
    dueDate: dueDate,
    completed: false,
    reminderSent: false
  });

  saveData();
  renderTasks();
  taskForm.reset();
  checkTaskReminders();
});

studyForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const subject = document.querySelector("#study-subject").value.trim();
  const topic = document.querySelector("#study-topic").value.trim();
  const date = document.querySelector("#study-date").value;
  const time = document.querySelector("#study-time").value;

  if (!subject || !topic || !date || !time) {
    return;
  }

  studySessions.push({
    id: crypto.randomUUID(),
    subject: subject,
    topic: topic,
    date: date,
    time: time
  });

  saveData();
  renderStudySessions();
  studyForm.reset();
});

taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const task = tasks.find(function (item) {
    return item.id === button.dataset.id;
  });

  if (button.dataset.action === "complete" && task) {
    task.completed = true;
  }

  if (button.dataset.action === "delete") {
    tasks = tasks.filter(function (item) {
      return item.id !== button.dataset.id;
    });
  }

  saveData();
  renderTasks();
});

studyList.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  studySessions = studySessions.filter(function (session) {
    return session.id !== button.dataset.id;
  });

  saveData();
  renderStudySessions();
});

renderTasks();
renderStudySessions();
updateNotificationStatus();
checkTaskReminders();
window.setInterval(checkTaskReminders, 60 * 1000);

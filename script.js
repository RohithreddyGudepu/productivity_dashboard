// === WEATHER SECTION ===
const weatherInfo = document.getElementById("weather-info");
const weatherApiKey = WEATHER_API_KEY; // From config.js

function getWeather() {
  if (!weatherInfo || !weatherApiKey) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`
      )
        .then(response => response.json())
        .then(data => {
          weatherInfo.innerHTML = `
            <h2>Weather</h2>
            <p><strong>${data.name}</strong></p>
            <p>${data.weather[0].main} - ${data.main.temp}°C</p>
          `;
        })
        .catch(() => {
          weatherInfo.innerHTML = "Failed to load weather.";
        });
    }, () => {
      weatherInfo.innerHTML = "Location access denied.";
    });
  } else {
    weatherInfo.innerHTML = "Geolocation not supported.";
  }
}
getWeather();

// === QUOTE ===
function fetchQuote() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");

  fetch("https://api.quotable.io/random")
    .then(res => res.json())
    .then(data => {
      quoteText.textContent = `"${data.content}"`;
      quoteAuthor.textContent = `— ${data.author}`;
    })
    .catch(() => {
      quoteText.textContent = `"Stay positive, work hard, make it happen."`;
      quoteAuthor.textContent = "— Unknown";
    });
}
fetchQuote();

// === TO-DO WITH DATE SUPPORT ===
let taskInput = document.getElementById("task-input");
let taskDateInput = document.getElementById("task-date");
let selectedDate = document.getElementById("selected-date");
let taskList = document.getElementById("task-list");
let dateSelect = document.getElementById("task-date-select");

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function loadTasksForDate(date = null) {
  const viewDate = date || dateSelect.value || formatDate(new Date());
  const tasks = JSON.parse(localStorage.getItem(\"tasksByDate\")) || {};
  const todaysTasks = tasks[viewDate] || [];

  selectedDate.textContent = viewDate;
  taskList.innerHTML = '';
  todaysTasks.forEach((task, index) => {
    let li = document.createElement(\"li\");
    li.innerHTML = `${task} <span onclick=\"removeTask('${viewDate}', ${index})\">🗑️</span>`;
    taskList.appendChild(li);
  });
}

function addTask() {
  const task = taskInput.value.trim();
  const date = taskDateInput.value || formatDate(new Date());
  if (task === '') return;

  const tasks = JSON.parse(localStorage.getItem(\"tasksByDate\")) || {};
  tasks[date] = tasks[date] || [];
  tasks[date].push(task);
  localStorage.setItem(\"tasksByDate\", JSON.stringify(tasks));

  taskInput.value = '';
  loadTasksForDate(date);
}

function removeTask(date, index) {
  const tasks = JSON.parse(localStorage.getItem(\"tasksByDate\")) || {};
  tasks[date].splice(index, 1);
  localStorage.setItem(\"tasksByDate\", JSON.stringify(tasks));
  loadTasksForDate(date);
}

loadTasksForDate();

// === DAILY REMINDERS ===
function showReminder(message, id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.textContent = message;
  modal.style.display = 'block';
  setTimeout(() => (modal.style.display = 'none'), 5000);
}

function checkReminders() {
  const today = formatDate(new Date());
  const tasks = JSON.parse(localStorage.getItem(\"tasksByDate\")) || {};
  const todayTasks = tasks[today] || [];

  const hour = new Date().getHours();
  if (hour === 8) {
    showReminder(`Today's Schedule: ${todayTasks.join(', ') || 'No tasks'}`, \"morning-reminder\");
  } else if (hour === 21 && todayTasks.length) {
    showReminder(`You have incomplete tasks today!`, \"evening-alert\");
  }
}
checkReminders();

// === CALENDAR ===
function renderCalendar() {
  const calendar = document.getElementById(\"calendar-container\");
  const date = new Date();
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  let html = `<h2>${currentMonth} ${currentYear}</h2><table><tr>`;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach(day => (html += `<th>${day}</th>`));
  html += '</tr><tr>';

  const firstDay = new Date(currentYear, date.getMonth(), 1).getDay();
  const totalDays = new Date(currentYear, date.getMonth() + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) html += '<td></td>';

  for (let d = 1; d <= totalDays; d++) {
    const isToday = d === new Date().getDate();
    if ((firstDay + d - 1) % 7 === 0) html += '</tr><tr>';
    html += `<td class=\"${isToday ? 'today' : ''}\">${d}</td>`;
  }

  html += '</tr></table>';
  calendar.innerHTML = html;
}
renderCalendar();

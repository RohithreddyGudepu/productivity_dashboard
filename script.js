// === WEATHER API ===
const weatherInfo = document.getElementById("weather-info");
const weatherAPIKey = 'YOUR_API_KEY_HERE'; // Replace this with your real key locally

function getWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          weatherInfo.innerHTML = `
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

// === TO-DO LIST ===
let taskInput = document.getElementById("task-input");
let taskList = document.getElementById("task-list");

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.innerHTML = `${task} <span onclick="removeTask(${index})">🗑️</span>`;
    taskList.appendChild(li);
  });
}

function addTask() {
  let task = taskInput.value.trim();
  if (task === "") return;
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  loadTasks();
}

function removeTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

loadTasks();

// === DAILY QUOTE (Quotable API) ===
function fetchQuote() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");

  fetch("https://api.quotable.io/random")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      return response.json();
    })
    .then(data => {
      quoteText.textContent = `"${data.content}"`;
      quoteAuthor.textContent = `— ${data.author}`;
    })
    .catch((error) => {
      // Fallback quote if API fails
      quoteText.textContent = `"Stay positive, work hard, make it happen."`;
      quoteAuthor.textContent = "— Unknown";
      console.warn("Quote API failed. Showing fallback quote.");
    });
}

fetchQuote();


// === CALENDAR WITH HIGHLIGHT ===
function renderCalendar() {
  const calendar = document.getElementById("calendar-container");
  const date = new Date();
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  let calendarHTML = `<h3>${currentMonth} ${currentYear}</h3><table><tr>`;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach(day => calendarHTML += `<th>${day}</th>`);
  calendarHTML += '</tr><tr>';

  const firstDay = new Date(currentYear, date.getMonth(), 1).getDay();
  const totalDays = new Date(currentYear, date.getMonth() + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<td></td>';
  }

  for (let day = 1; day <= totalDays; day++) {
    const isToday =
      day === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();

    if ((firstDay + day - 1) % 7 === 0) calendarHTML += '</tr><tr>';
    calendarHTML += `<td class="${isToday ? 'today' : ''}">${day}</td>`;
  }

  calendarHTML += '</tr></table>';
  calendar.innerHTML = calendarHTML;
}
renderCalendar();

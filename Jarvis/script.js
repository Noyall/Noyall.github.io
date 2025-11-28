const busyDatesBase = [
  "2025-12-04",
  "2025-12-03",
  "2025-12-02",
  "2025-12-07",
  "2025-11-29"
];

const timeSlots = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

const monthLabel = document.getElementById("month-label");
const rowsContainer = document.getElementById("calendar-rows");
const timePanel = document.getElementById("time-panel");
const selectedDateText = document.getElementById("selected-date-text");
const selectedTimeText = document.getElementById("selected-time-text");
const timeSlotsContainer = document.getElementById("time-slots");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
const form = document.getElementById("request-form");

const dayField = document.getElementById("day-field");
const timeField = document.getElementById("time-field");

let current = new Date();
let selectedDate = null;
let selectedTime = null;
let panelOpen = false;

const today = new Date();
today.setHours(0, 0, 0, 0);

const dynamicBusyDates = new Set();

function allBusyDates() {
  return new Set([...busyDatesBase, ...dynamicBusyDates]);
}

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMonthLabel(date) {
  const options = { year: "numeric", month: "long" };
  return date.toLocaleDateString(undefined, options);
}

function formatFullDate(date) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  return date.toLocaleDateString(undefined, options);
}

function formatTimeLabel(time) {
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function buildCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const busySet = allBusyDates();

  monthLabel.textContent = formatMonthLabel(date);

  rowsContainer.querySelectorAll(".week").forEach((week) => week.remove());

  const anchorPanel = timePanel;

  const firstDayOfMonth = new Date(year, month, 1);
  const startingWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = 42;

  let weekDiv = document.createElement("div");
  weekDiv.classList.add("week");
  rowsContainer.insertBefore(weekDiv, anchorPanel);

  for (let cell = 0; cell < totalCells; cell++) {
    if (cell > 0 && cell % 7 === 0) {
      weekDiv = document.createElement("div");
      weekDiv.classList.add("week");
      rowsContainer.insertBefore(weekDiv, anchorPanel);
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("day");

    const dayIndex = cell - startingWeekday + 1;
    const inCurrentMonth = cell >= startingWeekday && dayIndex <= daysInMonth;

    if (!inCurrentMonth) {
      btn.classList.add("blank");
      weekDiv.appendChild(btn);
      continue;
    }

    const thisDate = new Date(year, month, dayIndex);
    thisDate.setHours(0, 0, 0, 0);
    const ymd = toYMD(thisDate);
    btn.dataset.date = ymd;
    btn.textContent = thisDate.getDate();

    const isPast = thisDate < today;

    const dot = document.createElement("span");
    dot.classList.add("dot");
    btn.appendChild(dot);

    if (busySet.has(ymd)) {
      btn.classList.add("busy");
    }

    if (isPast) {
      btn.classList.add("disabled");
    } else {
      if (ymd === toYMD(today)) {
        btn.classList.add("today");
      }
      btn.addEventListener("click", () => onDayClick(btn));
    }

    weekDiv.appendChild(btn);
  }

  if (selectedDate) {
    const selectedBtn = rowsContainer.querySelector(
      `.day[data-date="${selectedDate}"]`
    );
    if (selectedBtn) selectedBtn.classList.add("selected");
  }
}

function onDayClick(btn) {
  const ymd = btn.dataset.date;
  const weekDiv = btn.closest(".week");

  if (panelOpen && selectedDate === ymd) {
    panelOpen = false;
    timePanel.classList.remove("open");
    selectedDate = null;
    selectedTime = null;
    selectedDateText.textContent = "Pick a day";
    selectedTimeText.textContent = "";
    rowsContainer
      .querySelectorAll(".day.selected")
      .forEach((d) => d.classList.remove("selected"));
    timeSlotsContainer
      .querySelectorAll(".time-slot.selected")
      .forEach((t) => t.classList.remove("selected"));
    return;
  }

  selectedDate = ymd;

  rowsContainer
    .querySelectorAll(".day.selected")
    .forEach((d) => d.classList.remove("selected"));
  btn.classList.add("selected");

  selectedTime = null;
  selectedTimeText.textContent = "";
  timeSlotsContainer
    .querySelectorAll(".time-slot.selected")
    .forEach((t) => t.classList.remove("selected"));

  const d = new Date(ymd);
  selectedDateText.textContent = "Day: " + formatFullDate(d);

  rowsContainer.insertBefore(timePanel, weekDiv.nextSibling);
  panelOpen = true;
  timePanel.classList.add("open");
}

function renderTimeSlots() {
  timeSlotsContainer.innerHTML = "";
  timeSlots.forEach((slot) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("time-slot");
    btn.dataset.time = slot;
    btn.textContent = formatTimeLabel(slot);

    btn.addEventListener("click", () => {
      selectedTime = slot;
      selectedTimeText.textContent = "Time: " + formatTimeLabel(slot);

      timeSlotsContainer
        .querySelectorAll(".time-slot.selected")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      if (selectedDate) {
        dynamicBusyDates.add(selectedDate);
        const dayBtn = rowsContainer.querySelector(
          `.day[data-date="${selectedDate}"]`
        );
        if (dayBtn) dayBtn.classList.add("busy");
      }
    });

    timeSlotsContainer.appendChild(btn);
  });
}

prevBtn.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  buildCalendar(current);
});

nextBtn.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  buildCalendar(current);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!selectedDate) {
    alert("Tap a day first.");
    return;
  }

  if (!selectedTime) {
    alert("Tap a time slot.");
    return;
  }

  const purpose = document.getElementById("purpose").value.trim();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!purpose || !name || !phone) {
    alert("Fill purpose, name, and phone number.");
    return;
  }

  const dateObj = new Date(selectedDate);
  const fullDateLabel = formatFullDate(dateObj);
  const timeLabel = formatTimeLabel(selectedTime);

  dayField.value = `${fullDateLabel} (${selectedDate})`;
  timeField.value = `${timeLabel} (${selectedTime})`;

  form.submit();
});

renderTimeSlots();
buildCalendar(current);

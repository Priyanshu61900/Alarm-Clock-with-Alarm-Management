let alarmInterval;
const alarmSound = document.getElementById("alarmSound");
alarmSound.loop = true;
const dismissButton = document.getElementById("dismissButton");

// Function to update the clock every second and check alarms
function updateClock() {
  const now = new Date();
  // to localtimestring returns the time in hr/min/sec and session format

  const timeDisplay = document.getElementById("timeDisplay");
  timeDisplay.innerText = now.toLocaleTimeString();
  // set the date
  const dateDisplay = document.getElementById("dateDisplay");
  dateDisplay.innerText = now.toDateString();

  // Check alarms every second
  checkAlarms(now);
}

// Update the clock every second
setInterval(updateClock, 1000);

// Function to set the alarm
function setAlarm() {
  // set the inputs for the alarms
  // parseInt convert a string into an integer
  let hourInput = parseInt(document.getElementById("hourInput").value);
  let minuteInput = parseInt(document.getElementById("minuteInput").value);
  let secondInput = parseInt(document.getElementById("secondInput").value);
  let ampmInput = document.getElementById("ampmInput").value;

  // check if the inputs are empty
  if (isNaN(hourInput) || isNaN(minuteInput) || isNaN(secondInput)) {
    alert("Please enter valid numbers for hours, minutes, and seconds.");
    return;
  }
  if (
    hourInput < 0 ||
    hourInput > 12 ||
    minuteInput < 0 ||
    minuteInput > 59 ||
    secondInput < 0 ||
    secondInput > 59
  ) {
    alert("Please enter valid numbers for hours, minutes, and seconds.");
    return;
  }

  const now = new Date();
  let alarmTime = new Date(now); // Declare alarmTime as a let variable

  // Set the alarm time based on the user input
  if (ampmInput === "PM" && hourInput !== 12) {
    // if for an example alarm is for 4pm then 4+12 = 16 set the alarm at 16
    hourInput += 12;
  } else if (ampmInput === "AM" && hourInput === 12) {
    hourInput = 0;
  }
  // setHours and other methods set the desired time in date() format
  // * Sets the hours value in the Date object using Universal Coordinated Time (UTC).
  alarmTime.setHours(hourInput);
  alarmTime.setMinutes(minuteInput);
  alarmTime.setSeconds(secondInput);

  // Calculate the time difference between the alarm time and current time
  const timeDifference = alarmTime.getTime() - now.getTime();

  // throw an error if user is trying to set the alarm before the time
  if (timeDifference <= 0) {
    alert("Please set the alarm time in the future.");
    return;
  }

  // Clear any existing alarm interval
  if (alarmInterval) {
    clearInterval(alarmInterval);
  }

  // Set the alarm to trigger when the time difference reaches zero
  alarmInterval = setTimeout(() => {
    triggerAlarm(alarmTime);
  }, timeDifference);

  // Create a new alarm item and insert it at the beginning of the alarms list
  const alarmsList = document.getElementById("alarmsList");
  // create new div and set the contents of the elements
  const newAlarm = document.createElement("div");
  newAlarm.className = "alarm-item";
  newAlarm.innerText = alarmTime.toLocaleTimeString();
  const deleteButton = document.createElement("button");
  // deleteButton.innerText = "Delete";
  deleteButton.innerText = "delete";
  deleteButton.classList.add("material-icons-outlined");

  deleteButton.onclick = function () {
    deleteAlarm(newAlarm);
  };
  newAlarm.appendChild(deleteButton);

  // Insert the newAlarm at the beginning of the alarms list using prepend
  alarmsList.prepend(newAlarm);

  // Clear the input fields after setting the alarm
  document.getElementById("hourInput").value = "";
  document.getElementById("minuteInput").value = "";
  document.getElementById("secondInput").value = "";
}

// Function to trigger the alarm
function triggerAlarm(alarmTime) {
  alarmSound.play();
  dismissButton.style.display = "block";

  // Mark the alarm as "done" permanently
  const alarmItems = document.getElementsByClassName("alarm-item");
  for (const alarmItem of alarmItems) {
    alarmItem.classList.add("done");
  }
  // Alert is Not necessary !!!
  // Show an alert when the alarm triggers
  alert("Alarm triggered at " + alarmTime.toLocaleTimeString());
}

// Function to delete the alarm
function deleteAlarm(alarmItem) {
  const alarmsList = document.getElementById("alarmsList");
  alarmsList.removeChild(alarmItem);
  clearInterval(alarmInterval);
}

// Function to dismiss the alarm sound
function dismissAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  dismissButton.style.display = "none";
}

// Function to check alarms and trigger the alarm if needed
function checkAlarms(currentTime) {
  const alarmItems = document.getElementsByClassName("alarm-item");

  for (const alarmItem of alarmItems) {
    if (!alarmItem.classList.contains("done")) {
      const alarmTime = new Date(alarmItem.innerText);
      if (alarmTime <= currentTime) {
        triggerAlarm(alarmTime);
      }
    }
  }
}

// function generateMinuteOptions() {
//   const minuteInput = document.getElementById("minuteInput");

//   for (let i = 0; i <= 59; i++) {
//     const option = document.createElement("option");
//     option.value = i < 10 ? `0${i}` : `${i}`;
//     option.textContent = i < 10 ? `0${i}` : `${i}`;
//     minuteInput.appendChild(option);
//   }
// }

// // Generate options for minutes (0 to 59)
// generateMinuteOptions();

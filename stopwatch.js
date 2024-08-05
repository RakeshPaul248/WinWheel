let stopwatchInterval;
let milliseconds = 0,
  seconds = 0,
  minutes = 0;
let isRunning = false;
let pickedNames = [];

// Function to start or stop the stopwatch
function toggleStopwatch() {
  if (isRunning) {
    stopStopwatch();
    document.getElementById("toggleButton").textContent = "Start";
    document.getElementById("toggleButton").style.backgroundColor = "#408d37";
  } else {
    startStopwatch();
    document.getElementById("toggleButton").textContent = "Stop";
    document.getElementById("toggleButton").style.backgroundColor = "#bf1d1c";
  }
  isRunning = !isRunning;
}

// Function to start the stopwatch
function startStopwatch() {
  stopwatchInterval = setInterval(updateStopwatch, 10);
}

// Function to stop the stopwatch
function stopStopwatch() {
  clearInterval(stopwatchInterval);
}

// Function to reset the stopwatch
function resetStopwatch() {
  clearInterval(stopwatchInterval);
  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  document.getElementById("stopwatch").textContent = "00:00:00";
  isRunning = false;
  document.getElementById("toggleButton").textContent = "Start";
}

// Function to update the stopwatch
function updateStopwatch() {
  milliseconds += 10;
  if (milliseconds == 1000) {
    milliseconds = 0;
    seconds++;
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
  }
  document.getElementById("stopwatch").textContent =
    formatTime(minutes) +
    ":" +
    formatTime(seconds) +
    ":" +
    formatTime(milliseconds / 10);
  if (seconds >= 5) {
    // document.getElementById("stopWatch").style.backgroundColor = "red";
    // console.log(seconds);
  }
}

// Function to format time with leading zeros
function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

function store() {
  const pickedName = document.getElementById("outputDiv").textContent;
  const currentStopwatchTime = document.getElementById("stopwatch").textContent;
  storePickedName(pickedName, currentStopwatchTime);
}
function storePickedName(name, time) {
  pickedNames.push({ name: name, time: time });
  displayPickedNames();
}

function displayPickedNames() {
  let table = document.getElementById("dataTable");
  table.innerHTML = "";
  let indexno = 1;

  pickedNames.forEach((item) => {
    let rowElement = document.createElement("div");
    rowElement.style.display = "flex";
    rowElement.style.padding = "20px 10px";
    rowElement.style.borderRadius = "5px";
    rowElement.style.fontSize = "20px";
    rowElement.style.gap = "10px";
    rowElement.style.marginBottom = "5px";
    rowElement.style.alignItems = "center";

    let nameElement = document.createElement("div");
    let indexspan = document.createElement("span");
    let NameSpan = document.createElement("span");
    indexspan.classList.add("indexspan");
    indexspan.textContent = indexno;
    NameSpan.textContent = item.name;
    nameElement.style.fontSize = "20px";
    nameElement.style.color = "#2a123f";

    let timeElement = document.createElement("div");
    timeElement.textContent = item.time;
    timeElement.style.color = "#817d7dc4";

    nameElement.appendChild(indexspan);
    nameElement.appendChild(NameSpan);
    rowElement.appendChild(nameElement);
    rowElement.appendChild(timeElement);

    if (item.time === "00:00:00") {
      rowElement.style.backgroundColor = "red";
      timeElement.style.color = "white";
      nameElement.style.color = "white";
    } else {
      rowElement.style.backgroundColor = "#dfdddd";
    }

    table.appendChild(rowElement);
    indexno++;
  });
}

function reset() {
  let namesTextArea = document.getElementById("nameList");
  namesTextArea.value = "";
  document.getElementById("outputDiv").textContent = "";
  pickedNames = [];
  displayPickedNames();
}

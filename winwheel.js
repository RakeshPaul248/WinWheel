function getLabelsFromTextarea() {
  var textareaData = document.getElementById("dataTextarea").value;
  var labels = textareaData.split("\n").filter(function (label) {
    return label.trim() !== ""; // Remove empty lines
  });
  return labels;
}

// Function to display selected label in output div
function displaySelectedLabel(selectedLabel) {
  var outputDiv = document.getElementById("outputDiv");
  outputDiv.textContent = selectedLabel;
}

var padding = { top: 20, right: 40, bottom: 0, left: 0 },
  w = 750 - padding.left - padding.right,
  h = 750 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  oldpick = [],
  color = d3.scale.ordinal().range(["#019267", "#00C897", "#FFD365"]);
var data = getLabelsFromTextarea().map(function (label) {
  return { label: label, value: 1 };
});

var svg = d3
  .select("#chart")
  .append("svg")
  .data([data])
  .attr("width", w + padding.left + padding.right)
  .attr("height", h + padding.top + padding.bottom);

var container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
  );

var vis = container.append("g");

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return 1;
  });

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis
  .selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class", "slice");

arcs
  .append("path")
  .attr("fill", function (d, i) {
    return color(i);
  })
  .attr("d", function (d) {
    return arc(d);
  });

// add the text
arcs
  .append("text")
  .attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return (
      "rotate(" +
      ((d.angle * 180) / Math.PI - 90) +
      ")translate(" +
      (d.outerRadius - 10) +
      ")"
    );
  })
  .attr("text-anchor", "end")
  .text(function (d, i) {
    return data[i].label;
  });

container.on("click", spin);
let spinfirsttime = true;
let indexfastno = 1;
let previousIndexfastno = null;
function spin(d) {
  var data = getLabelsFromTextarea().map(function (label) {
    return { label: label, value: 1 };
  });
  if (spinfirsttime) {
    console.log("first Time");
    spinfirsttime = false;
    document.getElementById("dataTextarea").disabled = true;
    if (document.getElementById("dataTextarea").disabled) {
      document.getElementById("dataTextarea").classList.add("UnselectText");
      event.preventDefault();
    }
  } else {
    console.log(indexfastno);
    if (indexfastno === previousIndexfastno) {
      console.log(indexfastno, previousIndexfastno);
      store();
      previousIndexfastno = null;
    }
  }
  container.on("click", null);
  //all slices have been seen, all done
  //console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
  if (oldpick.length == data.length) {
    console.log("done");
    let Completemodal = document.createElement("div");
    let Contentmodal = document.createElement("div");
    // document.body.appendChild(Completemodal);
    Completemodal.appendChild(Contentmodal);
    Completemodal.classList.add("completemodal");
    Contentmodal.classList.add("contentModal");
    Contentmodal.innerHTML = "Complete Your Win Wheel";

    // Disable scrolling
    // document.body.style.overflow = "hidden";

    let dataTableClone = document.getElementById("dataTable").cloneNode(true);
    Contentmodal.appendChild(dataTableClone);

    container.on("click", null);
    return;
  }

  var ps = 360 / data.length,
    pieslice = Math.round(1440 / data.length),
    rng = Math.floor(Math.random() * 1440 + 360);

  rotation = Math.round(rng / ps) * ps;

  picked = Math.round(data.length - (rotation % 360) / ps);
  picked = picked >= data.length ? picked % data.length : picked;

  if (oldpick.indexOf(picked) !== -1) {
    d3.select(this).call(spin);
    return;
  } else {
    oldpick.push(picked);
  }

  rotation += 90 - Math.round(ps / 2);

  vis
    .transition()
    .duration(3000)
    .attrTween("transform", rotTween)
    .each("end", function () {
      d3.select(".slice:nth-child(" + (picked + 1) + ") path").attr(
        "fill",
        "#111"
      );
      d3.select(".slice:nth-child(" + (picked + 1) + ") text").attr(
        "fill",
        "#FFF"
      );
      var selectedLabel = data[picked].label;
      displaySelectedLabel(selectedLabel);
      oldrotation = rotation;
      container.on("click", spin);
    });

  // console.log("run Spin");
  indexfastno++;
  resetStopwatch();
  previousIndexfastno = indexfastno;
  // spinfirsttime++;
}

//make arrow
svg
  .append("g")
  .attr(
    "transform",
    "translate(" +
      (w + padding.left + padding.right) +
      "," +
      (h / 2 + padding.top) +
      ")"
  )
  .append("path")
  .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
  .style({ fill: "black" });

//draw spin circle
container
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 125)
  .style({ fill: "white", cursor: "pointer" });

//spin text
container
  .append("text")
  .attr("x", 0)
  .attr("y", 15)
  .attr("text-anchor", "middle")
  .text("SPIN")
  .style({ "font-weight": "bold", "font-size": "30px" });

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}

function getRandomNumbers() {
  var array = new Uint16Array(1000);
  var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

  if (
    window.hasOwnProperty("crypto") &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    window.crypto.getRandomValues(array);
    console.log("works");
  } else {
    //no support for crypto, get crappy random numbers
    for (var i = 0; i < 1000; i++) {
      array[i] = Math.floor(Math.random() * 100000) + 1;
    }
  }

  return array;
}

// Function to update wheel based on textarea input
function updateWheel() {
  // Get labels from textarea
  var labels = getLabelsFromTextarea();

  // Calculate total number of labels
  var totalLabels = labels.length;

  // Create data with equal value for each label to ensure a full circle
  var data = labels.map(function (label) {
    return { label: label, value: 360 / totalLabels };
  });

  // Update pie chart with new data
  var arcs = vis.selectAll("g.slice").data(pie(data));

  arcs.exit().remove();

  // Update existing slices
  arcs
    .select("path")
    .attr("fill", function (d, i) {
      return color(i);
    })
    .attr("d", function (d) {
      return arc(d);
    });

  arcs
    .select("text")
    .attr("transform", function (d) {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle) / 2;
      return (
        "rotate(" +
        ((d.angle * 180) / Math.PI - 90) +
        ")translate(" +
        (d.outerRadius - 10) +
        ")"
      );
    })
    .attr("text-anchor", "end")
    .text(function (d, i) {
      return data[i].label; // Update text with correct label
    });

  // Enter new slices
  var newArcs = arcs.enter().append("g").attr("class", "slice");

  newArcs
    .append("path")
    .attr("fill", function (d, i) {
      return color(i);
    })
    .attr("d", function (d) {
      return arc(d);
    });

  newArcs
    .append("text")
    .attr("transform", function (d) {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.angle = (d.startAngle + d.endAngle) / 2;
      return (
        "rotate(" +
        ((d.angle * 180) / Math.PI - 90) +
        ")translate(" +
        (d.outerRadius - 10) +
        ")"
      );
    })
    .attr("text-anchor", "end")
    .text(function (d, i) {
      return data[i].label; // Update text with correct label
    });
}
// document.body.style.overflow = "auto";
document.getElementById("dataTextarea").addEventListener("input", updateWheel);

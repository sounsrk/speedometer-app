import React from "react";
import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";

const Gauge = ({ value = 0, min = 0, max = 220 }) => {
  
  var percent;
  var angleScale;
  var angle;
  var filled;
  

  //Background circle
  const background = arc()
    .innerRadius(0.92)
    .outerRadius(1)
    .startAngle(-Math.PI / 1.5)
    .endAngle(Math.PI / 1.5)
    .cornerRadius(0.1)();

  const percentScale = scaleLinear().domain([min, max]).range([0, 1]);

  var count = value;
  var step = 1;
  var progress = min;

  function updateProgress(progress, value) {
    
    var svg = d3.select("svg");
    percent = percentScale(value);
    angleScale = scaleLinear()
      .domain([0, 1])
      .range([-Math.PI / 1.5, Math.PI / 1.5])
      .clamp(true);
    angle = angleScale(percent);

    //Filled circle everytime value updates
    filled = arc()
      .innerRadius(0.92)
      .outerRadius(1)
      .startAngle(-Math.PI / 1.5)
      .endAngle(angle)
      .cornerRadius(0.1)();

    svg.append("path").attr("class","filled-arc").attr("d", filled).attr("fill", "#f29936");
    svg.select(".middle-text").remove();
    svg.append("text").attr("class","middle-text").attr("x","-0.25").attr("y","0").style("font-size", "0.2px").attr("fill","white").text(value+" kmh")

  }

  //Function for updating value
  (function loops() {
    updateProgress(progress, count * 10);
    if (count < max / 10) {
      count++;
      progress += step;
      setTimeout(loops, 100);
    }
  })();

  //Defining ticks for the gauge
  const scaleTicks = scaleLinear()
    .domain([0, 220])
    .range([-Math.PI / 1.5, Math.PI / 1.5]);
  const tick = scaleTicks.ticks(11).map((object) => scaleTicks(object));

  //Defining text for the gauge
  const scaleText = scaleLinear().domain([0, 220]).range([0, 220]);
  const texts = scaleText
    .ticks(11)
    .map((object) => Math.round(scaleText(object)));

  //Defining smaller ticks for the gauge
  const scaleSmallTicks = scaleLinear()
    .domain([0, 220])
    .range([-Math.PI / 1.5, Math.PI / 1.5]);
  const smallTick = scaleSmallTicks
    .ticks(110)
    .map((object) => scaleSmallTicks(object));

  var marker = [];
  var markerSmall = [];

  for (let i = 0; i < tick.length; i++) {
    marker.push({
      ticks: getCoordinates(tick[i], 1 - (1 - 0.92) / 2),
      text: texts[i],
    });
  }

  for (let i = 0; i < smallTick.length; i++) {
    markerSmall.push(getCoordinates(smallTick[i], 1 - (1 - 0.92) / 2));
  }

  return (
    <div>
      <br></br>
      <br></br>
      <svg width="25em" viewBox={[-1, -1, 2, 1.5].join(" ")}>
        <path d={background} fill="#dbdbe7" />

        {markerSmall.map((coords, index) => (
          <line
            key={index}
            x1={coords[0] / 1.1}
            y1={coords[1] / 1.1}
            x2={coords[0] / 1.2}
            y2={coords[1] / 1.2}
            stroke="#f29936"
            strokeWidth="0.006"
          />
        ))}
        {marker.map((coords, index) => (
          <line
            key={index}
            x1={coords.ticks[0] / 1.1}
            y1={coords.ticks[1] / 1.1}
            x2={coords.ticks[0] / 1.2}
            y2={coords.ticks[1] / 1.2}
            stroke="white"
            strokeWidth="0.027"
          />
        ))}
        {marker.map((coords, index) => (
          <text
            key={index}
            x={coords.ticks[0] / 1.452}
            y={coords.ticks[1] / 1.45}
            style={{ fontSize: "0.1px", fill: "white" }}
          >
            {coords.text}{" "}
          </text>
        ))}
      </svg>
    </div>
  );
};

//Function to get coordinates on the circle
const getCoordinates = (angle, offset = 10) => [
  Math.cos(angle - Math.PI / 2) * offset,
  Math.sin(angle - Math.PI / 2) * offset,
];

export default Gauge;

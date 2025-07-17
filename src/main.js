import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import { DataClient, dataClient } from "./utils/data_client.js"; // Use the relative path to your file

import "./style.css";
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

const categories = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

try {
  const data = await dataClient.getData("issues_data.json");
  console.log("Data:  ", data);

  const basePoints = data
    .filter((d) => d.Impact > 0 && d.Ignorance > 0)
    .map((d) => ({
      x: d.Impact - 1,
      y: d.Ignorance - 1,
      name: d["Issue Name"],
    }));

  console.log(basePoints);
  init(basePoints);
} catch (error) {
  console.error("Error fetching data:", error);
}

// const basePoints = data
//   .filter((d) => d.Impact > 0 && d.Ignorance > 0)
//   .map((d) => ({
//     x: d.Impact - 1,
//     y: d.Ignorance - 1,
//   }));

// console.log(basePoints);

const basePoints = [
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 2, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 1, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 0, y: 7 },
  { x: 2, y: 3 },
  { x: 2, y: 3 },
  { x: 2, y: 3 },

  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 5, y: 7 },
  { x: 1, y: 8 },
  { x: 1, y: 8 },
  { x: 1, y: 8 },
  { x: 1, y: 8 },
  { x: 1, y: 8 },
  { x: 1, y: 8 },
  { x: 0, y: 8 },
  { x: 0, y: 8 },
  { x: 0, y: 8 },
  { x: 0, y: 8 },
  { x: 0, y: 8 },
  { x: 0, y: 8 },
  { x: 0, y: 8 },

  { x: 0, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 1, y: 8 },
  { x: 6, y: 2 },
  { x: 6, y: 2 },
  { x: 4, y: 4 },
  { x: 7, y: 1 },
  { x: 7, y: 1 },
  { x: 7, y: 1 },
  { x: 7, y: 1 },
  { x: 7, y: 1 },
  { x: 8, y: 6 },
  { x: 3, y: 5 },
  { x: 3, y: 5 },
  { x: 3, y: 5 },
  { x: 3, y: 5 },
  { x: 3, y: 5 },
  { x: 3, y: 5 },
  { x: 0, y: 0 },
  { x: 8, y: 8 },
  { x: 8, y: 8 },
  { x: 8, y: 8 },
  { x: 8, y: 8 },
  { x: 1, y: 6 },

  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
];

function init(basePoints) {
  // Group items by cell
  const cellGroups = {};
  basePoints.forEach((pt, i) => {
    const key = `${pt.x}-${pt.y}`;
    if (!cellGroups[key]) cellGroups[key] = { x: pt.x, y: pt.y, names: [] };
    // cellGroups[key].names.push(`Item ${i + 1}`);
    cellGroups[key].names.push(pt.name);
  });

  const quadrantGroups = { Q1: {}, Q2: {}, Q3: {}, Q4: {} };

  basePoints.forEach((pt) => {
    const { x, y } = pt;

    let quadrant = null;
    if (x >= 0 && x <= 3 && y >= 0 && y <= 3) {
      quadrant = "Q1";
    } else if (x >= 4 && x <= 8 && y >= 0 && y <= 4) {
      quadrant = "Q2";
    } else if (x >= 0 && x <= 3 && y >= 4 && y <= 8) {
      quadrant = "Q3";
    } else if (x >= 4 && x <= 8 && y >= 4 && y <= 8) {
      quadrant = "Q4";
    }

    if (quadrant) {
      if (!quadrantGroups[quadrant][y]) {
        quadrantGroups[quadrant][y] = [];
      }
      quadrantGroups[quadrant][y].push(pt);
    }
  });

  console.log(quadrantGroups);

  const jitteredPoints = [];
  const cellSize = 1; // size of each grid cell in axis units
  const padding = 0.1; // margin from edge of cell

  Object.values(cellGroups).forEach((group) => {
    const count = group.names.length;

    switch (count) {
      case 1:
        jitteredPoints.push({
          name: group.names[0],
          x: group.x,
          y: group.y,
        });
        break;
      case 2:
        const die2Offsets = [
          { col: 0, row: 2 }, // top-left
          { col: 2, row: 0 }, // bottom-right
        ];

        die2Offsets.forEach((pos, i) => {
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((pos.col + 0.5) * (cellSize - 2 * padding)) / 3,
            y:
              group.y -
              0.5 +
              padding +
              ((pos.row + 0.5) * (cellSize - 2 * padding)) / 3,
          });
        });
        break;

      case 3:
        const die3Offsets = [
          { col: 0, row: 0 }, // bottom-left
          { col: 1, row: 1 }, // center
          { col: 2, row: 2 }, // top-right
        ];

        die3Offsets.forEach((pos, i) => {
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((pos.col + 0.5) * (cellSize - 2 * padding)) / 3,
            y:
              group.y -
              0.5 +
              padding +
              ((pos.row + 0.5) * (cellSize - 2 * padding)) / 3,
          });
        });
        break;
      case 4:
        const die4Offsets = [
          { col: 0, row: 0 }, // top-left
          { col: 2, row: 0 }, // top-right
          { col: 0, row: 2 }, // bottom-left
          { col: 2, row: 2 }, // bottom-right
        ];

        die4Offsets.forEach((pos, i) => {
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((pos.col + 0.5) * (cellSize - 2 * padding)) / 3,
            y:
              group.y -
              0.5 +
              padding +
              ((pos.row + 0.5) * (cellSize - 2 * padding)) / 3,
          });
        });
        break;

      case 5:
        const die5Offsets = [
          { col: 0, row: 0 }, // top-left
          { col: 2, row: 0 }, // top-right
          { col: 1, row: 1 }, // center
          { col: 0, row: 2 }, // bottom-left
          { col: 2, row: 2 }, // bottom-right
        ];

        die5Offsets.forEach((pos, i) => {
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((pos.col + 0.5) * (cellSize - 2 * padding)) / 3,
            y:
              group.y -
              0.5 +
              padding +
              ((pos.row + 0.5) * (cellSize - 2 * padding)) / 3,
          });
        });
        break;
      case 6:
        const die6Offsets = [
          { col: 0, row: 0 }, // bottom-left
          { col: 0, row: 1 },
          { col: 0, row: 2 }, // top-left
          { col: 2, row: 0 }, // bottom-right
          { col: 2, row: 1 },
          { col: 2, row: 2 }, // top-right
        ];

        die6Offsets.forEach((pos, i) => {
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((pos.col + 0.5) * (cellSize - 2 * padding)) / 3,
            y:
              group.y -
              0.5 +
              padding +
              ((pos.row + 0.5) * (cellSize - 2 * padding)) / 3,
          });
        });
        break;

      case 7:
        const die7OffsetsRotated = [
          { col: 0, row: 0 }, // becomes bottom-left → col=0, row=2
          { col: 0, row: 2 }, // becomes top-left → col=2, row=2
          { col: 1, row: 0 }, // becomes bottom-center
          { col: 1, row: 2 }, // becomes top-center
          { col: 2, row: 0 }, // becomes bottom-right
          { col: 2, row: 2 }, // becomes top-right
          { col: 1, row: 1 }, // center stays center
        ];

        die7OffsetsRotated.forEach((pos, i) => {
          // Swap col and row, invert row for 90° clockwise rotation
          const rotatedCol = pos.row;
          const rotatedRow = 2 - pos.col;

          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((rotatedCol + 0.5) * (cellSize - 2 * padding)) / 3,
            y:
              group.y -
              0.5 +
              padding +
              ((rotatedRow + 0.5) * (cellSize - 2 * padding)) / 3,
          });
        });
        break;
      case 8:
        const die8Offsets = [
          { col: 0, row: 0 }, // top-left
          { col: 1, row: 0.5 }, // top-center
          { col: 2, row: 0 }, // top-right
          { col: 0, row: 1 }, // mid-left
          { col: 2, row: 1 }, // mid-right
          { col: 0, row: 2 }, // bottom-left
          { col: 1, row: 1.5 }, // bottom-center
          { col: 2, row: 2 }, // bottom-right
        ];

        die8Offsets.forEach((pos, i) => {
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((pos.col + 0.5) * (cellSize - 2 * padding)) / 3,
            y:
              group.y -
              0.5 +
              padding +
              ((pos.row + 0.5) * (cellSize - 2 * padding)) / 3,
          });
        });
        break;

      case 9:
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const i = row * 3 + col;
            if (i < count) {
              jitteredPoints.push({
                name: group.names[i],
                x:
                  group.x -
                  0.5 +
                  padding +
                  ((col + 0.5) * (cellSize - 2 * padding)) / 3,
                y:
                  group.y -
                  0.5 +
                  padding +
                  ((row + 0.5) * (cellSize - 2 * padding)) / 3,
              });
            }
          }
        }
        break;
      case 10:
        const positions10 = [
          [0, 0],
          [2, 0.75],
          [4, 0],
          [0, 1],
          [4, 1],
          [0, 2],
          [4, 2],
          [0, 3],
          [2, 2.25],
          [4, 3],
        ];

        for (let i = 0; i < count && i < positions10.length; i++) {
          const [col, row] = positions10[i];
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((col + 0.5) * (cellSize - 2 * padding)) / 5,
            y:
              group.y -
              0.5 +
              padding +
              ((row + 0.5) * (cellSize - 2 * padding)) / 4,
          });
        }
        break;

      case 11:
        const positions11 = [
          [0, 0],
          [2, 0],
          [4, 0],
          [0, 1],
          [4, 1],
          [2, 1.5],
          [0, 2],
          [4, 2],
          [0, 3],
          [2, 3],
          [4, 3],
        ];

        for (let i = 0; i < count && i < positions11.length; i++) {
          const [col, row] = positions11[i];
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((col + 0.5) * (cellSize - 2 * padding)) / 5,
            y:
              group.y -
              0.5 +
              padding +
              ((row + 0.5) * (cellSize - 2 * padding)) / 4,
          });
        }
        break;

      case 12:
        const positions12 = [
          [0, 0],
          [2, 0],
          [4, 0],
          [0, 1],
          [2, 1],
          [4, 1],
          [0, 2],
          [2, 2],
          [4, 2],
          [0, 3],
          [2, 3],
          [4, 3],
        ];

        for (let i = 0; i < count && i < positions12.length; i++) {
          const [col, row] = positions12[i];
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((col + 0.5) * (cellSize - 2 * padding)) / 5,
            y:
              group.y -
              0.5 +
              padding +
              ((row + 0.5) * (cellSize - 2 * padding)) / 4,
          });
        }
        break;

      case 13:
        const positions13 = [
          [0, 0],
          [1.33, 0],
          [2.67, 0],
          [4, 0],
          [0, 3],
          [1.33, 3],
          [2.67, 3],
          [4, 3],
          [0, 1],
          [0, 2],
          [4, 1],
          [4, 2],
        ];

        for (let i = 0; i < positions13.length; i++) {
          const [col, row] = positions13[i];
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((col + 0.5) * (cellSize - 2 * padding)) / 5,
            y:
              group.y -
              0.5 +
              padding +
              ((row + 0.5) * (cellSize - 2 * padding)) / 4,
          });
        }

        // Add center dot (13th dot at center of 4x4 grid)
        jitteredPoints.push({
          name: group.names[12],
          x: group.x,
          y: group.y,
        });
        break;

      case 14:
        const positions14 = [
          [0, 0],
          [1.33, 0],
          [2.67, 0],
          [4, 0],
          [0, 3],
          [1.33, 3],
          [2.67, 3],
          [4, 3],
          [0, 1],
          [0, 2],
          [4, 1],
          [4, 2],
          [2, 1],
          [2, 2],
        ];

        for (let i = 0; i < positions14.length; i++) {
          const [col, row] = positions14[i];
          jitteredPoints.push({
            name: group.names[i],
            x:
              group.x -
              0.5 +
              padding +
              ((col + 0.5) * (cellSize - 2 * padding)) / 5,
            y:
              group.y -
              0.5 +
              padding +
              ((row + 0.5) * (cellSize - 2 * padding)) / 4,
          });
        }

        // Add center dot (13th dot at center of 4x4 grid)
        // jitteredPoints.push({
        //   name: group.names[12],
        //   x: group.x,
        //   y: group.y,
        // });
        break;

      default:
        const gridCols = Math.ceil(Math.sqrt(count));
        const gridRows = Math.ceil(count / gridCols);
        const spacingX = (cellSize - 2 * padding) / gridCols;
        const spacingY = (cellSize - 2 * padding) / gridRows;

        for (let i = 0; i < count; i++) {
          const col = i % gridCols;
          const row = Math.floor(i / gridCols);

          jitteredPoints.push({
            name: group.names[i],
            x: group.x - 0.5 + padding + (col + 0.5) * spacingX,
            y: group.y - 0.5 + padding + (row + 0.5) * spacingY,
          });
        }
    }

    /*
        if (count === 1) {
          jitteredPoints.push({
            name: group.names[0],
            x: group.x,
            y: group.y,
          });
        } else {
          const gridCols = Math.ceil(Math.sqrt(count));
          const gridRows = Math.ceil(count / gridCols);
          const spacingX = (cellSize - 2 * padding) / gridCols;
          const spacingY = (cellSize - 2 * padding) / gridRows;

          for (let i = 0; i < count; i++) {
            const col = i % gridCols;
            const row = Math.floor(i / gridCols);

            jitteredPoints.push({
              name: group.names[i],
              x: group.x - 0.5 + padding + (col + 0.5) * spacingX,
              y: group.y - 0.5 + padding + (row + 0.5) * spacingY,
            });
          }
        }
        */
  });

  const backgroundCells = [];
  const bgColor = "rgba(179, 255, 228, 0.627)";

  for (let x = 0; x <= 3; x++) {
    for (let y = 0; y <= 3; y++) {
      backgroundCells.push({
        x,
        y,
        color: bgColor,
      });
    }
  }

  // Invisible tooltip rectangles
  const cellTooltips = Object.values(cellGroups).map((group) => ({
    x: group.x,
    y: group.y,
    name:
      // `Impact: ${categories[group.x]}, Ignorance: ${
      //   categories[group.y]
      // }<br>` +
      // `# of Issues: ${group.names.length}<br>` +
      `<div style="text-align: left; font-weight: bold; margin-top: 6px;">Issues:</div>` +
      // `Issues:` +
      ` <ul style="padding-left: 10px; margin: 4px 0;">` +
      group.names.map((name) => `<li>${name}</li>`).join("") +
      `</ul>`,
    // `Impact: ${categories[group.x]}, Ignorance: ${
    //   categories[group.y]
    // }<br>`,
    //   x: group.x + 0.5,
    //   y: group.y + 0.5,
    // name:
    //   `Impact: ${categories[group.x]}, Ignorance: ${
    //     categories[group.y]
    //   }<br>` +
    //   `# of Issues: ${group.names.length}<br>` +
    //   `Issues: ${group.names.join(", ")}`,
  }));

  console.log("cellTooltips: ", cellTooltips);

  Object.values(cellGroups).forEach((group) => {
    console.log(group.x, group.y);
    console.log(group.names);
  });

  Highcharts.chart(
    "container",
    {
      chart: {
        type: "scatter",
        marginRight: 120,
        marginLeft: 120,
        marginTop: 100,
        zoomType: null,
        // width: 800,
        // height: 800,

        events: {
          render: function () {
            // Keep plot area square
            const chart = this;

            const plotWidth = chart.plotBox.width;
            const plotHeight = chart.plotBox.height;

            if (plotWidth !== plotHeight) {
              const containerWidth = chart.chartWidth;
              const containerHeight = chart.chartHeight;

              const extraWidth = containerWidth - plotWidth;
              const extraHeight = containerHeight - plotHeight;

              if (plotWidth > plotHeight) {
                // Too wide — reduce chart width
                const newSize = plotHeight;
                chart.setSize(
                  newSize + extraWidth,
                  newSize + extraHeight,
                  false
                );
              } else {
                // Too tall — reduce chart height
                const newSize = plotWidth;
                chart.setSize(
                  newSize + extraWidth,
                  newSize + extraHeight,
                  false
                );
              }
            }
          },
          load: function () {
            const chart = this;

            chart.customLabels = [];

            const coords = [
              { name: "Manage", x: 1.5, y: 1.5 },
              { name: "Navigate", x: 6, y: 1.5 },
              { name: "Specify", x: 1.5, y: 6 },
              { name: "Discovery", x: 6, y: 6 },
            ];

            const chartLeftInPixels = 0;

            // 2. Convert to data value
            const chartLeftInDataCoords =
              chart.xAxis[0].toValue(chartLeftInPixels);

            console.log(
              "Left edge of chart in data coordinates:",
              chartLeftInDataCoords
            );

            coords.forEach((q) => {
              const label = chart.renderer
                .text(q.name, 0, 0) // initial dummy pos
                .css({
                  color: "#aaa",
                  fontSize: "35px",
                  fontWeight: "bold",
                  textAlign: "center",
                })
                .attr({
                  align: "center", // horizontal centering
                })
                .add();

              chart.customLabels.push({ x: q.x, y: q.y, label });
            });

            /*
            coordsLabels.forEach((q) => {
              const label = chart.renderer
                .text(q.name, 0, 0) // initial dummy pos
                .css({
                  color: "#000",
                  fontSize: "10px",
                  // fontWeight: "bold",
                  textAlign: "right",
                })
                .attr({
                  align: "right", // horizontal centering
                })
                .add();

              const x = chart.plotLeft + q.x;
              const y = chart.plotTop + q.y;

              label.attr({
                x: x,
                y: y,
              });

              // chart.customLabels.push({ x: 0, y: q.y, label });
              chart.customLabels.push({ x: q.x, y: q.y, label });
            });
            */

            // ✅ Add text to the right of y=8 (top row)
            const ySpacing =
              chart.yAxis[0].toPixels(8) - chart.yAxis[0].toPixels(7);
            console.log("ySpacing: ", ySpacing);
            const yPx9 = chart.yAxis[0].toPixels(8.5); // y = 8 → "9" label (top row)
            console.log("yPx9: ", yPx9);
            const yPx8 = chart.yAxis[0].toPixels(7.5); // y = 8 → "9" label (top row)
            console.log("yPx8: ", yPx8);
            const yPx7 = chart.yAxis[0].toPixels(6.5); // y = 8 → "9" label (top row)
            console.log("yPx7: ", yPx7);
            const xPx = chart.plotBox.x + chart.plotBox.width + 10; // just outside plot area
            console.log("xPx: ", xPx);
            const yPx2 = chart.yAxis[0].toPixels(1);
            console.log("yPx2: ", yPx2);

            const lineHeight = 12; // vertical space between labels

            Object.entries(quadrantGroups).forEach(([quadrantName, rows]) => {
              Object.entries(rows).forEach(([y, points]) => {
                points.forEach((pt, idx) => {
                  const label = chart.renderer
                    .text(pt.name, 0, 0)
                    .css({
                      fontSize: "10px",
                      color: "#000",
                    })
                    .attr({
                      align: "left",
                      zIndex: 5,
                    })
                    .add();

                  chart.customLabels.push({
                    x: pt.x,
                    y: Number(y), // Ensure it's numeric
                    label: label,
                    isCellLabel: true,
                    lineOffset: idx * lineHeight,
                  });
                });
              });
            });

            // const lineHeight = 12; // pixels between lines

            // Object.values(cellGroups).forEach((group) => {
            //   group.names.forEach((name, idx) => {
            //     const label = chart.renderer
            //       .text(name, 0, 0)
            //       .css({
            //         fontSize: "10px",
            //         color: "#000",
            //       })
            //       .attr({
            //         align: "center",
            //         zIndex: 5,
            //       })
            //       .add();

            //     chart.customLabels.push({
            //       x: group.x,
            //       y: group.y,
            //       label: label,
            //       isCellLabel: true,
            //       lineOffset: idx * lineHeight, // For positioning later
            //     });
            //   });
            // });

            // Add labels with names for each cell group
            // Object.values(cellGroups).forEach((group) => {
            //   console.log("group:  ", group);
            //   const namesList = group.names.join("|");
            //   const label = chart.renderer
            //     .text(namesList, 0, 0)
            //     .css({
            //       fontSize: "10px",
            //       color: "#000",
            //     })
            //     .attr({
            //       align: "center",
            //       zIndex: 5,
            //     })
            //     .add();

            //   chart.customLabels.push({
            //     x: group.x,
            //     y: group.y,
            //     label: label,
            //     isCellLabel: true, // Mark for later positioning
            //   });
            // });
          },
          redraw: function () {
            positionLabels(this); // Reposition on resize
          },
        },
      },
      credits: {
        enabled: false,
      },
      title: {
        // text: null,
        text: "Discovery Grid",
      },
      xAxis: {
        title: {
          text: "Impact",
          style: {
            fontSize: "18px", // ← Increase this as needed
            fontWeight: "bold",
          },
        },
        labels: {
          style: {
            fontSize: "18px", // ← increase tick label size
          },
        },
        categories: categories,
        min: 0,
        max: 8,
        gridLineWidth: 1,
        gridLineColor: "#888",
      },
      yAxis: {
        title: {
          text: "Ignorance",
          align: "high", // Align at top
          rotation: 0, // Horizontal text
          x: 50, // Adjust left/right as needed
          y: -5, // Move upwards if needed (tweak to fit)
          style: {
            fontSize: "18px", // ← Increase this as needed
            fontWeight: "bold",
          },
        },
        labels: {
          style: {
            fontSize: "18px", // ← increase tick label size
          },
        },
        categories: categories,
        min: 0,
        max: 8,
        gridLineWidth: 1,
        gridLineColor: "#888",
      },
      tooltip: {
        shared: false,
        useHTML: true,
        formatter: function () {
          return this.point.name;
        },
      },

      plotOptions: {
        series: {
          states: {
            inactive: {
              enabled: false, // Prevent dimming of non-hovered points
            },
          },
        },
        scatter: {
          marker: { radius: 6 },
          //   dataLabels: {
          //     enabled: true,
          //     format: '{point.name}',
          //     allowOverlap: false,
          //     style: {
          //       fontSize: '11px',
          //       textOutline: 'none'
          //     }
          //   }
        },
      },
      series: [
        {
          name: "Points",
          data: jitteredPoints,
          showInLegend: false,
          enableMouseTracking: false,
          dataLabels: {
            enabled: false,
          },
        },
        {
          name: "Cells",
          type: "scatter",
          data: cellTooltips,
          marker: {
            symbol: "square",
            radius: 30,
            fillColor: "transparent",
            lineWidth: 0,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          enableMouseTracking: true,
          showInLegend: false,
          clip: false,
        },
        {
          name: "Manage",
          type: "polygon",
          color: "rgba(179, 255, 228, 0.627)",
          animation: false,
          enableMouseTracking: false,
          showInLegend: false,
          data: [
            [-0.5, -0.5],
            [3.5, -0.5],
            [3.5, 3.5],
            [-0.5, 3.5],
          ],
          zIndex: -10,
        },

        {
          name: "Navigate",
          type: "polygon",
          // color: 'rgba(179, 255, 228, 0.627)',
          color: "#a0c5f899",
          animation: false,
          enableMouseTracking: false,
          showInLegend: false,
          data: [
            [3.5, -0.5],
            [8.5, -0.5],
            [8.5, 3.5],
            [3.5, 3.5],
          ],
          zIndex: -10,
        },

        {
          name: "Specify",
          type: "polygon",
          color: "rgba(255, 255, 150, 0.45)",
          animation: false,
          enableMouseTracking: false,
          showInLegend: false,
          data: [
            [-0.5, 3.5],
            [3.5, 3.5],
            [3.5, 8.5],
            [-0.5, 8.5],
          ],
          zIndex: -10,
        },

        {
          name: "Discovery",
          type: "polygon",
          color: "#ffcce469",
          animation: false,
          enableMouseTracking: false,
          showInLegend: false,
          data: [
            [3.5, 3.5],
            [8.5, 3.5],
            [8.5, 8.5],
            [3.5, 8.5],
          ],
          zIndex: -10,
        },
      ],
    },
    function (chart) {
      // Highlight points inside rectangle on hover
      const mainSeries = chart.series[0];
      const rectSeries = chart.series[1];
      const highlightRadius = 0.6;

      rectSeries.points.forEach((rect) => {
        if (rect.graphic && rect.graphic.element) {
          rect.graphic.element.addEventListener("mouseenter", () => {
            mainSeries.points.forEach((pt) => {
              const dx = pt.x - rect.x;
              const dy = pt.y - rect.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              pt.setState(dist < highlightRadius ? "hover" : "");
            });
          });

          rect.graphic.element.addEventListener("mouseleave", () => {
            mainSeries.points.forEach((pt) => pt.setState(""));
          });
        }
      });
    }
  );
}
// function positionLabels(chart) {
//   chart.customLabels.forEach(({ x, y, label }) => {
//     const px = chart.xAxis[0].toPixels(x);
//     const py = chart.yAxis[0].toPixels(y);

//     label.attr({
//       x: px,
//       y: py,
//       align: "center",
//     });
//   });
// }

// function positionLabels(chart) {
//   chart.customLabels.forEach(({ x, y, label, isCellLabel }) => {
//     // if (isCellLabel) x = x + 0.5;
//     if (isCellLabel) {
//       if (x < 4) x = -2.42857;
//       else x = 8.6;
//     }
//     const px = chart.xAxis[0].toPixels(x);
//     const py = chart.yAxis[0].toPixels(y);

//     label.attr({
//       // x: px + (isCellLabel ? 33 : 0),
//       x: px,
//       y: py, // Offset cell labels slightly below point
//       // y: py + (isCellLabel ? 8 : 0), // Offset cell labels slightly below point
//       align: isCellLabel ? "left" : "center",
//     });
//   });
// }

// function positionLabels(chart) {
//   chart.customLabels.forEach(({ x, y, label, isCellLabel, lineOffset }) => {
//     console.log("x: ", x, "y: ", y, "lineOffset: ", lineOffset);
//     let plotX = x;
//     if (isCellLabel) {
//       plotX = x < 4 ? 0 : 8.6; // Your logic for left/right placement
//       // plotX = x < 4 ? -2.42857 : 8.6; // Your logic for left/right placement
//     }

//     const px = chart.xAxis[0].toPixels(plotX);
//     const py = chart.yAxis[0].toPixels(y);

//     const fontSize = parseFloat(getComputedStyle(label.element).fontSize) || 10; // fallback if style not yet applied

//     const fontOffset = fontSize / 2;

//     label.attr({
//       x: px,
//       y: py + (isCellLabel ? lineOffset : 0) + fontOffset, // Stack each label downwards
//       align: isCellLabel ? "left" : "center",
//     });
//   });
// }

// function positionLabels(chart) {
//   // Group labels by (x, y) pairs so we can calculate vertical centering per group
//   const labelsByCell = {};

//   chart.customLabels.forEach(({ x, y, label, isCellLabel, lineOffset }) => {
//     const key = `${x}-${y}`;
//     if (!labelsByCell[key]) {
//       labelsByCell[key] = [];
//     }
//     labelsByCell[key].push({ x, y, label, isCellLabel, lineOffset });
//   });

//   Object.values(labelsByCell).forEach((labelGroup) => {
//     // Assume all have same y, x and font size
//     const sample = labelGroup[0];
//     let plotX = sample.x;
//     if (sample.isCellLabel) {
//       plotX = sample.x < 4 ? -2.4 : 8.6;
//     }

//     const px = chart.xAxis[0].toPixels(plotX);
//     const py = chart.yAxis[0].toPixels(sample.y);

//     // Get font size dynamically (assuming all labels in group share it)
//     const fontSize =
//       parseFloat(getComputedStyle(sample.label.element).fontSize) || 10;
//     const fontOffset = fontSize / 2;
//     const lineHeight = 12; // Should match your label line height

//     const totalHeight = labelGroup.length * lineHeight;
//     const startY = py - totalHeight / 2 + fontOffset; // Centered start position

//     labelGroup.forEach(({ label, isCellLabel }, idx) => {
//       label.attr({
//         x: px,
//         y: startY + idx * lineHeight,
//         align: isCellLabel ? "left" : "center",
//       });
//     });
//   });
// }

function positionLabels(chart) {
  const labelsByRow = {};

  chart.customLabels.forEach(({ x, y, label, isCellLabel }) => {
    const key = y;
    if (!labelsByRow[key]) {
      labelsByRow[key] = [];
    }
    labelsByRow[key].push({ x, y, label, isCellLabel });
  });

  Object.values(labelsByRow).forEach((labelsInRow) => {
    const numLabels = labelsInRow.length;
    const baseY = labelsInRow[0].y;

    // Reverse the labels array for bottom-up ordering
    labelsInRow
      .slice() // shallow copy to avoid mutating original
      .reverse()
      .forEach(({ x, label, isCellLabel }, idx) => {
        const plotX = isCellLabel
          ? x < 4
            ? chart.xAxis[0].toValue(0)
            : 8.6
          : x;

        const relativeY = baseY - 0.5 + ((idx + 0.5) * 1) / numLabels;

        const px = chart.xAxis[0].toPixels(plotX);
        const py = chart.yAxis[0].toPixels(relativeY);

        label.attr({
          x: px,
          y: py,
          align: isCellLabel ? "left" : "center",
        });
      });
  });
}

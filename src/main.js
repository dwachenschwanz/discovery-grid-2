import Highcharts from "highcharts";
import "highcharts/highcharts-more";
import { dataClient } from "./utils/data_client.js";
import "./style.css";

const categories = Array.from({ length: 9 }, (_, i) => String(i + 1));
const CELL_SIZE = 1;
const CELL_PADDING = 0.1;
const HIGHLIGHT_RADIUS = 0.6;
const DEBUG = false;

const log = (...args) => {
  if (DEBUG) console.log(...args);
};

const stickyNote = document.querySelector(".stickyNote");
const stickyTitle = stickyNote?.querySelector(".stickyNoteTitle");

const LAYOUTS = {
  1: { cols: 1, rows: 1, positions: [{ col: 0, row: 0, center: true }] },
  2: {
    cols: 3,
    rows: 3,
    positions: [
      { col: 0, row: 2 },
      { col: 2, row: 0 },
    ],
  },
  3: {
    cols: 3,
    rows: 3,
    positions: [
      { col: 0, row: 0 },
      { col: 1, row: 1 },
      { col: 2, row: 2 },
    ],
  },
  4: {
    cols: 3,
    rows: 3,
    positions: [
      { col: 0, row: 0 },
      { col: 2, row: 0 },
      { col: 0, row: 2 },
      { col: 2, row: 2 },
    ],
  },
  5: {
    cols: 3,
    rows: 3,
    positions: [
      { col: 0, row: 0 },
      { col: 2, row: 0 },
      { col: 1, row: 1 },
      { col: 0, row: 2 },
      { col: 2, row: 2 },
    ],
  },
  6: {
    cols: 3,
    rows: 3,
    positions: [
      { col: 0, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: 2 },
      { col: 2, row: 0 },
      { col: 2, row: 1 },
      { col: 2, row: 2 },
    ],
  },
  7: {
    cols: 3,
    rows: 3,
    positions: [
      { col: 0, row: 2 },
      { col: 2, row: 2 },
      { col: 0, row: 1 },
      { col: 2, row: 1 },
      { col: 0, row: 0 },
      { col: 2, row: 0 },
      { col: 1, row: 1 },
    ],
  },
  8: {
    cols: 3,
    rows: 3,
    positions: [
      { col: 0, row: 0 },
      { col: 1, row: 0.5 },
      { col: 2, row: 0 },
      { col: 0, row: 1 },
      { col: 2, row: 1 },
      { col: 0, row: 2 },
      { col: 1, row: 1.5 },
      { col: 2, row: 2 },
    ],
  },
  9: {
    cols: 3,
    rows: 3,
    positions: [
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 },
      { col: 0, row: 1 },
      { col: 1, row: 1 },
      { col: 2, row: 1 },
      { col: 0, row: 2 },
      { col: 1, row: 2 },
      { col: 2, row: 2 },
    ],
  },
  10: {
    cols: 5,
    rows: 4,
    positions: [
      { col: 0, row: 0 },
      { col: 2, row: 0.75 },
      { col: 4, row: 0 },
      { col: 0, row: 1 },
      { col: 4, row: 1 },
      { col: 0, row: 2 },
      { col: 4, row: 2 },
      { col: 0, row: 3 },
      { col: 2, row: 2.25 },
      { col: 4, row: 3 },
    ],
  },
  11: {
    cols: 5,
    rows: 4,
    positions: [
      { col: 0, row: 0 },
      { col: 2, row: 0 },
      { col: 4, row: 0 },
      { col: 0, row: 1 },
      { col: 4, row: 1 },
      { col: 2, row: 1.5 },
      { col: 0, row: 2 },
      { col: 4, row: 2 },
      { col: 0, row: 3 },
      { col: 2, row: 3 },
      { col: 4, row: 3 },
    ],
  },
  12: {
    cols: 5,
    rows: 4,
    positions: [
      { col: 0, row: 0 },
      { col: 2, row: 0 },
      { col: 4, row: 0 },
      { col: 0, row: 1 },
      { col: 2, row: 1 },
      { col: 4, row: 1 },
      { col: 0, row: 2 },
      { col: 2, row: 2 },
      { col: 4, row: 2 },
      { col: 0, row: 3 },
      { col: 2, row: 3 },
      { col: 4, row: 3 },
    ],
  },
  13: {
    cols: 5,
    rows: 4,
    positions: [
      { col: 0, row: 0 },
      { col: 1.33, row: 0 },
      { col: 2.67, row: 0 },
      { col: 4, row: 0 },
      { col: 0, row: 3 },
      { col: 1.33, row: 3 },
      { col: 2.67, row: 3 },
      { col: 4, row: 3 },
      { col: 0, row: 1 },
      { col: 0, row: 2 },
      { col: 4, row: 1 },
      { col: 4, row: 2 },
      { col: 0, row: 0, center: true },
    ],
  },
  14: {
    cols: 5,
    rows: 4,
    positions: [
      { col: 0, row: 0 },
      { col: 1.33, row: 0 },
      { col: 2.67, row: 0 },
      { col: 4, row: 0 },
      { col: 0, row: 3 },
      { col: 1.33, row: 3 },
      { col: 2.67, row: 3 },
      { col: 4, row: 3 },
      { col: 0, row: 1 },
      { col: 0, row: 2 },
      { col: 4, row: 1 },
      { col: 4, row: 2 },
      { col: 2, row: 1 },
      { col: 2, row: 2 },
    ],
  },
};

main();

async function main() {
  try {
    const data = await dataClient.getData("issues_data.json");
    const basePoints = buildBasePoints(data);
    init(basePoints);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function buildBasePoints(data) {
  return data
    .filter((d) => Number(d.Impact) > 0 && Number(d.Ignorance) > 0)
    .map((d, idx) => ({
      x: Number(d.Impact) - 1,
      y: Number(d.Ignorance) - 1,
      name: String(d["Issue Name"] ?? `Issue ${idx + 1}`),
      description: d.Description ?? "",
    }));
}

function init(basePoints) {
  const { cellGroups, quadrantGroups } = groupData(basePoints);
  const jitteredPoints = buildJitteredPoints(cellGroups);
  const cellTooltips = buildCellTooltips(cellGroups);

  log("quadrantGroups", quadrantGroups);
  log("cellTooltips", cellTooltips);

  renderChart({
    jitteredPoints,
    cellTooltips,
    quadrantGroups,
  });
}

function groupData(basePoints) {
  const cellGroups = {};
  const quadrantGroups = { Q1: {}, Q2: {}, Q3: {}, Q4: {} };

  basePoints.forEach((pt) => {
    const key = `${pt.x}-${pt.y}`;

    if (!cellGroups[key]) {
      cellGroups[key] = { x: pt.x, y: pt.y, items: [] };
    }
    cellGroups[key].items.push(pt);

    const quadrant = getQuadrant(pt.x, pt.y);
    if (quadrant) {
      if (!quadrantGroups[quadrant][pt.y]) {
        quadrantGroups[quadrant][pt.y] = [];
      }
      quadrantGroups[quadrant][pt.y].push(pt);
    }
  });

  return { cellGroups, quadrantGroups };
}

function getQuadrant(x, y) {
  if (x >= 0 && x <= 3 && y >= 0 && y <= 3) return "Q1";
  if (x >= 4 && x <= 8 && y >= 0 && y <= 3) return "Q2";
  if (x >= 0 && x <= 3 && y >= 4 && y <= 8) return "Q3";
  if (x >= 4 && x <= 8 && y >= 4 && y <= 8) return "Q4";
  return null;
}

function buildJitteredPoints(cellGroups) {
  const jitteredPoints = [];

  Object.values(cellGroups).forEach((group) => {
    const items = group.items ?? [];
    const count = items.length;
    const layout = LAYOUTS[count];

    if (layout) {
      layout.positions.forEach((pos, i) => {
        const item = items[i];
        if (!item) return;

        if (pos.center) {
          jitteredPoints.push({
            name: item.name,
            x: group.x,
            y: group.y,
          });
          return;
        }

        jitteredPoints.push(
          placePoint(
            group,
            item.name,
            pos.col,
            pos.row,
            layout.cols,
            layout.rows,
          ),
        );
      });
      return;
    }

    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    for (let i = 0; i < count; i++) {
      const item = items[i];
      if (!item) continue;

      jitteredPoints.push(
        placePoint(
          group,
          item.name,
          i % cols,
          Math.floor(i / cols),
          cols,
          rows,
        ),
      );
    }
  });

  return jitteredPoints;
}

function placePoint(group, name, col, row, cols, rows) {
  const usableWidth = CELL_SIZE - 2 * CELL_PADDING;
  const usableHeight = CELL_SIZE - 2 * CELL_PADDING;

  return {
    name,
    x: group.x - 0.5 + CELL_PADDING + ((col + 0.5) * usableWidth) / cols,
    y: group.y - 0.5 + CELL_PADDING + ((row + 0.5) * usableHeight) / rows,
  };
}

function buildCellTooltips(cellGroups) {
  return Object.values(cellGroups).map((group) => {
    const itemsHtml = (group.items ?? [])
      .map((item) => `<li>${escapeHtml(item.name)}</li>`)
      .join("");

    return {
      x: group.x,
      y: group.y,
      name: `
        <div style="text-align: left; font-weight: bold; margin-top: 6px;">Issues:</div>
        <ul style="padding-left: 10px; margin: 4px 0;">
          ${itemsHtml}
        </ul>
      `,
    };
  });
}

function renderChart({ jitteredPoints, cellTooltips, quadrantGroups }) {
  Highcharts.chart("container", {
    chart: {
      type: "scatter",
      marginRight: 120,
      marginLeft: 180,
      marginTop: 60,
      zoomType: null,
      events: {
        load: function () {
          const chart = this;
          chart.customLabels = [];

          addQuadrantLabels(chart);
          addIssueLabels(chart, quadrantGroups);
          chart.labelsByRow = buildLabelsByRow(chart.customLabels);

          enforceSquarePlot(chart);
          positionLabels(chart);
        },
        redraw: function () {
          enforceSquarePlot(this);
          positionLabels(this);
        },
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Discovery Grid",
    },
    xAxis: {
      title: {
        text: "Impact",
        y: -10,
        style: {
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          fontSize: "18px",
        },
        y: 20,
        // formatter: function () {
        //   return this.value === "5" ? "" : this.value;
        // },
      },
      categories,
      min: 0,
      max: 8,
      gridLineWidth: 1,
      gridLineColor: "#888",
      lineWidth: 0,
    },
    yAxis: {
      title: {
        text: "Ignorance",
        align: "middle",
        rotation: 270,
        x: 20,
        style: {
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          fontSize: "18px",
        },
        x: -10,
        formatter: function () {
          return this.value === "5" ? "" : this.value;
        },
      },
      categories,
      min: 0,
      max: 8,
      gridLineWidth: 1,
      gridLineColor: "#888",
    },
    // xAxis: {
    //   title: {
    //     text: "Impact",
    //     margin: 20,
    //     y: -20,
    //     style: {
    //       fontSize: "18px",
    //       fontWeight: "bold",
    //     },
    //   },
    //   labels: {
    //     style: {
    //       fontSize: "18px",
    //     },
    //     y: 20,
    //     // formatter: function () {
    //     //   return this.value === "5" ? "" : this.value;
    //     // },
    //   },
    //   categories,
    //   min: 0,
    //   max: 8,
    //   gridLineWidth: 1,
    //   gridLineColor: "#888",
    //   lineWidth: 0,
    // },
    // yAxis: {
    //   title: {
    //     text: "Ignorance",
    //     align: "middle",
    //     rotation: 270,
    //     margin: 25,
    //     x: 31,
    //     style: {
    //       fontSize: "18px",
    //       fontWeight: "bold",
    //     },
    //   },
    //   labels: {
    //     style: {
    //       fontSize: "18px",
    //     },
    //     x: -10,
    //     formatter: function () {
    //       return this.value === "5" ? "" : this.value;
    //     },
    //   },
    //   categories,
    //   min: 0,
    //   max: 8,
    //   gridLineWidth: 1,
    //   gridLineColor: "#888",
    // },
    tooltip: {
      shared: false,
      useHTML: true,
      formatter: function () {
        if (this.series.name !== "Cells") return false;
        return this.point.name;
      },
    },
    plotOptions: {
      series: {
        states: {
          inactive: {
            enabled: false,
          },
        },
      },
      scatter: {
        marker: { radius: 6 },
      },
    },
    series: [
      {
        name: "Points",
        type: "scatter",
        data: jitteredPoints,
        showInLegend: false,
        enableMouseTracking: false,
        states: {
          hover: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
      },
      {
        name: "Cells",
        type: "scatter",
        data: cellTooltips,
        enableMouseTracking: true,
        marker: {
          enabled: true,
          symbol: "square",
          radius: 30,
          fillColor: "rgba(255,255,255,0.001)",
          lineWidth: 0,
          states: {
            hover: {
              enabled: true,
              lineColor: "#ff0000",
              lineWidth: 3,
              fillColor: "rgba(255, 0, 0, 0.2)",
            },
          },
        },
        point: {
          events: {
            mouseOver: function () {
              highlightPointsForCell(this.series.chart, this.x, this.y);
            },
            mouseOut: function () {
              clearPointHighlight(this.series.chart);
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        states: {
          hover: {
            halo: {
              size: 0,
            },
          },
        },
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
  });
}

function addQuadrantLabels(chart) {
  const coords = [
    { name: "Manage", x: 1.5, y: 1.5 },
    { name: "Navigate", x: 6, y: 1.5 },
    { name: "Specify", x: 1.5, y: 6 },
    { name: "Discovery", x: 6, y: 6 },
  ];

  coords.forEach((q) => {
    const label = chart.renderer
      .text(q.name, 0, 0)
      .css({
        color: "#aaa",
        fontSize: "35px",
        fontWeight: "bold",
        textAlign: "center",
      })
      .attr({
        align: "center",
      })
      .add();

    chart.customLabels.push({ x: q.x, y: q.y, label, isCellLabel: false });
  });
}

function addIssueLabels(chart, quadrantGroups) {
  Object.values(quadrantGroups).forEach((rows) => {
    Object.keys(rows)
      .sort((a, b) => Number(b) - Number(a)) // higher row numbers first
      .forEach((y) => {
        rows[y]
          .slice()
          .sort((a, b) => b.x - a.x) // higher impact first within the row
          .forEach((pt) => {
            const label = chart.renderer
              // .text(`${pt.x + 1}-${pt.name}`, 0, 0)
              .text(`${pt.x + 1} · ${pt.name}`)
              .css({
                fontSize: "10px",
                color: "#000",
              })
              .attr({
                align: pt.x < 4 ? "right" : "left",
                zIndex: 5,
              })
              .add();

            const meta = {
              x: pt.x,
              y: Number(y),
              label,
              isCellLabel: true,
              issueName: pt.name,
              description: pt.description ?? "",
            };

            chart.customLabels.push(meta);
            bindIssueLabelEvents(
              chart,
              label,
              meta.x,
              meta.y,
              meta.issueName,
              meta.description,
            );
          });
      });
  });
}

function buildLabelsByRow(labels) {
  const labelsByRow = {};

  labels.forEach(({ x, y, label, isCellLabel = false, issueName }) => {
    const key = y;
    if (!labelsByRow[key]) {
      labelsByRow[key] = [];
    }
    labelsByRow[key].push({ x, y, label, isCellLabel, issueName });
  });

  return labelsByRow;
}

// function positionLabels(chart) {
//   const labelsByRow = chart.labelsByRow ?? {};

//   Object.values(labelsByRow).forEach((labelsInRow) => {
//     const numLabels = labelsInRow.length;
//     const baseY = labelsInRow[0].y;

//     labelsInRow
//       .slice()
//       .reverse()
//       .forEach(({ x, label, isCellLabel }, idx) => {
//         const plotX = getLabelPlotX(chart, x, isCellLabel);
//         const relativeY = baseY - 0.5 + ((idx + 0.5) * 1) / numLabels;

//         label.attr({
//           x: chart.xAxis[0].toPixels(plotX),
//           y: chart.yAxis[0].toPixels(relativeY),
//           align: isCellLabel ? "left" : "center",
//         });
//       });
//   });
// }

function positionLabels(chart) {
  const labelsByRow = chart.labelsByRow ?? {};
  const LEFT_LABEL_PAD = 30;
  const RIGHT_LABEL_PAD = 8;

  Object.values(labelsByRow).forEach((labelsInRow) => {
    const numLabels = labelsInRow.length;
    const baseY = labelsInRow[0].y;

    labelsInRow
      .slice()
      .reverse()
      .forEach(({ x, label, isCellLabel }, idx) => {
        const relativeY = baseY - 0.5 + ((idx + 0.5) * 1) / numLabels;
        const pixelY = chart.yAxis[0].toPixels(relativeY);

        if (!isCellLabel) {
          label.attr({
            x: chart.xAxis[0].toPixels(x),
            y: pixelY,
            align: "center",
          });
          return;
        }

        const isLeftSide = x < 4;
        const pixelX = isLeftSide
          ? chart.plotLeft - LEFT_LABEL_PAD
          : chart.plotLeft + chart.plotWidth + RIGHT_LABEL_PAD;

        label.attr({
          x: pixelX,
          y: pixelY,
          align: isLeftSide ? "right" : "left",
        });
      });
  });
}

function getLabelPlotX(chart, x, isCellLabel) {
  if (!isCellLabel) return x;
  return x < 4 ? chart.xAxis[0].toValue(0) : 8.6;
}

// function bindIssueLabelEvents(chart, label, x, y, issueName) {
//   if (label.clickBound) return;

//   const rectSeries = chart.series[1];

//   label.css({
//     color: "#000",
//     textDecoration: "underline",
//     fontWeight: "normal",
//   });
//   label.element.style.cursor = "pointer";
//   label.element.setAttribute("title", "Click to highlight or filter");

//   label.element.addEventListener("mouseenter", () => {
//     label.css({ color: "#ff0000", fontWeight: "bold" });

//     rectSeries.points.forEach((pt) => {
//       if (pt.x === x && pt.y === y) {
//         pt.setState("hover");
//       }
//     });

//     const labelRect = label.element.getBoundingClientRect();
//     const parentRect = label.element.parentElement?.getBoundingClientRect();
//     if (!parentRect || !stickyNote) return;

//     const verticalOffset = labelRect.top - parentRect.top;

//     if (stickyTitle) {
//       stickyTitle.textContent = issueName || label.textStr;
//     }

//     if (x > 3) {
//       stickyNote.style.left = "100%";
//       stickyNote.style.transform = "translateX(10px)";
//     } else {
//       stickyNote.style.left = "-10px";
//       stickyNote.style.transform = "translateX(-100%)";
//     }

//     stickyNote.style.top = `${verticalOffset}px`;
//     stickyNote.classList.add("show");
//   });

//   label.element.addEventListener("mouseleave", () => {
//     label.css({ color: "#000", fontWeight: "normal" });
//     rectSeries.points.forEach((pt) => pt.setState(""));
//     stickyNote?.classList.remove("show");
//   });

//   label.element.addEventListener("click", () => {
//     alert(`You clicked on label: ${label.textStr}`);
//   });

//   label.clickBound = true;
// }

function bindIssueLabelEvents(chart, label, x, y, issueName, description) {
  if (label.clickBound) return;

  const rectSeries = chart.series[1];
  const stickyBody = stickyNote?.querySelector(".stickyNoteBody");

  // label.css({
  //   color: "#000",
  //   textDecoration: "underline",
  //   fontWeight: "normal",
  // });
  label.css({
    color: "#333",
    color: "#2c2c2c",
    fontSize: "11px",
    textDecoration: "none",
    fontWeight: "500",
  });

  // label.element.style.cursor = "pointer";
  label.element.style.cursor = "help";

  label.element.addEventListener("mouseenter", () => {
    // label.css({ color: "#ff0000", fontWeight: "bold" });
    label.css({
      color: "#d22",
      fontWeight: "600",
    });

    // label.element.addEventListener("mouseenter", () => {
    //   label.css({
    //     color: "#d22",
    //     fontWeight: "600",
    //   });
    // });

    rectSeries.points.forEach((pt) => {
      if (pt.x === x && pt.y === y) {
        pt.setState("hover");
      }
    });

    const labelRect = label.element.getBoundingClientRect();
    const parentRect = label.element.parentElement?.getBoundingClientRect();
    if (!parentRect || !stickyNote) return;

    const verticalOffset = labelRect.top - parentRect.top;

    if (stickyTitle) {
      stickyTitle.textContent = issueName;
    }

    if (stickyBody) {
      stickyBody.textContent = description || "";
    }

    if (x > 3) {
      stickyNote.style.left = "100%";
      stickyNote.style.transform = "translateX(10px)";
    } else {
      stickyNote.style.left = "-10px";
      stickyNote.style.transform = "translateX(-100%)";
    }

    stickyNote.style.top = `${verticalOffset}px`;
    stickyNote.classList.add("show");
  });

  label.element.addEventListener("mouseleave", () => {
    // label.css({ color: "#000", fontWeight: "normal" });
    label.css({
      color: "#333",
      color: "#2c2c2c",
      fontSize: "11px",
      fontWeight: "500",
    });
    rectSeries.points.forEach((pt) => pt.setState(""));
    stickyNote?.classList.remove("show");
  });

  label.clickBound = true;
}

function highlightPointsForCell(chart, cellX, cellY) {
  const mainSeries = chart.series[0];

  mainSeries.points.forEach((pt) => {
    const dx = pt.x - cellX;
    const dy = pt.y - cellY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    pt.setState(dist < HIGHLIGHT_RADIUS ? "hover" : "");
  });
}

function clearPointHighlight(chart) {
  const mainSeries = chart.series[0];
  mainSeries.points.forEach((pt) => pt.setState(""));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function enforceSquarePlot(chart) {
  if (chart.__squareFramePending || chart.__resizingToSquare) return;
  if (!chart.container?.offsetWidth || !chart.container?.offsetHeight) return;

  const plotWidth = chart.plotWidth;
  const plotHeight = chart.plotHeight;
  if (Math.abs(plotWidth - plotHeight) < 1) return;

  chart.__squareFramePending = true;

  requestAnimationFrame(() => {
    chart.__squareFramePending = false;
    if (chart.__resizingToSquare) return;

    const nextPlotWidth = chart.plotWidth;
    const nextPlotHeight = chart.plotHeight;
    if (Math.abs(nextPlotWidth - nextPlotHeight) < 1) return;

    const extraWidth = chart.chartWidth - nextPlotWidth;
    const extraHeight = chart.chartHeight - nextPlotHeight;
    const squareSize = Math.min(nextPlotWidth, nextPlotHeight);

    chart.__resizingToSquare = true;
    chart.setSize(squareSize + extraWidth, squareSize + extraHeight, false);
    chart.__resizingToSquare = false;
  });
}

import Highcharts from "highcharts";
import "highcharts/highcharts-more";
import { dataClient } from "./utils/data_client.js";
import "./components/StickyNoteCard.js";
// import { attachStickyTitleHelpers } from "./utils/sticky_note_title.js";
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

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
  "want",
  "needs",
  "need",
  "interested",
  "looking",
  "large",
  "small",
  "many",
  "much",
  "more",
  "less",
  "very",
  "really",
  "about",
]);

const PHRASE_RULES = [
  {
    pattern: /\bsingle consistent energy provider\b/i,
    replace: "Sole Provider",
  },
  { pattern: /\bsingle energy provider\b/i, replace: "Sole Provider" },
  { pattern: /\bbilling confusion\b/i, replace: "Billing Confusion" },
  { pattern: /\bconfused about billing\b/i, replace: "Billing Confusion" },
  { pattern: /\bpricing confusion\b/i, replace: "Pricing Clarity" },
  { pattern: /\bdelay in permitting\b/i, replace: "Permitting Delay" },
];

function generateStickyTitle(description, maxWords = 4, maxChars = 24) {
  if (!description) return "";

  for (const rule of PHRASE_RULES) {
    if (rule.pattern.test(description)) {
      return rule.replace;
    }
  }

  const words = description
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const filtered = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
  const selected = filtered.slice(0, maxWords);

  let title = selected
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  if (title.length > maxChars) {
    title = title.slice(0, maxChars).trim();
  }

  return title;
}

function numberToLetters(n) {
  let result = "";
  let value = n + 1;

  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }

  return result;
}

function assignLettersToCells(cellGroups) {
  const sortedGroups = Object.values(cellGroups).sort((a, b) => {
    const productA = (a.x + 1) * (a.y + 1);
    const productB = (b.x + 1) * (b.y + 1);

    if (productB !== productA) return productB - productA;
    if (b.y !== a.y) return b.y - a.y;
    return b.x - a.x;
  });

  sortedGroups.forEach((group, index) => {
    group.cellLetter = numberToLetters(index);
  });
}

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
      name:
        generateStickyTitle(d.Description) ||
        String(d["Issue Name"] ?? `Issue ${idx + 1}`),
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
    cellGroups,
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

  assignLettersToCells(cellGroups);

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
      cellLetter: group.cellLetter,
      name: `
        <div style="text-align: left; font-weight: bold; margin-bottom: 6px;">
          ${escapeHtml(group.cellLetter)}
        </div>
        <div style="text-align: left; font-weight: bold; margin-top: 6px;">Issues:</div>
        <ul style="padding-left: 10px; margin: 4px 0;">
          ${itemsHtml}
        </ul>
      `,
    };
  });
}

function renderChart({
  jitteredPoints,
  cellTooltips,
  quadrantGroups,
  cellGroups,
}) {
  Highcharts.chart("container", {
    chart: {
      type: "scatter",
      marginRight: 220,
      marginLeft: 180,
      marginTop: 60,
      zoomType: null,
      events: {
        load: function () {
          const chart = this;
          chart.customLabels = [];

          addQuadrantLabels(chart);
          addIssueLabels(chart, quadrantGroups, cellGroups);
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
        x: 0,
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
          // return this.value === "5" ? "" : this.value;
          return this.value;
        },
      },
      categories,
      min: 0,
      max: 8,
      gridLineWidth: 1,
      gridLineColor: "#888",
    },
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
          enabled: true,
          useHTML: false,
          formatter: function () {
            return this.point.cellLetter || "";
          },
          style: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#000",
            textOutline: "none",
          },
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

function addIssueLabels(chart, quadrantGroups, cellGroups) {
  const allIssues = [];

  Object.values(quadrantGroups).forEach((rows) => {
    Object.keys(rows).forEach((y) => {
      rows[y].forEach((pt) => {
        const groupKey = `${pt.x}-${pt.y}`;
        const cellLetter = cellGroups[groupKey]?.cellLetter ?? "";

        allIssues.push({
          x: pt.x,
          y: Number(y),
          cellLetter,
          issueName: pt.name,
          description: pt.description ?? "",
        });
      });
    });
  });

  allIssues.sort((a, b) => {
    const letterCompare = a.cellLetter.localeCompare(b.cellLetter);
    if (letterCompare !== 0) return letterCompare;
    return a.issueName.localeCompare(b.issueName);
  });

  allIssues.forEach((item, index) => {
    const label = chart.renderer
      .text(`${item.cellLetter} · ${item.issueName}`)
      .css({
        fontSize: "10px",
        color: "#000",
      })
      .attr({
        align: "left",
        zIndex: 5,
      })
      .add();

    const meta = {
      x: item.x,
      y: item.y,
      listIndex: index,
      label,
      isCellLabel: true,
      issueName: item.issueName,
      description: item.description,
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
}

function buildLabelsByRow(labels) {
  const issueLabels = labels.filter((item) => item.isCellLabel);
  const quadrantLabels = labels.filter((item) => !item.isCellLabel);

  return {
    issueLabels,
    quadrantLabels,
  };
}

function positionLabels(chart) {
  const grouped = chart.labelsByRow ?? { issueLabels: [], quadrantLabels: [] };
  const issueLabels = grouped.issueLabels ?? [];
  const quadrantLabels = grouped.quadrantLabels ?? [];
  const RIGHT_LABEL_PAD = 8;

  // Keep quadrant labels as-is
  quadrantLabels.forEach(({ x, y, label }) => {
    label.attr({
      x: chart.xAxis[0].toPixels(x),
      y: chart.yAxis[0].toPixels(y),
      align: "center",
    });
  });

  // --- GROUP BY LETTER ---
  const groups = {};
  issueLabels.forEach((item) => {
    const text = item.label.textStr || "";
    const letter = text.split(" · ")[0] || "";

    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  });

  const sortedLetters = Object.keys(groups).sort();

  // --- LAYOUT SETTINGS ---
  const topY = chart.plotTop + 10;
  const RIGHT_X = chart.plotLeft + chart.plotWidth + RIGHT_LABEL_PAD;

  const groupGap = 14;   // space between A/B/C groups
  const itemGap = 10;    // tight spacing within a group

  let currentY = topY;

  sortedLetters.forEach((letter) => {
    const items = groups[letter];

    items.forEach((item, index) => {
      item.label.attr({
        x: RIGHT_X,
        y: currentY,
        align: "left",
      });

      currentY += itemGap;
    });

    // extra spacing after each group
    currentY += groupGap;
  });
}

function bindIssueLabelEvents(chart, label, x, y, issueName, description) {
  if (label.clickBound) return;

  const rectSeries = chart.series[1];
  const stickyBody = stickyNote?.querySelector(".stickyNoteBody");

  label.css({
    color: "#2c2c2c",
    fontSize: "11px",
    textDecoration: "none",
    fontWeight: "500",
  });

  label.element.style.cursor = "help";

  label.element.addEventListener("mouseenter", () => {
    label.css({
      color: "#d22",
      fontWeight: "600",
    });

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

    stickyNote.style.left = "100%";
    stickyNote.style.transform = "translateX(10px)";
    stickyNote.style.top = `${verticalOffset}px`;
    stickyNote.classList.add("show");
  });

  label.element.addEventListener("mouseleave", () => {
    label.css({
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
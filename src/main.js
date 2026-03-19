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

const QUADRANT_COLORS = {
  Discovery: "#d63384",
  Navigate: "#2f80ed",
  Specify: "#c9a400",
  Manage: "#2ca58d",
};

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
  const cellHoverPoints = buildCellHoverPoints(cellGroups);

  log("quadrantGroups", quadrantGroups);

  renderChart({
    jitteredPoints,
    cellHoverPoints,
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

function buildCellHoverPoints(cellGroups) {
  return Object.values(cellGroups).map((group) => ({
    x: group.x,
    y: group.y,
    cellLetter: group.cellLetter,
  }));
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

function renderChart({
  jitteredPoints,
  cellHoverPoints,
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
          chart.labelsByRow = buildLabelsByGroups(chart.customLabels);
          chart.issueLabelsByCell = buildIssueLabelsByCell(chart.customLabels);

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
      enabled: false,
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
        data: cellHoverPoints,
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
              highlightIssueLabelsForCell(this.series.chart, this.x, this.y);
            },
            mouseOut: function () {
              clearPointHighlight(this.series.chart);
              clearIssueLabelHighlight(this.series.chart);
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
  const quadrantOrder = ["Discovery", "Navigate", "Specify", "Manage"];

  const quadrantMap = {
    Q4: "Discovery",
    Q2: "Navigate",
    Q3: "Specify",
    Q1: "Manage",
  };

  const grouped = {
    Discovery: [],
    Navigate: [],
    Specify: [],
    Manage: [],
  };

  Object.entries(quadrantGroups).forEach(([qKey, rows]) => {
    const quadrantName = quadrantMap[qKey];

    Object.values(rows).forEach((pts) => {
      pts.forEach((pt) => {
        const groupKey = `${pt.x}-${pt.y}`;
        const cellLetter = cellGroups[groupKey]?.cellLetter ?? "";

        grouped[quadrantName].push({
          cellLetter,
          issueName: pt.name,
          description: pt.description ?? "",
          x: pt.x,
          y: pt.y,
        });
      });
    });
  });

  quadrantOrder.forEach((q) => {
    grouped[q].sort((a, b) => {
      const letterCompare = a.cellLetter.localeCompare(b.cellLetter);
      if (letterCompare !== 0) return letterCompare;
      return a.issueName.localeCompare(b.issueName);
    });
  });

  quadrantOrder.forEach((quadrantName) => {
    const items = grouped[quadrantName];
    if (!items.length) return;

    const header = chart.renderer
      .text(quadrantName)
      .css({
        fontSize: "12px",
        fontWeight: "bold",
        color: QUADRANT_COLORS[quadrantName],
      })
      .attr({
        align: "left",
        zIndex: 6,
      })
      .add();

    chart.customLabels.push({
      isHeader: true,
      label: header,
      quadrant: quadrantName,
    });

    items.forEach((item) => {
      const prefixLabel = chart.renderer
        .text(`${item.cellLetter} ·`)
        .css({
          fontSize: "11px",
          fontWeight: "500",
          color: QUADRANT_COLORS[quadrantName],
        })
        .attr({
          align: "left",
          zIndex: 5,
        })
        .add();

      const issueLabel = chart.renderer
        .text(item.issueName)
        .css({
          fontSize: "11px",
          fontWeight: "500",
          color: QUADRANT_COLORS[quadrantName],
        })
        .attr({
          align: "left",
          zIndex: 5,
        })
        .add();

      const meta = {
        x: item.x,
        y: item.y,
        cellKey: `${item.x}-${item.y}`,
        prefixLabel,
        label: issueLabel,
        isCellLabel: true,
        quadrant: quadrantName,
        cellLetter: item.cellLetter,
        issueName: item.issueName,
        description: item.description,
      };

      chart.customLabels.push(meta);

      bindIssueLabelEvents(
        chart,
        prefixLabel,
        issueLabel,
        meta.x,
        meta.y,
        meta.issueName,
        meta.description,
        meta.quadrant,
      );
    });
  });
}

function buildLabelsByGroups(labels) {
  return {
    headers: labels.filter((l) => l.isHeader),
    issues: labels.filter((l) => l.isCellLabel),
    quadrants: labels.filter((l) => !l.isHeader && !l.isCellLabel),
  };
}

function buildIssueLabelsByCell(labels) {
  const byCell = {};

  labels
    .filter((item) => item.isCellLabel)
    .forEach((item) => {
      if (!byCell[item.cellKey]) {
        byCell[item.cellKey] = [];
      }
      byCell[item.cellKey].push(item);
    });

  return byCell;
}

function positionLabels(chart) {
  const grouped = chart.labelsByRow ?? {
    headers: [],
    issues: [],
    quadrants: [],
  };

  const headers = grouped.headers ?? [];
  const issues = grouped.issues ?? [];
  const quadrantLabels = grouped.quadrants ?? [];

  const RIGHT_X = chart.plotLeft + chart.plotWidth + 8;
  const ISSUE_TEXT_X = RIGHT_X + 20;

  quadrantLabels.forEach(({ x, y, label }) => {
    label.attr({
      x: chart.xAxis[0].toPixels(x),
      y: chart.yAxis[0].toPixels(y),
      align: "center",
    });
  });

  const quadrantOrder = ["Discovery", "Navigate", "Specify", "Manage"];

  const groupedIssues = {};
  const groupedHeaders = {};

  quadrantOrder.forEach((q) => {
    groupedIssues[q] = [];
  });

  issues.forEach((item) => {
    groupedIssues[item.quadrant].push(item);
  });

  headers.forEach((h) => {
    groupedHeaders[h.quadrant] = h;
  });

  let currentY = chart.plotTop + 10;

  const headerGap = 16;
  const itemGap = 10;
  const groupGap = 14;
  const letterGap = 6;

  quadrantOrder.forEach((q) => {
    const items = groupedIssues[q];
    if (!items.length) return;

    const header = groupedHeaders[q];
    if (header) {
      header.label.attr({
        x: ISSUE_TEXT_X,
        y: currentY,
        align: "left",
      });
      currentY += headerGap;
    }

    const byLetter = {};
    items.forEach((it) => {
      if (!byLetter[it.cellLetter]) byLetter[it.cellLetter] = [];
      byLetter[it.cellLetter].push(it);
    });

    const sortedLetters = Object.keys(byLetter).sort();

    sortedLetters.forEach((letter) => {
      const letterItems = byLetter[letter];

      letterItems.forEach((it) => {
        it.prefixLabel.attr({
          x: RIGHT_X,
          y: currentY,
          align: "left",
        });

        const prefixWidth = it.prefixLabel.getBBox().width;

        it.label.attr({
          x: RIGHT_X + prefixWidth + 4,
          y: currentY,
          align: "left",
        });

        currentY += itemGap;
      });

      currentY += letterGap;
    });

    currentY += groupGap;
  });
}

function setIssueLabelState(meta, state = "normal") {
  const baseColor = QUADRANT_COLORS[meta.quadrant] || "#2c2c2c";

  const styles = {
    normal: {
      color: baseColor,
      fontWeight: "500",
      opacity: 1,
    },
    highlight: {
      color: baseColor,
      fontWeight: "700",
      opacity: 1,
    },
    dim: {
      color: baseColor,
      fontWeight: "400",
      opacity: 0.25,
    },
  };

  const style = styles[state] || styles.normal;

  meta.prefixLabel?.css({
    color: style.color,
    fontSize: "11px",
    fontWeight: style.fontWeight,
    textDecoration: "none",
  });
  if (meta.prefixLabel?.element) {
    meta.prefixLabel.element.style.opacity = String(style.opacity);
  }

  meta.label?.css({
    color: style.color,
    fontSize: "11px",
    fontWeight: style.fontWeight,
    textDecoration: "none",
  });
  if (meta.label?.element) {
    meta.label.element.style.opacity = String(style.opacity);
  }
}

function setQuadrantHeaderState(meta, state = "normal") {
  const baseColor = QUADRANT_COLORS[meta.quadrant] || "#2c2c2c";

  const styles = {
    normal: {
      color: baseColor,
      fontWeight: "700",
      opacity: 1,
    },
    highlight: {
      color: baseColor,
      fontWeight: "800",
      opacity: 1,
    },
    dim: {
      color: baseColor,
      fontWeight: "600",
      opacity: 0.25,
    },
  };

  const style = styles[state] || styles.normal;

  meta.label?.css({
    color: style.color,
    fontSize: "12px",
    fontWeight: style.fontWeight,
    textDecoration: "none",
  });

  if (meta.label?.element) {
    meta.label.element.style.opacity = String(style.opacity);
  }
}

function highlightIssueLabelsForCell(chart, cellX, cellY) {
  const cellKey = `${cellX}-${cellY}`;
  const allIssueLabels =
    chart.customLabels?.filter((item) => item.isCellLabel) ?? [];
  const allHeaders = chart.customLabels?.filter((item) => item.isHeader) ?? [];
  const matching = chart.issueLabelsByCell?.[cellKey] ?? [];
  const matchingKeys = new Set(
    matching.map((m) => `${m.cellKey}::${m.issueName}`),
  );
  const activeQuadrants = new Set(matching.map((m) => m.quadrant));

  allIssueLabels.forEach((meta) => {
    const key = `${meta.cellKey}::${meta.issueName}`;
    setIssueLabelState(meta, matchingKeys.has(key) ? "highlight" : "dim");
  });

  allHeaders.forEach((meta) => {
    setQuadrantHeaderState(
      meta,
      activeQuadrants.has(meta.quadrant) ? "highlight" : "dim",
    );
  });
}

function clearIssueLabelHighlight(chart) {
  const allIssueLabels =
    chart.customLabels?.filter((item) => item.isCellLabel) ?? [];
  const allHeaders = chart.customLabels?.filter((item) => item.isHeader) ?? [];

  allIssueLabels.forEach((meta) => {
    setIssueLabelState(meta, "normal");
  });

  allHeaders.forEach((meta) => {
    setQuadrantHeaderState(meta, "normal");
  });
}

function bindIssueLabelEvents(
  chart,
  prefixLabel,
  issueLabel,
  x,
  y,
  issueName,
  description,
  quadrant,
) {
  if (issueLabel.clickBound) return;

  const rectSeries = chart.series[1];
  const stickyBody = stickyNote?.querySelector(".stickyNoteBody");

  const meta = {
    x,
    y,
    cellKey: `${x}-${y}`,
    prefixLabel,
    label: issueLabel,
    quadrant,
    issueName,
    description,
  };

  setIssueLabelState(meta, "normal");

  [prefixLabel.element, issueLabel.element].forEach((el) => {
    el.style.cursor = "help";

    el.addEventListener("mouseenter", () => {
      setIssueLabelState(meta, "highlight");

      rectSeries.points.forEach((pt) => {
        if (pt.x === x && pt.y === y) {
          pt.setState("hover");
        }
      });

      const labelRect = issueLabel.element.getBoundingClientRect();
      const parentRect =
        issueLabel.element.parentElement?.getBoundingClientRect();
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

    el.addEventListener("mouseleave", () => {
      setIssueLabelState(meta, "normal");

      rectSeries.points.forEach((pt) => {
        if (pt.x === x && pt.y === y) {
          pt.setState("");
        }
      });

      stickyNote?.classList.remove("show");
    });
  });

  issueLabel.clickBound = true;
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

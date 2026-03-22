import {
  CELL_PADDING,
  CELL_SIZE,
  DEFAULT_CELL_MARKER_STYLE,
  LAYOUTS,
  PHRASE_RULES,
  QUADRANT_COLORS,
  QUADRANT_NAME_BY_KEY,
  STOP_WORDS,
} from "./constants.js";

export function buildBasePoints(data) {
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

export function groupData(basePoints) {
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

export function getQuadrant(x, y) {
  if (x >= 0 && x <= 3 && y >= 0 && y <= 3) return "Q1";
  if (x >= 4 && x <= 8 && y >= 0 && y <= 3) return "Q2";
  if (x >= 0 && x <= 3 && y >= 4 && y <= 8) return "Q3";
  if (x >= 4 && x <= 8 && y >= 4 && y <= 8) return "Q4";
  return null;
}

export function getQuadrantNameFromPoint(x, y) {
  const quadrantKey = getQuadrant(x, y);
  return QUADRANT_NAME_BY_KEY[quadrantKey] || null;
}

export function getQuadrantHoverStyle(x, y) {
  const quadrantName = getQuadrantNameFromPoint(x, y);
  const baseColor = QUADRANT_COLORS[quadrantName];

  if (!baseColor) {
    return {
      lineColor: "#666",
      fillColor: "rgba(120, 120, 120, 0.18)",
    };
  }

  return {
    lineColor: baseColor,
    fillColor: hexToRgba(baseColor, 0.18),
  };
}

export function buildJitteredPoints(cellGroups) {
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
            cellKey: `${group.x}-${group.y}`,
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

export function buildCellHoverPoints(cellGroups) {
  return Object.values(cellGroups).map((group) => ({
    x: group.x,
    y: group.y,
    cellLetter: group.cellLetter,
    marker: {
      ...DEFAULT_CELL_MARKER_STYLE,
    },
  }));
}

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

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function placePoint(group, name, col, row, cols, rows) {
  const usableWidth = CELL_SIZE - 2 * CELL_PADDING;
  const usableHeight = CELL_SIZE - 2 * CELL_PADDING;

  return {
    cellKey: `${group.x}-${group.y}`,
    name,
    x: group.x - 0.5 + CELL_PADDING + ((col + 0.5) * usableWidth) / cols,
    y: group.y - 0.5 + CELL_PADDING + ((row + 0.5) * usableHeight) / rows,
  };
}

export const categories = Array.from({ length: 9 }, (_, i) => String(i + 1));

export const CELL_SIZE = 1;
export const CELL_PADDING = 0.1;

export const QUADRANT_COLORS = {
  Discovery: "#d63384",
  Navigate: "#2f80ed",
  Specify: "#c9a400",
  Manage: "#2ca58d",
};

export const QUADRANT_NAME_BY_KEY = {
  Q4: "Discovery",
  Q3: "Specify",
  Q2: "Navigate",
  Q1: "Manage",
};

export const QUADRANT_ORDER = ["Discovery", "Specify", "Navigate", "Manage"];

export const DEFAULT_CELL_MARKER_STYLE = {
  fillColor: "rgba(255,255,255,0.001)",
  lineColor: "transparent",
  lineWidth: 0,
};

export const CHART_LAYOUT = {
  marginRight: 200,
  marginLeft: 160,
  marginTop: 50,
};

export const LABEL_LAYOUT = {
  panelOffsetX: 8,
  issueTextOffsetX: 22,
  headerStartOffsetY: 10,
  headerGap: 16,
  itemGap: 10,
  groupGap: 14,
  letterGap: 6,
  quadrantFontSize: "35px",
  headerFontSize: "12px",
  issueFontSize: "11px",
  issueFontWeight: "500",
  headerFontWeight: "bold",
  quadrantLabelCoords: [
    { name: "Manage", x: 1.5, y: 1.5 },
    { name: "Navigate", x: 6, y: 1.5 },
    { name: "Specify", x: 1.5, y: 6 },
    { name: "Discovery", x: 6, y: 6 },
  ],
};

export const INTERACTION_LAYOUT = {
  stickyNoteHideDelayMs: 90,
  stickyNoteHintOffsetY: 6,
  labelOpacityTransition: "opacity 140ms ease",
};

export const WIDGET_STYLE_DEFAULTS = {
  "--discovery-grid-sticky-note-width": "190px",
  "--discovery-grid-sticky-note-offset-x": "10px",
  "--discovery-grid-sticky-note-enter-offset-y": "4px",
  "--discovery-grid-sticky-note-fade-duration": "140ms",
  "--discovery-grid-sticky-note-move-duration": "180ms",
  "--discovery-grid-sticky-note-hint-fade-duration": "120ms",
  "--discovery-grid-sticky-note-hint-move-duration": "160ms",
  "--discovery-grid-sticky-note-hint-enter-offset-y": "-2px",
};

export const LAYOUTS = {
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

export const STOP_WORDS = new Set([
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

export const PHRASE_RULES = [
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

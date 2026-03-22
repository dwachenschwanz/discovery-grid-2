import {
  DEFAULT_CELL_MARKER_STYLE,
  QUADRANT_COLORS,
} from "./constants.js";
import { getQuadrantHoverStyle } from "./data.js";

export function initializeChartInteractions(chart, options = {}) {
  chart.cellPointsByKey = buildSeriesPointsByCellKey(chart.series[1].points);
  chart.jitteredPointsByCell = buildSeriesPointsByCellKey(chart.series[0].points);
  chart.issueLabelMetaByKey = buildIssueLabelMetaByKey(chart.customLabels);
  chart.activeCellKey = null;
  chart.activeHighlightedCellKey = null;
  chart.activeIssueLabelKey = null;
  chart.hoverSources = {
    grid: null,
    label: null,
  };
  chart.stickyNoteElement = options.stickyNoteElement ?? null;

  initializeIssueLabelInteractions(chart);
}

export function buildIssueLabelsByCell(labels) {
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

export function activateCellHover(chart, cellKey, source = "grid") {
  if (chart.hoverSources) {
    chart.hoverSources[source] = cellKey;
  }

  if (chart.activeCellKey === cellKey) return;

  if (chart.activeCellKey) {
    clearPointHighlight(chart);
    clearIssueLabelHighlight(chart);

    const previousCellPoints = chart.cellPointsByKey?.[chart.activeCellKey] ?? [];
    previousCellPoints.forEach((point) => setCellPointActive(point, false));
  }

  const [cellX, cellY] = cellKey.split("-").map(Number);
  const nextCellPoints = chart.cellPointsByKey?.[cellKey] ?? [];
  nextCellPoints.forEach((point) => setCellPointActive(point, true));

  highlightPointsForCell(chart, cellX, cellY);
  highlightIssueLabelsForCell(chart, cellX, cellY);
  chart.activeCellKey = cellKey;
}

export function deactivateCellHover(chart, cellKey, source = "grid") {
  if (chart.hoverSources?.[source] === cellKey) {
    chart.hoverSources[source] = null;
  }

  const nextCellKey = chart.hoverSources?.label ?? chart.hoverSources?.grid ?? null;
  if (nextCellKey && nextCellKey !== cellKey) {
    activateCellHover(chart, nextCellKey, source);
    return;
  }

  if (nextCellKey === cellKey) return;
  if (chart.activeCellKey !== cellKey) return;

  clearPointHighlight(chart);
  clearIssueLabelHighlight(chart);

  const activeCellPoints = chart.cellPointsByKey?.[cellKey] ?? [];
  activeCellPoints.forEach((point) => setCellPointActive(point, false));
  chart.activeCellKey = null;
}

function buildIssueLabelMetaByKey(labels) {
  const byKey = {};

  labels
    .filter((item) => item.isCellLabel)
    .forEach((item) => {
      byKey[`${item.cellKey}::${item.issueName}`] = item;
    });

  return byKey;
}

function buildSeriesPointsByCellKey(points) {
  const byCell = {};

  points.forEach((point) => {
    const cellKey =
      point.options?.cellKey ?? getPointCellKey(point.x, point.y);

    if (!byCell[cellKey]) {
      byCell[cellKey] = [];
    }

    byCell[cellKey].push(point);
  });

  return byCell;
}

function getPointCellKey(x, y) {
  return `${Math.round(x)}-${Math.round(y)}`;
}

function setIssueLabelState(meta, state = "normal") {
  if (meta.__state === state) return;

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

  meta.label?.css({
    color: style.color,
    fontSize: "11px",
    fontWeight: style.fontWeight,
    textDecoration: "none",
  });
  if (meta.label?.element) {
    meta.label.element.style.opacity = String(style.opacity);
  }

  meta.__state = state;
}

function setQuadrantHeaderState(meta, state = "normal") {
  if (meta.__state === state) return;

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

  meta.__state = state;
}

function highlightIssueLabelsForCell(chart, cellX, cellY) {
  const cellKey = `${cellX}-${cellY}`;
  if (chart.activeHighlightedCellKey === cellKey) return;

  const allIssueLabels = chart.labelCollections?.issues ?? [];
  const allHeaders = chart.labelCollections?.headers ?? [];
  const previousCellKey = chart.activeHighlightedCellKey;
  const matching = chart.issueLabelsByCell?.[cellKey] ?? [];
  const activeQuadrants = new Set(matching.map((m) => m.quadrant));

  if (!previousCellKey) {
    allIssueLabels.forEach((meta) => {
      setIssueLabelState(meta, "dim");
    });
    allHeaders.forEach((meta) => {
      setQuadrantHeaderState(meta, "dim");
    });
  } else {
    const previousMatching = chart.issueLabelsByCell?.[previousCellKey] ?? [];
    previousMatching.forEach((meta) => {
      setIssueLabelState(meta, "dim");
    });

    const previousQuadrants = new Set(previousMatching.map((m) => m.quadrant));
    previousQuadrants.forEach((quadrant) => {
      if (!activeQuadrants.has(quadrant)) {
        const header = chart.labelCollections?.headersByQuadrant?.[quadrant];
        if (header) {
          setQuadrantHeaderState(header, "dim");
        }
      }
    });
  }

  matching.forEach((meta) => {
    setIssueLabelState(meta, "highlight");
  });

  activeQuadrants.forEach((quadrant) => {
    const header = chart.labelCollections?.headersByQuadrant?.[quadrant];
    if (header) {
      setQuadrantHeaderState(header, "highlight");
    }
  });

  chart.activeHighlightedCellKey = cellKey;
}

function clearIssueLabelHighlight(chart) {
  if (!chart.activeHighlightedCellKey) return;

  const allIssueLabels = chart.labelCollections?.issues ?? [];
  const allHeaders = chart.labelCollections?.headers ?? [];

  allIssueLabels.forEach((meta) => {
    setIssueLabelState(meta, "normal");
  });

  allHeaders.forEach((meta) => {
    setQuadrantHeaderState(meta, "normal");
  });

  chart.activeHighlightedCellKey = null;
}

function initializeIssueLabelInteractions(chart) {
  if (chart.__issueLabelInteractionsBound) return;

  chart.__issueLabelInteractionsBound = true;

  chart.container.addEventListener("mouseover", (event) => {
    const issueKey = getIssueKeyFromEventTarget(event.target);
    if (!issueKey) return;

    const previousKey = getIssueKeyFromEventTarget(event.relatedTarget);
    if (previousKey === issueKey) return;

    const meta = chart.issueLabelMetaByKey?.[issueKey];
    if (!meta) return;

    chart.activeIssueLabelKey = issueKey;
    activateCellHover(chart, meta.cellKey, "label");
    setIssueLabelState(meta, "highlight");
    showStickyNoteForIssue(meta);
  });

  chart.container.addEventListener("dblclick", (event) => {
    const issueKey = getIssueKeyFromEventTarget(event.target);
    if (!issueKey) return;

    const meta = chart.issueLabelMetaByKey?.[issueKey];
    if (!meta) return;

    toggleStickyNoteExpansion(meta.chart?.stickyNoteElement ?? null);
  });

  chart.container.addEventListener("mouseout", (event) => {
    const issueKey = getIssueKeyFromEventTarget(event.target);
    if (!issueKey) return;

    const nextKey = getIssueKeyFromEventTarget(event.relatedTarget);
    if (nextKey === issueKey) return;

    const meta = chart.issueLabelMetaByKey?.[issueKey];
    if (!meta) return;

    if (chart.activeIssueLabelKey === issueKey) {
      chart.activeIssueLabelKey = null;
    }

    deactivateCellHover(chart, meta.cellKey, "label");
    resetStickyNoteExpansion(chart.stickyNoteElement);
    chart.stickyNoteElement?.classList.remove("show");
  });
}

function getIssueKeyFromEventTarget(target) {
  if (!(target instanceof Element)) return null;

  const issueElement = target.closest("[data-issue-key]");
  return issueElement?.dataset.issueKey ?? null;
}

function showStickyNoteForIssue(meta) {
  const stickyNoteElement = meta.chart?.stickyNoteElement ?? null;
  if (!stickyNoteElement || !meta.label?.element) return;

  resetStickyNoteExpansion(stickyNoteElement);

  const labelRect = meta.label.element.getBoundingClientRect();
  const parentRect = meta.label.element.parentElement?.getBoundingClientRect();

  if (!parentRect) return;

  const verticalOffset = labelRect.top - parentRect.top;

  stickyNoteElement.setAttribute("title", meta.issueName || "");
  stickyNoteElement.setAttribute("text", meta.description || "");
  stickyNoteElement.style.left = "100%";
  stickyNoteElement.style.transform = "translateY(-50%) translateX(10px)";
  stickyNoteElement.style.top = `${verticalOffset}px`;
  stickyNoteElement.classList.add("show");
}

function toggleStickyNoteExpansion(stickyNoteElement) {
  if (!stickyNoteElement) return;

  const expanded = stickyNoteElement.dataset.expanded === "true";
  if (expanded) {
    resetStickyNoteExpansion(stickyNoteElement);
    return;
  }

  stickyNoteElement.dataset.expanded = "true";
  stickyNoteElement.setAttribute("expanded", "");
}

function resetStickyNoteExpansion(stickyNoteElement) {
  if (!stickyNoteElement) return;

  stickyNoteElement.dataset.expanded = "false";
  stickyNoteElement.removeAttribute("expanded");
}

function highlightPointsForCell(chart, cellX, cellY) {
  const cellKey = `${cellX}-${cellY}`;
  const points = chart.jitteredPointsByCell?.[cellKey] ?? [];
  points.forEach((pt) => pt.setState("hover"));
}

function clearPointHighlight(chart) {
  const activeCellKey = chart.activeCellKey;
  if (!activeCellKey) return;

  const points = chart.jitteredPointsByCell?.[activeCellKey] ?? [];
  points.forEach((pt) => pt.setState(""));
}

function applyCellMarkerStyle(point, markerStyle) {
  if (point.graphic) {
    point.graphic.attr({
      fill: markerStyle.fillColor,
      stroke: markerStyle.lineColor,
      "stroke-width": markerStyle.lineWidth,
    });
    return;
  }

  point.update(
    {
      marker: markerStyle,
    },
    false,
  );
}

function setCellPointActive(point, active) {
  const markerStyle = active
    ? {
        ...DEFAULT_CELL_MARKER_STYLE,
        ...getQuadrantHoverStyle(point.x, point.y),
        lineWidth: 3,
      }
    : DEFAULT_CELL_MARKER_STYLE;

  // Keep the cell square on explicit marker styling only. Using Highcharts'
  // hover state here causes the square to clear as the pointer leaves the grid.
  applyCellMarkerStyle(point, markerStyle);
}

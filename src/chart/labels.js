import {
  LABEL_LAYOUT,
  QUADRANT_COLORS,
  QUADRANT_NAME_BY_KEY,
  QUADRANT_ORDER,
} from "./constants.js";

export function initializeChartLabels(chart, quadrantGroups, cellGroups) {
  chart.customLabels = [];

  addQuadrantLabels(chart);
  addIssueLabels(chart, quadrantGroups, cellGroups);
  chart.labelCollections = buildLabelCollections(chart.customLabels);
}

export function positionLabels(chart) {
  const grouped = chart.labelCollections ?? {
    headers: [],
    issues: [],
    quadrants: [],
    headersByQuadrant: {},
    issuesByQuadrant: {},
    issuesByQuadrantAndLetter: {},
  };

  const quadrantLabels = grouped.quadrants ?? [];

  const rightX = chart.plotLeft + chart.plotWidth + LABEL_LAYOUT.panelOffsetX;
  const issueTextX = rightX + LABEL_LAYOUT.issueTextOffsetX;

  quadrantLabels.forEach(({ x, y, label }) => {
    label.attr({
      x: chart.xAxis[0].toPixels(x),
      y: chart.yAxis[0].toPixels(y),
      align: "center",
    });
  });

  let currentY = chart.plotTop + LABEL_LAYOUT.headerStartOffsetY;

  QUADRANT_ORDER.forEach((q) => {
    const items = grouped.issuesByQuadrant?.[q] ?? [];
    if (!items.length) return;

    const header = grouped.headersByQuadrant?.[q];
    if (header) {
      header.label.attr({
        x: issueTextX,
        y: currentY,
        align: "left",
      });
      currentY += LABEL_LAYOUT.headerGap;
    }

    const byLetter = grouped.issuesByQuadrantAndLetter?.[q] ?? {};
    const sortedLetters = Object.keys(byLetter).sort();

    sortedLetters.forEach((letter) => {
      const letterItems = byLetter[letter];

      letterItems.forEach((it) => {
        it.label.attr({
          x: rightX,
          y: currentY,
          align: "left",
        });

        currentY += LABEL_LAYOUT.itemGap;
      });

      currentY += LABEL_LAYOUT.letterGap;
    });

    currentY += LABEL_LAYOUT.groupGap;
  });
}

function addQuadrantLabels(chart) {
  LABEL_LAYOUT.quadrantLabelCoords.forEach((q) => {
    const label = chart.renderer
      .text(q.name, 0, 0)
      .css({
        color: "#aaa",
        fontSize: LABEL_LAYOUT.quadrantFontSize,
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
  const grouped = {
    Discovery: [],
    Navigate: [],
    Specify: [],
    Manage: [],
  };

  Object.entries(quadrantGroups).forEach(([qKey, rows]) => {
    const quadrantName = QUADRANT_NAME_BY_KEY[qKey];

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

  QUADRANT_ORDER.forEach((q) => {
    grouped[q].sort((a, b) => {
      const letterCompare = a.cellLetter.localeCompare(b.cellLetter);
      if (letterCompare !== 0) return letterCompare;
      return a.issueName.localeCompare(b.issueName);
    });
  });

  QUADRANT_ORDER.forEach((quadrantName) => {
    const items = grouped[quadrantName];
    if (!items.length) return;

    const header = chart.renderer
      .text(quadrantName)
      .css({
        fontSize: LABEL_LAYOUT.headerFontSize,
        fontWeight: LABEL_LAYOUT.headerFontWeight,
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
      const issueLabel = chart.renderer
        .text(`${item.cellLetter} · ${item.issueName}`)
        .css({
          fontSize: LABEL_LAYOUT.issueFontSize,
          fontWeight: LABEL_LAYOUT.issueFontWeight,
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
        chart,
        label: issueLabel,
        isCellLabel: true,
        quadrant: quadrantName,
        cellLetter: item.cellLetter,
        issueName: item.issueName,
        description: item.description,
      };

      chart.customLabels.push(meta);

      const issueKey = `${meta.cellKey}::${meta.issueName}`;
      meta.issueKey = issueKey;

      issueLabel.element.dataset.issueKey = issueKey;
    });
  });
}

export function buildLabelsByGroups(labels) {
  return {
    headers: labels.filter((l) => l.isHeader),
    issues: labels.filter((l) => l.isCellLabel),
    quadrants: labels.filter((l) => !l.isHeader && !l.isCellLabel),
  };
}

export function buildLabelCollections(labels) {
  const grouped = buildLabelsByGroups(labels);
  const headersByQuadrant = {};
  const issuesByQuadrant = Object.fromEntries(
    QUADRANT_ORDER.map((quadrant) => [quadrant, []]),
  );
  const issuesByQuadrantAndLetter = Object.fromEntries(
    QUADRANT_ORDER.map((quadrant) => [quadrant, {}]),
  );

  grouped.headers.forEach((header) => {
    headersByQuadrant[header.quadrant] = header;
  });

  grouped.issues.forEach((issue) => {
    issuesByQuadrant[issue.quadrant].push(issue);

    const byLetter = issuesByQuadrantAndLetter[issue.quadrant];
    if (!byLetter[issue.cellLetter]) {
      byLetter[issue.cellLetter] = [];
    }
    byLetter[issue.cellLetter].push(issue);
  });

  return {
    ...grouped,
    headersByQuadrant,
    issuesByQuadrant,
    issuesByQuadrantAndLetter,
  };
}

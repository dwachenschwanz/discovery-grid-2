import test from "node:test";
import assert from "node:assert/strict";

import {
  buildBasePoints,
  buildCellHoverPoints,
  buildJitteredPoints,
  getQuadrant,
  getQuadrantHoverStyle,
  getQuadrantNameFromPoint,
  groupData,
} from "./data.js";

test("buildBasePoints filters invalid rows and derives names", () => {
  const points = buildBasePoints([
    {
      Impact: "9",
      Ignorance: "8",
      Description: "Single energy provider creates issues",
      "Issue Name": "Ignored explicit issue name",
    },
    {
      Impact: "0",
      Ignorance: "8",
      Description: "Should be filtered out",
      "Issue Name": "Filtered row",
    },
    {
      Impact: "3",
      Ignorance: "4",
      Description: "",
      "Issue Name": "Fallback Name",
    },
    {
      Impact: "2",
      Ignorance: "2",
      Description: "The customer is looking for very large billing confusion",
    },
  ]);

  assert.equal(points.length, 3);
  assert.deepEqual(points[0], {
    x: 8,
    y: 7,
    name: "Sole Provider",
    description: "Single energy provider creates issues",
  });
  assert.equal(points[1].name, "Fallback Name");
  assert.equal(points[2].name, "Billing Confusion");
});

test("groupData assigns cells, quadrants, and stable cell letters", () => {
  const basePoints = [
    { x: 8, y: 8, name: "Discovery issue", description: "A" },
    { x: 8, y: 8, name: "Discovery issue 2", description: "B" },
    { x: 1, y: 1, name: "Manage issue", description: "C" },
    { x: 5, y: 2, name: "Navigate issue", description: "D" },
  ];

  const { cellGroups, quadrantGroups } = groupData(basePoints);

  assert.deepEqual(Object.keys(cellGroups).sort(), ["1-1", "5-2", "8-8"]);
  assert.equal(cellGroups["8-8"].cellLetter, "A");
  assert.equal(cellGroups["5-2"].cellLetter, "B");
  assert.equal(cellGroups["1-1"].cellLetter, "C");

  assert.equal(quadrantGroups.Q4[8].length, 2);
  assert.equal(quadrantGroups.Q2[2][0].name, "Navigate issue");
  assert.equal(quadrantGroups.Q1[1][0].name, "Manage issue");
});

test("quadrant helpers return expected names and hover colors", () => {
  assert.equal(getQuadrant(0, 0), "Q1");
  assert.equal(getQuadrant(8, 0), "Q2");
  assert.equal(getQuadrant(0, 8), "Q3");
  assert.equal(getQuadrant(8, 8), "Q4");
  assert.equal(getQuadrant(9, 9), null);

  assert.equal(getQuadrantNameFromPoint(8, 8), "Discovery");
  assert.deepEqual(getQuadrantHoverStyle(8, 8), {
    lineColor: "#d63384",
    fillColor: "rgba(214, 51, 132, 0.18)",
  });
  assert.deepEqual(getQuadrantHoverStyle(20, 20), {
    lineColor: "#666",
    fillColor: "rgba(120, 120, 120, 0.18)",
  });
});

test("buildJitteredPoints and buildCellHoverPoints preserve cell metadata", () => {
  const cellGroups = {
    "4-4": {
      x: 4,
      y: 4,
      cellLetter: "A",
      items: [
        { name: "Alpha" },
        { name: "Beta" },
      ],
    },
    "1-1": {
      x: 1,
      y: 1,
      cellLetter: "B",
      items: [{ name: "Solo" }],
    },
  };

  const jitteredPoints = buildJitteredPoints(cellGroups);
  const hoverPoints = buildCellHoverPoints(cellGroups);

  assert.equal(jitteredPoints.length, 3);
  assert.ok(jitteredPoints.every((point) => point.cellKey));
  assert.ok(
    jitteredPoints.some(
      (point) =>
        point.name === "Solo" &&
        point.cellKey === "1-1" &&
        point.x === 1 &&
        point.y === 1,
    ),
  );

  assert.deepEqual(hoverPoints, [
    {
      x: 4,
      y: 4,
      cellLetter: "A",
      marker: {
        fillColor: "rgba(255,255,255,0.001)",
        lineColor: "transparent",
        lineWidth: 0,
      },
    },
    {
      x: 1,
      y: 1,
      cellLetter: "B",
      marker: {
        fillColor: "rgba(255,255,255,0.001)",
        lineColor: "transparent",
        lineWidth: 0,
      },
    },
  ]);
});

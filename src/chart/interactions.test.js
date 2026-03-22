import test from "node:test";
import assert from "node:assert/strict";

import { activateCellHover, deactivateCellHover } from "./interactions.js";

function createCellPoint(x, y) {
  const graphicCalls = [];

  return {
    x,
    y,
    graphic: {
      attr(payload) {
        graphicCalls.push(payload);
      },
    },
    setStateCalls: [],
    setState(state) {
      this.setStateCalls.push(state);
    },
    get graphicCalls() {
      return graphicCalls;
    },
  };
}

function createIssuePoint() {
  return {
    setStateCalls: [],
    setState(state) {
      this.setStateCalls.push(state);
    },
  };
}

function createChart() {
  const cellPoint = createCellPoint(4, 4);
  const issuePoint = createIssuePoint();

  return {
    activeCellKey: null,
    activeHighlightedCellKey: null,
    hoverSources: {
      grid: null,
      label: null,
    },
    cellPointsByKey: {
      "4-4": [cellPoint],
    },
    jitteredPointsByCell: {
      "4-4": [issuePoint],
    },
    issueLabelsByCell: {},
    labelCollections: {
      issues: [],
      headers: [],
      headersByQuadrant: {},
    },
    __mocks: {
      cellPoint,
      issuePoint,
    },
  };
}

test("label hover keeps the grid cell highlighted without using point hover state", () => {
  const chart = createChart();

  activateCellHover(chart, "4-4", "label");

  assert.equal(chart.activeCellKey, "4-4");
  assert.equal(chart.__mocks.cellPoint.graphicCalls.length, 1);
  assert.deepEqual(chart.__mocks.cellPoint.graphicCalls[0], {
    fill: "rgba(214, 51, 132, 0.18)",
    stroke: "#d63384",
    "stroke-width": 3,
  });
  assert.deepEqual(chart.__mocks.cellPoint.setStateCalls, []);
  assert.deepEqual(chart.__mocks.issuePoint.setStateCalls, ["hover"]);

  deactivateCellHover(chart, "4-4", "grid");

  assert.equal(chart.activeCellKey, "4-4");
  assert.equal(chart.hoverSources.label, "4-4");
  assert.equal(chart.hoverSources.grid, null);
  assert.equal(chart.__mocks.cellPoint.graphicCalls.length, 1);

  deactivateCellHover(chart, "4-4", "label");

  assert.equal(chart.activeCellKey, null);
  assert.deepEqual(chart.__mocks.cellPoint.graphicCalls[1], {
    fill: "rgba(255,255,255,0.001)",
    stroke: "transparent",
    "stroke-width": 0,
  });
  assert.deepEqual(chart.__mocks.issuePoint.setStateCalls, ["hover", ""]);
});

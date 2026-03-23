import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLabelCollections,
  buildLabelsByGroups,
  positionLabels,
} from "./labels.js";

function createLabel() {
  return {
    calls: [],
    attr(payload) {
      this.calls.push(payload);
    },
  };
}

test("buildLabelsByGroups separates headers, issues, and quadrant labels", () => {
  const labels = [
    { isHeader: true, quadrant: "Discovery", label: createLabel() },
    { isCellLabel: true, quadrant: "Discovery", label: createLabel() },
    { x: 6, y: 6, label: createLabel() },
  ];

  const grouped = buildLabelsByGroups(labels);

  assert.equal(grouped.headers.length, 1);
  assert.equal(grouped.issues.length, 1);
  assert.equal(grouped.quadrants.length, 1);
});

test("buildLabelCollections indexes headers and issues by quadrant and letter", () => {
  const discoveryHeader = {
    isHeader: true,
    quadrant: "Discovery",
    label: createLabel(),
  };
  const manageHeader = {
    isHeader: true,
    quadrant: "Manage",
    label: createLabel(),
  };
  const labels = [
    discoveryHeader,
    manageHeader,
    {
      isCellLabel: true,
      quadrant: "Discovery",
      cellLetter: "A",
      issueName: "Alpha",
      label: createLabel(),
    },
    {
      isCellLabel: true,
      quadrant: "Discovery",
      cellLetter: "A",
      issueName: "Beta",
      label: createLabel(),
    },
    {
      isCellLabel: true,
      quadrant: "Manage",
      cellLetter: "C",
      issueName: "Gamma",
      label: createLabel(),
    },
    { x: 1.5, y: 1.5, label: createLabel() },
  ];

  const collections = buildLabelCollections(labels);

  assert.equal(collections.headersByQuadrant.Discovery, discoveryHeader);
  assert.equal(collections.headersByQuadrant.Manage, manageHeader);
  assert.equal(collections.issuesByQuadrant.Discovery.length, 2);
  assert.equal(collections.issuesByQuadrant.Manage.length, 1);
  assert.deepEqual(
    collections.issuesByQuadrantAndLetter.Discovery.A.map((item) => item.issueName),
    ["Alpha", "Beta"],
  );
  assert.equal(collections.quadrants.length, 1);
});

test("positionLabels places quadrant labels, headers, and issue rows predictably", () => {
  const quadrantLabel = { x: 6, y: 6, label: createLabel() };
  const discoveryHeader = {
    isHeader: true,
    quadrant: "Discovery",
    label: createLabel(),
  };
  const discoveryIssueA = {
    isCellLabel: true,
    quadrant: "Discovery",
    cellLetter: "A",
    issueName: "Alpha",
    label: createLabel(),
  };
  const discoveryIssueB = {
    isCellLabel: true,
    quadrant: "Discovery",
    cellLetter: "A",
    issueName: "Beta",
    label: createLabel(),
  };
  const manageHeader = {
    isHeader: true,
    quadrant: "Manage",
    label: createLabel(),
  };
  const manageIssue = {
    isCellLabel: true,
    quadrant: "Manage",
    cellLetter: "C",
    issueName: "Gamma",
    label: createLabel(),
  };

  const labelCollections = buildLabelCollections([
    quadrantLabel,
    discoveryHeader,
    discoveryIssueA,
    discoveryIssueB,
    manageHeader,
    manageIssue,
  ]);

  const chart = {
    plotLeft: 100,
    plotWidth: 300,
    plotTop: 50,
    xAxis: [{ toPixels: (value) => value * 10 }],
    yAxis: [{ toPixels: (value) => value * 20 }],
    labelCollections,
  };

  positionLabels(chart);

  assert.deepEqual(quadrantLabel.label.calls[0], {
    x: 60,
    y: 120,
    align: "center",
  });

  assert.deepEqual(discoveryHeader.label.calls[0], {
    x: 430,
    y: 60,
    align: "left",
  });
  assert.deepEqual(discoveryIssueA.label.calls[0], {
    x: 408,
    y: 76,
    align: "left",
  });
  assert.deepEqual(discoveryIssueB.label.calls[0], {
    x: 408,
    y: 86,
    align: "left",
  });
  assert.deepEqual(manageHeader.label.calls[0], {
    x: 430,
    y: 116,
    align: "left",
  });
  assert.deepEqual(manageIssue.label.calls[0], {
    x: 408,
    y: 132,
    align: "left",
  });
});

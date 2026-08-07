import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filterByLabel, paginate, scoreIssue, sortByPriority, topPriority } from '../src/domain.mjs';
const fixtures = [
  {
    id: 'critical-bug',
    title: 'Critical bug with lots of discussion',
    labels: ['bug', 'critical'],
    reactions: 5,
    comments: 4,
    createdAt: '2026-06-01T00:00:00.000Z'
  },
  {
    id: 'docs',
    title: 'Documentation typo',
    labels: ['documentation'],
    reactions: 1,
    comments: 1,
    createdAt: '2026-06-15T00:00:00.000Z'
  },
  {
    id: 'security',
    title: 'Security regression',
    labels: ['security', 'regression'],
    reactions: 8,
    comments: 2,
    createdAt: '2026-06-10T00:00:00.000Z'
  },
  {
    id: 'stale-help',
    title: 'Older help wanted item',
    labels: ['help wanted'],
    reactions: 0,
    comments: 1,
    createdAt: '2026-04-01T00:00:00.000Z'
  }
];

describe('scoreIssue', () => {
  it('combines label weights, reactions, comments, and capped age deterministically', () => {
    assert.equal(scoreIssue(fixtures[0]), 137);
  });

  it('treats missing optional fields as zero contribution', () => {
    assert.equal(scoreIssue({ id: 'blank', labels: [], createdAt: 'not-a-date' }), 0);
  });

  it('weights urgent labels above low-priority labels', () => {
    assert.ok(scoreIssue(fixtures[0]) > scoreIssue(fixtures[1]));
  });
});

describe('sortByPriority', () => {
  it('returns a new array sorted by descending priority score', () => {
    const sorted = sortByPriority(fixtures);

    assert.notEqual(sorted, fixtures);
    assert.deepEqual(
      sorted.map((issue) => issue.id),
      ['critical-bug', 'security', 'stale-help', 'docs'],
      'issues should be ordered from highest score to lowest score'
    );
  });

  it('does not mutate the input array', () => {
    const originalOrder = fixtures.map((issue) => issue.id);

    sortByPriority(fixtures);

    assert.deepEqual(fixtures.map((issue) => issue.id), originalOrder);
  });
});

describe('filterByLabel', () => {
  it('returns issues matching a label case-insensitively', () => {
    assert.deepEqual(
      filterByLabel(fixtures, 'BUG').map((issue) => issue.id),
      ['critical-bug']
    );
  });

  it('returns a new copy for an empty label', () => {
    const result = filterByLabel(fixtures, '');

    assert.deepEqual(result, fixtures);
    assert.notEqual(result, fixtures);
  });

  it('returns an empty array when no issues match', () => {
    assert.deepEqual(filterByLabel(fixtures, 'question'), []);
  });
});

describe('paginate', () => {
  it('returns the requested 1-based page', () => {
    assert.deepEqual(paginate(['a', 'b', 'c', 'd', 'e'], 2, 2), ['c', 'd']);
  });

  it('returns an empty array for pages beyond the end', () => {
    assert.deepEqual(paginate(['a', 'b'], 3, 2), []);
  });

  it('normalizes invalid page and perPage values', () => {
    assert.deepEqual(paginate(['a', 'b', 'c'], 0, 0), ['a']);
  });
});

describe('topPriority', () => {
  it('returns the highest scoring issues first', () => {
    assert.deepEqual(
      topPriority(fixtures, 2).map((issue) => issue.id),
      ['critical-bug', 'security'],
      'topPriority should list issues from highest score to lowest score'
    );
  });
});
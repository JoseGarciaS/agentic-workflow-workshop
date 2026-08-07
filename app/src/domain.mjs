const LABEL_WEIGHTS = new Map([
  ['critical', 60],
  ['security', 55],
  ['bug', 40],
  ['regression', 35],
  ['help wanted', 20],
  ['documentation', 10],
  ['enhancement', 8],
  ['good first issue', 3]
]);

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SCORING_NOW = Date.parse('2026-06-16T00:00:00.000Z');

function normalizeLabel(label) {
  return String(label ?? '').trim().toLowerCase();
}

function issueAgeInDays(createdAt) {
  const createdTime = Date.parse(createdAt);
  if (Number.isNaN(createdTime)) {
    return 0;
  }

  return Math.max(0, Math.floor((SCORING_NOW - createdTime) / MS_PER_DAY));
}

/**
 * Score = weighted labels + reaction signal + discussion signal + capped age signal.
 * The fixed reference date keeps workshop tests deterministic while still modeling stale issues.
 */
export function scoreIssue(issue) {
  const labels = Array.isArray(issue?.labels) ? issue.labels : [];
  const labelScore = labels.reduce(
    (total, label) => total + (LABEL_WEIGHTS.get(normalizeLabel(label)) ?? 0),
    0
  );
  const reactions = Math.max(0, Number(issue?.reactions) || 0);
  const comments = Math.max(0, Number(issue?.comments) || 0);
  const ageDays = issueAgeInDays(issue?.createdAt);

  return labelScore + reactions * 2 + comments * 3 + Math.min(ageDays, 60);
}

export function sortByPriority(issues) {
  return [...issues]
    .map((issue) => ({ issue, score: scoreIssue(issue) }))
    .sort((a, b) => b.score - a.score)
    .map(({ issue }) => issue);
}

export function filterByLabel(issues, label) {
  const target = normalizeLabel(label);
  if (!target) {
    return [...issues];
  }

  return issues.filter((issue) =>
    (Array.isArray(issue.labels) ? issue.labels : []).some(
      (issueLabel) => normalizeLabel(issueLabel) === target
    )
  );
}

export function paginate(items, page, perPage) {
  const parsedPage = Math.trunc(Number(page));
  const parsedPerPage = Math.trunc(Number(perPage));
  const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safePerPage = Number.isFinite(parsedPerPage) && parsedPerPage > 0 ? parsedPerPage : 1;
  const start = (safePage - 1) * safePerPage;

  return items.slice(start, start + safePerPage);
}

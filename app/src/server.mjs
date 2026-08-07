import express from 'express';
import { issues } from './data.mjs';
import { filterByLabel, paginate, sortByPriority } from './domain.mjs';

export const app = express();

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/issues', (request, response) => {
  const { label, page = '1', perPage = '10' } = request.query;
  const filteredIssues = label ? filterByLabel(issues, label) : [...issues];
  const prioritizedIssues = sortByPriority(filteredIssues);

  response.json({
    issues: paginate(prioritizedIssues, page, perPage),
    page: Math.max(1, Math.trunc(Number(page) || 1)),
    perPage: Math.max(1, Math.trunc(Number(perPage) || 10)),
    total: prioritizedIssues.length
  });
});

app.get('/api/issues/:id', (request, response) => {
  const issue = issues.find((item) => item.id === Number(request.params.id));

  if (!issue) {
    response.status(404).json({ error: 'Issue not found' });
    return;
  }

  response.json(issue);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Mona's Issue Triage API listening on port ${port}`);
  });
}

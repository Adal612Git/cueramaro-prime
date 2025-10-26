import { promises as fs } from 'fs';

const axeResults: Array<{ scenario: string; violations: number; details: unknown }> = [];

export async function recordAxeResult(scenario: string, results: unknown) {
  axeResults.push({
    scenario,
    violations: (results as any).violations?.length ?? 0,
    details: results,
  });
  await fs.mkdir('docs/audit', { recursive: true });
  await fs.writeFile('docs/audit/axe.json', JSON.stringify(axeResults, null, 2), 'utf-8');
}

export async function writeLighthouseReport(html: string, json: string) {
  await fs.mkdir('docs/audit', { recursive: true });
  await fs.writeFile('docs/audit/lighthouse.html', html, 'utf-8');
  await fs.writeFile('docs/audit/lighthouse.json', json, 'utf-8');
}

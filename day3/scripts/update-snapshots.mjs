import { writeFile } from 'node:fs/promises';
import { API, OFFICES, validateFeed, racesFromFeed } from '../model.js';

// Explicit maintenance command. Browser updates never write source files.
// Validate all three responses before replacing any saved snapshot.
const snapshots = await Promise.all(Object.entries(OFFICES).map(async ([key, config]) => {
  const source = API + config.id;
  const response = await fetch(source, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${key}: HTTP ${response.status}; snapshots preserved.`);
  const data = validateFeed(await response.json(), key);
  if (racesFromFeed(data,key).length !== config.expected) throw new Error(`${key}: unexpected race coverage; snapshots preserved.`);
  return [key, { source, fetchedAt: new Date().toISOString(), data }];
}));
for (const [key, snapshot] of snapshots) await writeFile(new URL(`../data/${key}.json`, import.meta.url), JSON.stringify(snapshot) + '\n');
console.log('Updated all three verified November 3, 2026 snapshots.');

export const ELECTION_DATE = '2026-11-03';
export const API = 'https://civicapi.org/api/v2/race/';
export const OFFICES = {
  senate: { id: 87528, type: 'US Senate', label: 'Senate', title: 'The race for the Senate', expected: 35 },
  house: { id: 87524, type: 'House of Representatives', label: 'House', title: 'The race for the House', expected: 435 },
  governor: { id: 87535, type: 'Governor', label: 'Governor', title: 'The races for governor', expected: 36 }
};
export const COLORS = { DEM: '#438df2', GOP: '#ed5b62', OTHER: '#d1aa63', TIE: '#a88adb', WAIT: '#52627a', NONE: '#202d3d', ERROR: '#39414c' };
export const STATES = Object.fromEntries('AL:Alabama|AK:Alaska|AZ:Arizona|AR:Arkansas|CA:California|CO:Colorado|CT:Connecticut|DE:Delaware|FL:Florida|GA:Georgia|HI:Hawaii|ID:Idaho|IL:Illinois|IN:Indiana|IA:Iowa|KS:Kansas|KY:Kentucky|LA:Louisiana|ME:Maine|MD:Maryland|MA:Massachusetts|MI:Michigan|MN:Minnesota|MS:Mississippi|MO:Missouri|MT:Montana|NE:Nebraska|NV:Nevada|NH:New Hampshire|NJ:New Jersey|NM:New Mexico|NY:New York|NC:North Carolina|ND:North Dakota|OH:Ohio|OK:Oklahoma|OR:Oregon|PA:Pennsylvania|RI:Rhode Island|SC:South Carolina|SD:South Dakota|TN:Tennessee|TX:Texas|UT:Utah|VT:Vermont|VA:Virginia|WA:Washington|WV:West Virginia|WI:Wisconsin|WY:Wyoming'.split('|').map(s => s.split(':')));
export const number = v => Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : 0;
export const party = value => /^democrat(ic)?(?:$|[ -])/i.test(value || '') ? 'DEM' : /^republican(?:$|[ -])/i.test(value || '') ? 'GOP' : 'OTHER';
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Census uses 00 for at-large seats; CivicAPI uses the suffix "al".
export function districtRaceKey(attributes) {
  const state = String(attributes.STATE_ABBR || '').toUpperCase();
  const district = String(attributes.CDFIPS ?? '').trim();
  if (!Object.hasOwn(STATES, state) || !/^\d{1,2}$/.test(district) || Number(district) > 52) return null;
  return `${state.toLowerCase()}-${Number(district) === 0 ? 'al' : district.padStart(2, '0')}`;
}

export function validateFeed(data, office) {
  if (!data || data.error || data.country !== 'US' || data.province !== 'US' || data.election_type !== OFFICES[office].type || data.election_date?.slice(0, 10) !== ELECTION_DATE || data.test_data !== false || !data.region_results || Array.isArray(data.region_results) || !Object.keys(data.region_results).length) {
    throw new Error('The provider returned an invalid, test, or different-election feed.');
  }
  const rows = Object.entries(data.region_results);
  if (rows.some(([key, r]) => !r || !STATES[key.slice(0, 2).toUpperCase()] || !Array.isArray(r.candidates) || !Number.isSafeInteger(Number(r.election_id)) || Number(r.election_id) <= 0 || r.candidates.some(c => !c || typeof c.name !== 'string' || typeof c.party !== 'string' || !['number','string'].includes(typeof c.votes) || !Number.isFinite(Number(c.votes)) || Number(c.votes) < 0 || typeof c.winner !== 'boolean'))) throw new Error('Unrecognized race geography or candidate schema.');
  return data;
}

export function raceStatus(candidates) {
  const sorted = [...candidates].sort((a, b) => number(b.votes) - number(a.votes));
  const total = sorted.reduce((s, c) => s + number(c.votes), 0);
  const winners = sorted.filter(c => c.winner === true);
  const winner = winners.length === 1 ? winners[0] : null;
  const tied = total > 0 && sorted.length > 1 && number(sorted[0].votes) === number(sorted[1].votes);
  const leader = total > 0 && !tied ? sorted[0] : null;
  const margin = total > 0 && sorted.length > 1 ? (number(sorted[0].votes) - number(sorted[1].votes)) / total * 100 : null;
  return { sorted, total, winner, leader, margin, close: !winner && margin !== null && margin <= 5, color: total === 0 ? 'WAIT' : tied ? 'TIE' : party(leader?.party) };
}

export function racesFromFeed(data, office) {
  if (!data) return [];
  return Object.entries(data.region_results).map(([key, region]) => {
    const state = key.slice(0, 2).toUpperCase();
    const special = [87068, 87527].includes(Number(region.election_id));
    return { key, state, office, id: Number(region.election_id), name: office === 'house' ? key.toUpperCase() + ' · US House' : STATES[state] + ' · ' + OFFICES[office].label + (special ? ' · Special' : ''), regionName: region.name, reporting: region.percent_reporting == null ? null : Math.min(100, number(region.percent_reporting)), candidates: region.candidates, ...raceStatus(region.candidates) };
  }).sort((a, b) => STATES[a.state].localeCompare(STATES[b.state]) || a.key.localeCompare(b.key, undefined, { numeric: true }));
}

export function stateSummary(races, office) {
  if (!races.length) return { color: 'NONE', text: 'No contest in this feed', total: 0 };
  if (races.length === 1) {
    const r = races[0];
    const text = r.color === 'WAIT' ? 'Awaiting results' : r.color === 'TIE' ? 'Tied' : `${r.leader.name} leads (${r.leader.party})`;
    return { color: r.color, text, total: r.total };
  }
  const totals = new Map();
  races.forEach(r => r.candidates.forEach(c => { const p = String(c.party || 'Other'); totals.set(p, (totals.get(p) || 0) + number(c.votes)); }));
  const sorted = [...totals].sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, p) => s + p[1], 0);
  const tied = total > 0 && sorted.length > 1 && sorted[0][1] === sorted[1][1];
  return { color: !total ? 'WAIT' : tied ? 'TIE' : party(sorted[0][0]), text: !total ? 'Awaiting results' : tied ? 'Tied aggregate vote' : `${sorted[0][0]} leads aggregate vote`, total };
}

export function filterRaces(races, { state = '', district = '', search = '', filter = 'all' } = {}) {
  const q = search.trim().toLowerCase();
  return races.filter(r => (!state || r.state === state) && (!district || r.key === district) && (!q || [STATES[r.state], r.state, r.name, r.regionName, ...r.candidates.map(c => c.name)].join(' ').toLowerCase().includes(q)) && (filter === 'all' || filter === 'close' && r.close || filter === 'called' && r.winner || filter === 'uncalled' && !r.winner));
}

export function callCounts(races) {
  const counts = { DEM: 0, GOP: 0, OTHER: 0, uncalled: 0 };
  races.forEach(r => counts[r.winner ? party(r.winner.party) : 'uncalled']++);
  return counts;
}

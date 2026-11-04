import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { OFFICES, validateFeed, racesFromFeed, raceStatus, stateSummary, filterRaces, callCounts, districtRaceKey, DISTRICT_LAYER_URL, party, escapeHTML } from '../model.js';

const candidate = (name, p, votes, winner = false) => ({ name, party: p, votes, winner });
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS: ' + name); }
const snapshots = {};
for (const key of Object.keys(OFFICES)) {
  const snapshot = JSON.parse(await readFile(new URL(`../data/${key}.json`, import.meta.url), 'utf8'));
  snapshots[key] = snapshot.data;
  check(`${key} snapshot date, identity, provenance and coverage`, () => {
    validateFeed(snapshot.data, key);
    assert.equal(snapshot.source, `https://civicapi.org/api/v2/race/${OFFICES[key].id}`);
    assert(Number.isFinite(Date.parse(snapshot.fetchedAt)));
    assert.equal(racesFromFeed(snapshot.data, key).length, OFFICES[key].expected);
  });
}
check('zero returns do not create a lead, call, close race, or vote percentage', () => {
  const r = raceStatus([candidate('A','Democratic',0),candidate('B','Republican',0)]);
  assert.equal(r.color,'WAIT'); assert.equal(r.leader,null); assert.equal(r.winner,null); assert.equal(r.margin,null); assert.equal(r.close,false);
});
check('Republican color ignores arbitrary provider colors', () => {
  const r = raceStatus([candidate('A','Republican','60'),candidate('B','Democratic',40)]);
  assert.equal(r.color,'GOP'); assert.equal(r.winner,null); assert.equal(r.margin,20);
});
check('ties have no leader and other parties retain their own identity', () => {
  assert.equal(raceStatus([candidate('A','Republican',50),candidate('B','Democratic',50)]).color,'TIE');
  assert.equal(raceStatus([candidate('A','Independent',70),candidate('B','Democratic',30)]).color,'OTHER');
  assert.equal(party('Independent'),'OTHER'); assert.equal(party('Democratic-Farmer-Labor'),'DEM');
});
check('close races exclude called and one-candidate races', () => {
  assert(raceStatus([candidate('A','Democratic',51),candidate('B','Republican',49)]).close);
  assert(!raceStatus([candidate('A','Democratic',51,true),candidate('B','Republican',49)]).close);
  assert(!raceStatus([candidate('A','Democratic',100)]).close);
});
check('only explicit true winner flags count as calls', () => {
  const a = raceStatus([candidate('A','Democratic',80),candidate('B','Republican',20)]);
  const b = raceStatus([candidate('A','Republican',80,true),candidate('B','Democratic',20)]);
  const c = raceStatus([candidate('A','Independent',80,true),candidate('B','Democratic',20)]);
  assert.deepEqual(callCounts([a,b,c]), {DEM:0,GOP:1,OTHER:1,uncalled:1});
  assert.equal(raceStatus([{...candidate('A','Republican',80),winner:'false'}]).winner,null);
});
check('one statewide race uses candidate leadership, not combined same-party candidates', () => {
  const candidates = [candidate('D','Democratic',40),candidate('R1','Republican',35),candidate('R2','Republican',25)];
  const r = {...raceStatus(candidates), candidates};
  assert.equal(stateSummary([r],'senate').color,'DEM');
});
check('House districts retain individual candidate colors and separate calls', () => {
  const candidates1=[candidate('D','Democratic',55,true),candidate('R','Republican',45)];
  const candidates2=[candidate('D2','Democratic',10),candidate('R2','Republican',90,true)];
  const r=[candidates1,candidates2].map(candidates=>({...raceStatus(candidates),candidates}));
  assert.equal(r[0].color,'DEM'); assert.equal(r[1].color,'GOP');
  assert.equal(callCounts(r).DEM,1); assert.equal(callCounts(r).GOP,1);
  assert.equal(stateSummary([],'senate').color,'NONE');
});
check('state, candidate, district and race-status filters compose', () => {
  const house=racesFromFeed(snapshots.house,'house');
  assert.equal(filterRaces(house,{state:'CA'}).length,52);
  assert.equal(filterRaces(house,{search:'CA-23'}).length,1);
  assert(filterRaces(house,{search:'Raul Ruiz'}).some(r=>r.key==='ca-25'));
  assert.equal(filterRaces(house,{filter:'called'}).length,0);
  assert.equal(filterRaces(house,{filter:'close'}).length,0);
  assert.equal(filterRaces(house,{state:'CA',search:'Texas'}).length,0);
  assert.equal(filterRaces(house,{state:'CA',district:'ca-23'}).length,1);
  assert.equal(filterRaces(house,{state:'TX',district:'ca-23'}).length,0);
});
check('Senate special elections are present as separate contests', () => {
  const senate=racesFromFeed(snapshots.senate,'senate');
  assert(senate.find(r=>r.id===87068).name.includes('Special'));
  assert(senate.find(r=>r.id===87527).name.includes('Special'));
});
check('test data, wrong dates, wrong offices and malformed geographies are rejected', () => {
  const data=snapshots.senate;
  for(const patch of [{test_data:true},{election_date:'2024-11-05'},{election_type:'State Senate'},{region_results:{'xx':{candidates:[],election_id:1}}},{region_results:{'ca':{candidates:[null],election_id:1}}},{region_results:{'ca':{candidates:[candidate('A','Democratic',-5)],election_id:1}}}]) assert.throws(()=>validateFeed({...data,...patch},'senate'));
});
check('provider text is escaped before insertion in markup', () => assert.equal(escapeHTML('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
const districtJoin = JSON.parse(await readFile(new URL('../data/district-join.json',import.meta.url),'utf8'));
check('all 435 supplied voting district IDs join one-to-one to House races', () => {
  assert.equal(districtJoin.source,DISTRICT_LAYER_URL);
  assert(districtJoin.districts.every(d=>d.CDSESSN==='120'));
  const keys=districtJoin.districts.map(districtRaceKey).filter(Boolean);
  assert.equal(keys.length,435); assert.equal(new Set(keys).size,435);
  assert.deepEqual([...keys].sort(),racesFromFeed(snapshots.house,'house').map(r=>r.key).sort());
});
check('at-large districts normalize 00 to al and exclude DC and invalid codes', () => {
  for (const [fips,abbr] of [['02','AK'],['10','DE'],['38','ND'],['46','SD'],['50','VT'],['56','WY']]) assert.equal(districtRaceKey({STATE:fips,CD120:'00'}),abbr.toLowerCase()+'-al');
  assert.equal(districtRaceKey({STATE:'06',CD120:'1'}),'ca-01');
  assert.equal(districtRaceKey({STATE:'17',CD120:'ZZ'}),null);
  assert.equal(districtRaceKey({STATE:'72',CD120:'98'}),null);
  for(const attributes of [{STATE_ABBR:'DC',CDFIPS:'98'},{STATE_ABBR:'CA',CDFIPS:'x'},{STATE_ABBR:'CA',CDFIPS:'99'},{STATE_ABBR:'XX',CDFIPS:'01'}]) assert.equal(districtRaceKey(attributes),null);
});
console.log(`Passed ${checks} election data and interpretation checks.`);

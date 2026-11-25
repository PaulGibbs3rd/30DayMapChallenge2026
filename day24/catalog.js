export const regions = {
  islands: {name: "San Juans", color: "#f1a475"},
  whidbey: {name: "Whidbey", color: "#7ad2d9"},
  central: {name: "Central Sound", color: "#92d4ae"},
  south: {name: "South Sound", color: "#c8b3eb"},
};

const schedule = "https://wsdot.com/ferries/schedule/scheduledetailbyroute.aspx?route=";

export const routes = [
  {id: "islands", name: "Anacortes & San Juan Islands", region: "islands", docks: ["1", "10", "15", "18", "13"], schedules: [["San Juan Islands schedule", "ana-sj"]]},
  {id: "port", name: "Port Townsend – Coupeville", region: "whidbey", docks: ["17", "11"], schedules: [["Route schedule", "pt-key"]]},
  {id: "mukilteo", name: "Mukilteo – Clinton", region: "whidbey", docks: ["14", "5"], schedules: [["Route schedule", "muk-cl"]]},
  {id: "edmonds", name: "Edmonds – Kingston", region: "central", docks: ["8", "12"], schedules: [["Route schedule", "ed-king"]]},
  {id: "bainbridge", name: "Seattle – Bainbridge Island", region: "central", docks: ["7", "3"], schedules: [["Route schedule", "sea-bi"]]},
  {id: "bremerton", name: "Seattle – Bremerton", region: "central", docks: ["7", "4"], schedules: [["Route schedule", "sea-br"]]},
  {id: "triangle", name: "Fauntleroy, Vashon & Southworth", region: "south", docks: ["9", "22", "20"], schedules: [["Fauntleroy–Vashon", "f-v"], ["Fauntleroy–Southworth", "f-s"], ["Southworth–Vashon", "s-v"]]},
  {id: "tahlequah", name: "Point Defiance – Tahlequah", region: "south", docks: ["16", "21"], schedules: [["Route schedule", "pd-tal"]]},
];

export const routeById = new Map(routes.map((route) => [route.id, route]));

export function routeFor(a, b) {
  return routes.find(({docks}) => docks.includes(a) && docks.includes(b));
}

export function scheduleLinks(route) {
  return route.schedules.map(([label, code]) => ({label, href: schedule + code}));
}

export function legId(a, b) {
  return [a, b].sort().join("-");
}

export function patternLegs(sequence) {
  return sequence.slice(1).map((dock, index) => legId(sequence[index], dock));
}

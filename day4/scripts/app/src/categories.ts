export const categories = [
  { id: "residential", label: "Residential", color: "#43f5d0", tags: ["house", "apartments", "residential", "detached", "semidetached_house", "terrace", "bungalow", "dormitory", "static_caravan", "cabin", "houseboat"] },
  { id: "commercial", label: "Commercial", color: "#ff66c4", tags: ["commercial", "retail", "office", "supermarket", "hotel", "kiosk"] },
  { id: "warehouse", label: "Warehouses", color: "#ffb84d", tags: ["warehouse"] },
  { id: "industrial", label: "Other industrial", color: "#ff815f", tags: ["industrial", "storage_tank", "manufacture", "factory"] },
  { id: "civic", label: "Civic / education", color: "#6fa8ff", tags: ["school", "university", "college", "kindergarten", "hospital", "civic", "public", "government", "fire_station", "train_station", "transportation", "stadium", "sports_hall", "library", "museum"] },
  { id: "religious", label: "Religious", color: "#c39aff", tags: ["church", "cathedral", "chapel", "mosque", "synagogue", "temple", "religious", "shrine", "monastery"] },
  { id: "other", label: "Other types", color: "#e9ef61", tags: [] as string[] },
  { id: "unknown", label: "Unknown type", color: "#8d9bb0", tags: ["yes", "building", "true", "1", ""] },
] as const;
export type CategoryId = typeof categories[number]["id"];
export function classify(value: unknown): CategoryId {
  const tag = String(value ?? "").trim().toLowerCase();
  return categories.find(c => (c.tags as readonly string[]).includes(tag))?.id ?? "other";
}
export const categoryExpression = `var b = Lower(Trim(DefaultValue($feature.building, '')));\n` + categories.filter(c=>c.tags.length).map(c => `if (IndexOf(${JSON.stringify(c.tags)}, b) >= 0) { return '${c.id}'; }`).join("\n") + `\nreturn 'other';`;
export const categoryCondition = (id: string) => {
  if (id === "all") return "1=1";
  const cat = categories.find(c=>c.id === id);
  if (!cat) return "1=1";
  const quote = (s: string) => "'" + s.replaceAll("'", "''") + "'";
  if (id === "other") return `building IS NOT NULL AND LOWER(TRIM(BOTH ' ' FROM building)) NOT IN (${categories.flatMap(c=>c.tags).map(quote).join(",")})`;
  const match = `LOWER(TRIM(BOTH ' ' FROM building)) IN (${cat.tags.map(quote).join(",")})`;
  return id === "unknown" ? `(${match} OR building IS NULL)` : match;
};
export const categoryExclusion = (id: CategoryId | "all") => {
  if (id === "all") return "1=0";
  const condition = categoryCondition(id);
  return id === "unknown" ? `NOT (${condition})` : `(building IS NULL OR NOT (${condition}))`;
};

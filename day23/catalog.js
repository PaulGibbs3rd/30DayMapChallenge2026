export const flavors = [
  { id: "floral", label: "Floral", color: "#885968" },
  { id: "citrus", label: "Citrus", color: "#b24c19" },
  { id: "berry", label: "Berry", color: "#7b405e" },
  { id: "other-fruit", label: "Other fruit", color: "#aa5b36" },
  { id: "chocolate", label: "Chocolate & nuts", color: "#694533" },
  { id: "caramel", label: "Caramel & brown sugar", color: "#98621d" },
  { id: "spice", label: "Spice, herbs & earth", color: "#54673e" },
];

export const jasminePair = ["yirgacheffe", "boquete"];

export function filterCoffees(coffees, flavor) {
  if (flavor === "all") return coffees;
  return coffees.filter(({ properties }) => properties.flavors.includes(flavor));
}

export function compareCoffees(first, second) {
  const otherNotes = new Set(second.properties.notes.map((note) => note.toLowerCase()));
  return {
    notes: first.properties.notes.filter((note) => otherNotes.has(note.toLowerCase())),
    families: flavors.filter(({ id }) => (
      first.properties.flavors.includes(id) && second.properties.flavors.includes(id)
    )),
  };
}

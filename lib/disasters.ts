export async function fetchEarthquakes() {
  const res = await fetch(
    "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=20&orderby=time",
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.features ?? [];
}

export async function fetchNaturalEvents() {
  const res = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?status=open", { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.events ?? [];
}

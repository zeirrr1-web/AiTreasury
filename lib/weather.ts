export async function fetchWeatherAlerts() {
  const res = await fetch("https://api.weather.gov/alerts/active", { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.features ?? [];
}

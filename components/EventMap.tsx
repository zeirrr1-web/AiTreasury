"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapEvent {
  id: string;
  title: string;
  lat: number;
  lng: number;
  category: string;
}

export default function EventMap({ events }: { events: MapEvent[] }) {
  return (
    <div className="h-[450px] w-full overflow-hidden rounded-xl border border-slate-800">
      <MapContainer center={[15, 0]} zoom={2} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => (
          <Marker position={[event.lat, event.lng]} key={event.id}>
            <Popup>
              <strong>{event.title}</strong>
              <p>{event.category}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

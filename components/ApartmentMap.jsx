"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

function makeTransitIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:13px;height:13px;border-radius:3px;
      background:#1c1c2e;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:8px;font-weight:800;
      box-shadow:0 1px 4px rgba(0,0,0,0.5);
      font-family:sans-serif;
    ">M</div>`,
    iconSize: [13, 13],
    iconAnchor: [6, 6],
    popupAnchor: [0, -10],
  });
}

function searchPinIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      font-size:28px;line-height:1;
      filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));
      transform:translateY(-50%);
    ">📍</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

function FlyToListing({ listings, highlightedListingId }) {
  const map = useMap();
  useEffect(() => {
    if (!highlightedListingId) return;
    const l = listings.find(x => x.id === highlightedListingId);
    if (l?.lat && l?.lng) {
      map.flyTo([l.lat, l.lng], 15, { duration: 0.9 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedListingId]);
  return null;
}

function FlyToPin({ searchPin }) {
  const map = useMap();
  useEffect(() => {
    if (searchPin) {
      map.flyTo([searchPin.lat, searchPin.lng], 15, { duration: 1.2 });
    }
  }, [searchPin, map]);
  return null;
}

function makeIcon(color, highlighted) {
  const size = highlighted ? 22 : 14;
  const border = highlighted ? "3px" : "2.5px";
  const shadow = highlighted
    ? `0 0 0 5px ${color}30, 0 3px 10px rgba(0,0,0,0.5)`
    : `0 2px 8px rgba(0,0,0,0.45)`;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:${border} solid #fff;
      box-shadow:${shadow};
      transition:all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

function FitBounds({ listingKey, listings }) {
  const map = useMap();
  useEffect(() => {
    const pts = listings.filter(l => l.lat && l.lng).map(l => [l.lat, l.lng]);
    if (pts.length > 1) {
      map.fitBounds(pts, { padding: [50, 50], maxZoom: 14 });
    } else if (pts.length === 1) {
      map.setView(pts[0], 14);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingKey]);
  return null;
}

export default function ApartmentMap({ listings, cityColor, darkMode, cityId, onSelectListing, highlightedListingId, searchPin, transitStops = [], cityCenter }) {
  const [showTransit, setShowTransit] = useState(false);
  const withCoords = listings.filter(l => l.lat && l.lng);
  if (withCoords.length === 0 && !searchPin && !cityCenter) return null;

  const center = withCoords.length > 0
    ? [
        withCoords.reduce((s, l) => s + l.lat, 0) / withCoords.length,
        withCoords.reduce((s, l) => s + l.lng, 0) / withCoords.length,
      ]
    : searchPin
    ? [searchPin.lat, searchPin.lng]
    : cityCenter;

  const tileUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const listingKey = withCoords.map(l => l.id).join(",");

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", position: "relative" }}>
      <button
        onClick={() => setShowTransit(v => !v)}
        style={{
          position: "absolute", top: 10, right: 10, zIndex: 1000,
          padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer",
          background: showTransit ? "#1c1c2e" : "rgba(255,255,255,0.92)",
          color: showTransit ? "#fff" : "#1c1c2e",
          fontSize: 12, fontWeight: 700, fontFamily: "sans-serif",
          boxShadow: "0 1px 6px rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", gap: 5,
        }}
      >
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 14, height: 14, borderRadius: 3,
          background: showTransit ? "#fff" : "#1c1c2e", color: showTransit ? "#1c1c2e" : "#fff",
          fontSize: 8, fontWeight: 800,
        }}>M</span>
        Transit
      </button>
      <MapContainer
        key={cityId}
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: 480, width: "100%" }}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
          maxZoom={19}
        />
        <FitBounds listingKey={listingKey} listings={withCoords} />
        <FlyToListing listings={withCoords} highlightedListingId={highlightedListingId} />
        <FlyToPin searchPin={searchPin} />
        {searchPin && (
          <Marker position={[searchPin.lat, searchPin.lng]} icon={searchPinIcon()} zIndexOffset={2000}>
            <Popup>
              <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "2px 0", minWidth: 140 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>📍 {searchPin.label}</div>
                <div style={{ color: "#888", fontSize: 11 }}>Searched location</div>
              </div>
            </Popup>
          </Marker>
        )}
        {showTransit && transitStops.map(s => (
          <Marker key={s.name} position={[s.lat, s.lng]} icon={makeTransitIcon()} zIndexOffset={500}>
            <Popup>
              <div style={{ fontFamily: "'DM Sans', sans-serif", padding: "2px 0", minWidth: 130 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>🚇 {s.name}</div>
                <div style={{ color: "#888", fontSize: 11, marginTop: 2 }}>Transit stop</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {withCoords.map(l => {
          const isHighlighted = l.id === highlightedListingId;
          return (
            <Marker
              key={l.id}
              position={[l.lat, l.lng]}
              icon={makeIcon(cityColor, isHighlighted)}
              eventHandlers={{
                click: () => onSelectListing && onSelectListing(isHighlighted ? null : l.id),
              }}
              zIndexOffset={isHighlighted ? 1000 : 0}
            >
              <Popup>
                <div style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 170, padding: "2px 0" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{l.title}</div>
                  <div style={{ color: cityColor, fontWeight: 700, fontSize: 16 }}>
                    ${l.price}<span style={{ fontWeight: 400, fontSize: 12, color: "#888" }}>/mo</span>
                  </div>
                  <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{l.type} · {l.neighborhood ?? ""}</div>
                  {l.link && (
                    <a href={l.link} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: cityColor, fontWeight: 600, textDecoration: "none" }}>
                      View listing ↗
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

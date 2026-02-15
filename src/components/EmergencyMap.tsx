import type { Volunteer } from "@/data/mockVolunteers";

interface EmergencyMapProps {
  userLocation: { lat: number; lng: number } | null;
  volunteers: (Volunteer & { distance: number })[];
  selectedVolunteer?: string | null;
}

const EmergencyMap = ({ userLocation, volunteers, selectedVolunteer }: EmergencyMapProps) => {
  const center = userLocation || { lat: 28.6139, lng: 77.2090 };
  
  // Build markers string for OpenStreetMap embed
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.015},${center.lat - 0.01},${center.lng + 0.015},${center.lat + 0.01}&layer=mapnik&marker=${center.lat},${center.lng}`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted">
      <iframe
        src={mapUrl}
        className="h-full w-full border-0"
        title="Emergency Map"
        loading="eager"
      />
      {/* Overlay with volunteer markers */}
      {volunteers.length > 0 && (
        <div className="absolute bottom-2 left-2 rounded-lg bg-card/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground shadow">
          📍 {volunteers.length} volunteer{volunteers.length > 1 ? "s" : ""} nearby
        </div>
      )}
    </div>
  );
};

export default EmergencyMap;

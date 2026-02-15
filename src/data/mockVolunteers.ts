export interface Volunteer {
  id: string;
  name: string;
  mobile: string;
  role: "Doctor" | "Nurse" | "Pharmacist" | "Compounder";
  latitude: number;
  longitude: number;
  available: boolean;
  creditPoints: number;
  avatar: string;
  specialty?: string;
}

export const mockVolunteers: Volunteer[] = [
  {
    id: "v1",
    name: "Dr. Priya Sharma",
    mobile: "+91 98765 43210",
    role: "Doctor",
    latitude: 28.6145,
    longitude: 77.2090,
    available: true,
    creditPoints: 120,
    avatar: "PS",
    specialty: "Emergency Medicine",
  },
  {
    id: "v2",
    name: "Rajesh Kumar",
    mobile: "+91 87654 32109",
    role: "Nurse",
    latitude: 28.6170,
    longitude: 77.2115,
    available: true,
    creditPoints: 85,
    avatar: "RK",
  },
  {
    id: "v3",
    name: "Dr. Anita Patel",
    mobile: "+91 76543 21098",
    role: "Doctor",
    latitude: 28.6120,
    longitude: 77.2050,
    available: true,
    creditPoints: 200,
    avatar: "AP",
    specialty: "General Surgery",
  },
  {
    id: "v4",
    name: "Mohammed Farhan",
    mobile: "+91 65432 10987",
    role: "Pharmacist",
    latitude: 28.6190,
    longitude: 77.2130,
    available: false,
    creditPoints: 45,
    avatar: "MF",
  },
  {
    id: "v5",
    name: "Sneha Reddy",
    mobile: "+91 54321 09876",
    role: "Compounder",
    latitude: 28.6155,
    longitude: 77.2070,
    available: true,
    creditPoints: 60,
    avatar: "SR",
  },
];

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearbyVolunteers(lat: number, lon: number, radiusKm: number = 5): (Volunteer & { distance: number })[] {
  return mockVolunteers
    .filter((v) => v.available)
    .map((v) => ({
      ...v,
      distance: getDistance(lat, lon, v.latitude, v.longitude),
    }))
    .filter((v) => v.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

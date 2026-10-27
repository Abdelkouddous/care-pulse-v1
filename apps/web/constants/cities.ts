import { TargetCity } from "@/types/clinic";

/**
 * Strictly targeted launch cities for VitalBook PostGIS Geolocation.
 * Phase 1 strictly targets Algiers (Capital - Wilaya 16) and Tébessa (Eastern hub - Wilaya 12).
 */
export const TARGET_CITIES: TargetCity[] = [
  {
    slug: "algiers",
    name: "Algiers",
    arabic_name: "الجزائر",
    wilaya_code: 16,
    latitude: 36.7538,
    longitude: 3.0588,
    default_radius_km: 15.0,
  },
  {
    slug: "tebessa",
    name: "Tébessa",
    arabic_name: "تبسة",
    wilaya_code: 12,
    latitude: 35.4042,
    longitude: 8.1242,
    default_radius_km: 20.0,
  },
];

/**
 * Helper to get target city metadata by slug or wilaya code.
 */
export function getTargetCity(query: string | number): TargetCity | undefined {
  if (typeof query === "number") {
    return TARGET_CITIES.find((c) => c.wilaya_code === query);
  }
  return TARGET_CITIES.find(
    (c) =>
      c.slug.toLowerCase() === query.toLowerCase() ||
      c.name.toLowerCase() === query.toLowerCase() ||
      c.wilaya_code.toString() === query
  );
}

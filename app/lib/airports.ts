export const AIRPORT_MASTER_DATA: Record<string, { code: string; city: string; lat: number; lng: number }> = {
  CGK: { code: "CGK", city: "Jakarta",    lat: -6.1256,  lng: 106.6559 },
  SIN: { code: "SIN", city: "Singapore",  lat:  1.3644,  lng: 103.9915 },
  HKG: { code: "HKG", city: "Hong Kong",  lat: 22.3080,  lng: 113.9185 },
  BKK: { code: "BKK", city: "Bangkok",    lat: 13.6900,  lng: 100.7501 },
  KUL: { code: "KUL", city: "Kuala Lumpur", lat: 2.7456, lng: 101.7099 },
  DPS: { code: "DPS", city: "Bali",       lat: -8.7482,  lng: 115.1672 },
  SUB: { code: "SUB", city: "Surabaya",   lat: -7.3798,  lng: 112.7870 },
  BDO: { code: "BDO", city: "Bandung",    lat: -6.9007,  lng: 107.5762 },
  KNO: { code: "KNO", city: "Medan",      lat:  3.6421,  lng:  98.8856 },
  UPG: { code: "UPG", city: "Makassar",   lat: -5.0617,  lng: 119.5540 },
  SRG: { code: "SRG", city: "Semarang",   lat: -6.9724,  lng: 110.3750 },
  JOG: { code: "JOG", city: "Yogyakarta", lat: -7.7880,  lng: 110.4316 },
  PKU: { code: "PKU", city: "Pekanbaru",  lat:  0.4608,  lng: 101.4449 },
  BTH: { code: "BTH", city: "Batam",      lat:  1.1212,  lng: 104.1188 },
  PNK: { code: "PNK", city: "Pontianak",  lat: -0.1503,  lng: 109.4035 },
};

export function resolveAirport(key: string) {
  if (!key) return AIRPORT_MASTER_DATA.CGK;
  const norm = key.trim().toUpperCase();
  if (AIRPORT_MASTER_DATA[norm]) return AIRPORT_MASTER_DATA[norm];
  const byCity = Object.values(AIRPORT_MASTER_DATA).find(
    (a) => a.city.toUpperCase() === norm || norm.includes(a.city.toUpperCase())
  );
  return byCity || AIRPORT_MASTER_DATA.CGK;
}

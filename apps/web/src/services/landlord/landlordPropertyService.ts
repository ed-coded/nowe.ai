export interface LandlordProperty {
  id: string;
  title: string;
  neighborhood: string;
  imageUrl: string;
  status: "occupied" | "vacant" | "under_maintenance";
  monthlyRent: number;
  currency: string;
}

/** SIMULATED landlord data — mock only this phase, no CRUD; see projectService.ts for the rationale. */
const MOCK_LANDLORD_PROPERTIES: LandlordProperty[] = [
  {
    id: "lp-01",
    title: "3-Bedroom House — Adenta",
    neighborhood: "Adenta",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    status: "occupied",
    monthlyRent: 2200,
    currency: "GHS",
  },
  {
    id: "lp-02",
    title: "2-Bedroom Apartment — Spintex",
    neighborhood: "Spintex",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    status: "vacant",
    monthlyRent: 1800,
    currency: "GHS",
  },
  {
    id: "lp-03",
    title: "Studio — Madina",
    neighborhood: "Madina",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    status: "under_maintenance",
    monthlyRent: 900,
    currency: "GHS",
  },
];

export interface LandlordPropertyService {
  list: () => LandlordProperty[];
}

export const landlordPropertyService: LandlordPropertyService = {
  list: () => MOCK_LANDLORD_PROPERTIES,
};

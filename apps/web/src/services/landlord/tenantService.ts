export interface Tenant {
  id: string;
  name: string;
  propertyTitle: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  currency: string;
  status: "current" | "ending_soon" | "past";
}

const now = Date.now();
const daysFromNow = (n: number) => new Date(now + n * 86400000).toISOString();
const daysAgo = (n: number) => new Date(now - n * 86400000).toISOString();

/** SIMULATED landlord data — mock only this phase, no CRUD; see projectService.ts for the rationale. */
const MOCK_TENANTS: Tenant[] = [
  {
    id: "ten-01",
    name: "Nana Yaw Boateng",
    propertyTitle: "3-Bedroom House — Adenta",
    leaseStart: daysAgo(200),
    leaseEnd: daysFromNow(165),
    monthlyRent: 2200,
    currency: "GHS",
    status: "current",
  },
  {
    id: "ten-02",
    name: "Efua Owusu",
    propertyTitle: "Studio — Madina",
    leaseStart: daysAgo(340),
    leaseEnd: daysFromNow(25),
    monthlyRent: 900,
    currency: "GHS",
    status: "ending_soon",
  },
];

export interface TenantService {
  list: () => Tenant[];
}

export const tenantService: TenantService = {
  list: () => MOCK_TENANTS,
};

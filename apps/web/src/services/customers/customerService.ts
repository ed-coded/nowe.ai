import { useCustomerNotesStore } from "@/store/customerNotesStore";

export type CustomerStatus = "active" | "prospect" | "past";

export interface TimelineEntry {
  label: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  budgetMin: number;
  budgetMax: number;
  preferredArea: string;
  interestedProperties: string[];
  status: CustomerStatus;
  lastContactAt: string;
  timeline: TimelineEntry[];
  defaultNotes: string;
}

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86400000).toISOString();

/** SIMULATED CRM data — mock only this phase, see leadService.ts for the rationale. */
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-01",
    name: "Ama Serwaa",
    email: "ama.serwaa@example.com",
    phone: "+233 24 111 2222",
    budgetMin: 2000,
    budgetMax: 2800,
    preferredArea: "East Legon",
    interestedProperties: ["Modern Apartment in East Legon", "Executive Studio — Airport Residential"],
    status: "active",
    lastContactAt: daysAgo(0),
    timeline: [
      { label: "Signed up", date: daysAgo(21) },
      { label: "First inquiry sent", date: daysAgo(14) },
      { label: "Viewed 3 listings", date: daysAgo(6) },
    ],
    defaultNotes: "Prefers ground-floor units. Moving from Kumasi in 6 weeks.",
  },
  {
    id: "cust-02",
    name: "Kwabena Owusu",
    email: "kwabena.owusu@example.com",
    phone: "+233 20 333 4444",
    budgetMin: 1500,
    budgetMax: 2000,
    preferredArea: "Madina",
    interestedProperties: ["Spacious Family House — Cantonments"],
    status: "prospect",
    lastContactAt: daysAgo(1),
    timeline: [{ label: "Signed up", date: daysAgo(4) }],
    defaultNotes: "",
  },
  {
    id: "cust-03",
    name: "Efua Mensah",
    email: "efua.mensah@example.com",
    phone: "+233 26 555 6666",
    budgetMin: 3000,
    budgetMax: 4000,
    preferredArea: "Cantonments",
    interestedProperties: ["Spacious Family House — Cantonments", "Modern Apartment in East Legon"],
    status: "active",
    lastContactAt: daysAgo(2),
    timeline: [
      { label: "Signed up", date: daysAgo(30) },
      { label: "Requested inspection", date: daysAgo(9) },
    ],
    defaultNotes: "Needs a 4-bed with a garden for extended family visits.",
  },
  {
    id: "cust-04",
    name: "Yaw Darko",
    email: "yaw.darko@example.com",
    phone: "+233 27 777 8888",
    budgetMin: 900,
    budgetMax: 1300,
    preferredArea: "Adenta",
    interestedProperties: [],
    status: "prospect",
    lastContactAt: daysAgo(3),
    timeline: [{ label: "Signed up", date: daysAgo(3) }],
    defaultNotes: "",
  },
  {
    id: "cust-05",
    name: "Akosua Frimpong",
    email: "akosua.frimpong@example.com",
    phone: "+233 20 999 0000",
    budgetMin: 2500,
    budgetMax: 2900,
    preferredArea: "East Legon",
    interestedProperties: ["Modern Apartment in East Legon"],
    status: "past",
    lastContactAt: daysAgo(45),
    timeline: [
      { label: "Signed up", date: daysAgo(90) },
      { label: "Closed lease", date: daysAgo(45) },
    ],
    defaultNotes: "Closed — renewed lease elsewhere in 2025.",
  },
];

export interface CustomerService {
  list: () => Customer[];
  getById: (id: string) => Customer | null;
  getNotes: (customerId: string) => string;
  setNotes: (customerId: string, notes: string) => void;
}

export const customerService: CustomerService = {
  list: () => MOCK_CUSTOMERS,
  getById: (id) => MOCK_CUSTOMERS.find((c) => c.id === id) ?? null,
  getNotes: (customerId) => {
    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    return useCustomerNotesStore.getState().notes[customerId] ?? customer?.defaultNotes ?? "";
  },
  setNotes: (customerId, notes) => useCustomerNotesStore.getState().setNote(customerId, notes),
};

export { useCustomerNotesStore };

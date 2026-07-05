export type ProjectStatus = "draft" | "published" | "sold_out";

export interface Project {
  id: string;
  name: string;
  city: string;
  status: ProjectStatus;
  coverImageUrl: string;
  totalUnits: number;
  soldUnits: number;
  reservedUnits: number;
  availableUnits: number;
}

/**
 * SIMULATED developer data — a real `projects`/`units` schema already exists
 * (Phase 2) but this phase keeps it mock-only per spec; Phase 5 swaps this
 * for a Supabase-backed implementation against those tables.
 */
const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-01",
    name: "Legon Heights Residences",
    city: "Accra",
    status: "published",
    coverImageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
    totalUnits: 48,
    soldUnits: 30,
    reservedUnits: 8,
    availableUnits: 10,
  },
  {
    id: "proj-02",
    name: "Spintex Garden Court",
    city: "Accra",
    status: "published",
    coverImageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    totalUnits: 24,
    soldUnits: 6,
    reservedUnits: 4,
    availableUnits: 14,
  },
  {
    id: "proj-03",
    name: "Airport City Towers",
    city: "Accra",
    status: "draft",
    coverImageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    totalUnits: 60,
    soldUnits: 0,
    reservedUnits: 0,
    availableUnits: 60,
  },
];

export interface ProjectService {
  list: () => Project[];
  getById: (id: string) => Project | null;
}

export const projectService: ProjectService = {
  list: () => MOCK_PROJECTS,
  getById: (id) => MOCK_PROJECTS.find((p) => p.id === id) ?? null,
};

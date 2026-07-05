import type { UserRole } from "@/types/auth";

/** Each role's own dashboard — used for post-sign-in and wrong-role redirects. */
export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/noweadmin";
    case "agent":
      return "/agent/dashboard";
    default:
      return "/dashboard";
  }
}

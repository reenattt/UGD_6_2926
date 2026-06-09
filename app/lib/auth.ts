export type UserRole = "Admin" | "Owner";

export interface SessionUser {
  username: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AdminAccount {
  username: string;
  password?: string;
  name: string;
  email: string;
  enabled: boolean;
}

// Predefined list (mainly used for server components/fallback, client dynamic reads localStorage)
export const USERS: Array<SessionUser & { password?: string }> = [
  {
    username: "owner",
    password: "owner123",
    name: "Owner",
    email: "owner@skylink.com",
    role: "Owner"
  }
];

const DEFAULT_ADMINS: AdminAccount[] = [
  {
    username: "241712926",
    password: "hajarsiweb",
    name: "Operator Admin",
    email: "admin@petir.com",
    enabled: true
  }
];

export function getAdmins(): AdminAccount[] {
  if (typeof window === "undefined") return DEFAULT_ADMINS;
  const data = localStorage.getItem("skylink_admins");
  if (!data) {
    localStorage.setItem("skylink_admins", JSON.stringify(DEFAULT_ADMINS));
    return DEFAULT_ADMINS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_ADMINS;
  }
}

export function saveAdmins(admins: AdminAccount[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("skylink_admins", JSON.stringify(admins));
}

export function verifyUser(username: string, password?: string): SessionUser | null {
  if (username === "owner" && password === "owner123") {
    return {
      username: "owner",
      name: "Owner",
      email: "owner@skylink.com",
      role: "Owner"
    };
  }

  const admins = getAdmins();
  const admin = admins.find(
    (a) => a.username === username && a.password === password && a.enabled
  );
  if (admin) {
    return {
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: "Admin"
    };
  }
  return null;
}

export function getClientSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/(^| )user_session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[2]));
  } catch {
    return null;
  }
}

export function setClientSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  document.cookie = `user_session=${encodeURIComponent(
    JSON.stringify(user)
  )}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearClientSession() {
  if (typeof window === "undefined") return;
  document.cookie = "user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

export function hasRoleAccess(role: UserRole, pathname: string): boolean {
  if (pathname.startsWith("/dashboard/manage-admins")) {
    return role === "Owner";
  }
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/manifest")) {
    return role === "Admin" || role === "Owner";
  }
  return true;
}

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  avatar?: string | null;
}

export function getProfile(username: string): UserProfile | null {
  if (typeof window === "undefined") return null;
  const key = `skylink_profile_${username}`;
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  const key = `skylink_profile_${profile.username}`;
  localStorage.setItem(key, JSON.stringify(profile));
}

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface UserProfile {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImg?: string;
  avatar?: string;
  [key: string]: any;
}

/**
 * Determine if current active session was saved with Remember Me (localStorage)
 */
export function isRememberMe(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    localStorage.getItem("accessToken") ||
      localStorage.getItem("storageType") === "local"
  );
}

/**
 * Retrieve access token from sessionStorage, localStorage, or Cookies
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const token =
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    Cookies.get("accessToken") ||
    Cookies.get("token") ||
    null;

  if (!token) return null;

  // Optional: check if token is visibly expired
  try {
    const decoded: any = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      // Access token expired, check if refreshToken is available
      const refresh = getRefreshToken();
      if (!refresh) {
        clearAuth();
        return null;
      }
    }
  } catch (e) {
    // If not a valid JWT format, return token anyway for server to validate
  }

  return token;
}

/**
 * Retrieve refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    sessionStorage.getItem("refreshToken") ||
    localStorage.getItem("refreshToken") ||
    Cookies.get("refreshToken") ||
    null
  );
}

/**
 * Store tokens according to Remember Me selection:
 * - If rememberMe = true -> save in localStorage + persistent cookie
 * - If rememberMe = false -> save in sessionStorage + session cookie (wiped on browser close)
 */
export function setAuthTokens(
  tokens: AuthTokens,
  rememberMe?: boolean
): void {
  const { accessToken, refreshToken } = tokens;
  const isPersistent =
    rememberMe !== undefined ? rememberMe : isRememberMe();

  if (isPersistent) {
    // 1. Clear any transient session storage
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("storageType");

    // 2. Persist in localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("storageType", "local");

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      Cookies.set("refreshToken", refreshToken, {
        expires: 30,
        path: "/",
        sameSite: "lax",
      });
    }

    // 3. Set persistent cookie (30 days)
    Cookies.set("accessToken", accessToken, {
      expires: 30,
      path: "/",
      sameSite: "lax",
    });
  } else {
    // 1. Clear persistent localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("storageType");

    // 2. Save only in sessionStorage (dies on tab/browser close)
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("authToken", accessToken);
    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("storageType", "session");

    if (refreshToken) {
      sessionStorage.setItem("refreshToken", refreshToken);
      Cookies.set("refreshToken", refreshToken, {
        path: "/",
        sameSite: "lax",
      });
    }

    // 3. Set session cookie (no expires = session-only)
    Cookies.set("accessToken", accessToken, {
      path: "/",
      sameSite: "lax",
    });
  }

  // Attempt to decode user info from token payload and store
  try {
    const decoded: any = jwtDecode(accessToken);
    const existingUser = getStoredUser() || {};
    const mergedUser = {
      ...existingUser,
      id: decoded.id || decoded._id || decoded.userId || decoded.sub || existingUser.id,
      email: decoded.email || existingUser.email,
      role: decoded.role || existingUser.role || "Super Admin",
      name: decoded.name || existingUser.name,
    };
    setStoredUser(mergedUser, isPersistent);
  } catch (e) {
    // Token wasn't standard JWT or decode failed
  }

  // Dispatch auth event to notify any listening components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-state-changed"));
  }
}

/**
 * Remove all tokens from localStorage, sessionStorage, and cookies
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;

  // 1. Remove all auth keys from localStorage
  const authKeys = [
    "accessToken",
    "refreshToken",
    "authToken",
    "token",
    "user",
    "adminUser",
    "storageType",
    "Authorization",
  ];

  authKeys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  // 2. Clear entire sessionStorage
  try {
    sessionStorage.clear();
  } catch (e) {}

  // 3. Thoroughly remove all cookies across root and domain
  const cookieNames = [
    "accessToken",
    "refreshToken",
    "token",
    "authToken",
    "user",
  ];

  cookieNames.forEach((name) => {
    Cookies.remove(name, { path: "/" });
    Cookies.remove(name);
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });

  // 4. Dispatch auth event so route guards immediately react
  window.dispatchEvent(new Event("auth-state-changed"));
}

/**
 * Check if the user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

/**
 * Retrieve cached user profile
 */
export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      sessionStorage.getItem("user") ||
      localStorage.getItem("user") ||
      sessionStorage.getItem("adminUser") ||
      localStorage.getItem("adminUser");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Cache user profile in storage
 */
export function setStoredUser(user: UserProfile, isPersistent?: boolean): void {
  if (typeof window === "undefined") return;

  const persistent =
    isPersistent !== undefined ? isPersistent : isRememberMe();

  try {
    const serialized = JSON.stringify(user);
    if (persistent) {
      localStorage.setItem("user", serialized);
      localStorage.setItem("adminUser", serialized);
    } else {
      sessionStorage.setItem("user", serialized);
      sessionStorage.setItem("adminUser", serialized);
    }
  } catch (e) {
    console.error("Error storing user:", e);
  }
}

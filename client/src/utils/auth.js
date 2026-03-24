const AUTH_TOKEN_KEY = "auth-token";
const AUTH_USER_KEY = "auth-user";

export const setAuthSession = ({ token, user }) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY) || "";

export const getAuthUser = () => {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = () => Boolean(getAuthToken());

export const hasAnyRole = (allowedRoles = []) => {
  const user = getAuthUser();
  if (!user?.roleName) {
    return false;
  }

  return allowedRoles.includes(user.roleName);
};

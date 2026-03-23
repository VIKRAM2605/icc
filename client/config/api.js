const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const normalizeUrl = (url = "") => (url.endsWith("/") ? url.slice(0, -1) : url);

export const BACKEND_BASE_URL = normalizeUrl(API_BASE_URL);

export const API_ROUTES = {
	health: "/",
	authLogin: "/api/auth/login",
	authGoogle: "/api/auth/google",
	authMe: "/api/auth/me",
	authLogout: "/api/auth/logout",
	eventDetails: "/api/event-details",
};

export const getApiUrl = (route) => {
	const safeRoute = route.startsWith("/") ? route : `/${route}`;
	return `${BACKEND_BASE_URL}${safeRoute}`;
};

export const API_URLS = {
	health: getApiUrl(API_ROUTES.health),
	authLogin: getApiUrl(API_ROUTES.authLogin),
	authGoogle: getApiUrl(API_ROUTES.authGoogle),
	authMe: getApiUrl(API_ROUTES.authMe),
	authLogout: getApiUrl(API_ROUTES.authLogout),
	eventDetails: getApiUrl(API_ROUTES.eventDetails),
};

export const loginUser = async ({ email, password }) => {
	const response = await fetch(API_URLS.authLogin, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(payload.message || "Login failed.");
	}

	return payload;
};

export const googleLoginUser = async ({ credential }) => {
	const response = await fetch(API_URLS.authGoogle, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ credential }),
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(payload.message || "Google login failed.");
	}

	return payload;
};

export const getCurrentUser = async (token) => {
	const response = await fetch(API_URLS.authMe, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(payload.message || "Failed to fetch current user.");
	}

	return payload;
};

export const logoutUser = async (token) => {
	const response = await fetch(API_URLS.authLogout, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(payload.message || "Logout failed.");
	}

	return payload;
};

export const createEventDetails = async (formData, token) => {
	const response = await fetch(API_URLS.eventDetails, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(payload.message || "Failed to upload event details.");
	}

	return payload;
};

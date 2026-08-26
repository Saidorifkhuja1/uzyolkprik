const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || `API xatolik: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export function fetchSite() {
  return request("/site/");
}

export function fetchPages() {
  return request("/pages/");
}

export function fetchPage(slug) {
  return request(`/pages/${slug}/`);
}

export const API_DOCS = {
  swagger: "/swagger/",
  redoc: "/redoc/",
  schema: "/swagger.json",
};

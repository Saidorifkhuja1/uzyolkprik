const API_BASE = "/api";

function getCookie(name) {
  if (typeof document === "undefined" || !document.cookie) return null;
  for (const cookie of document.cookie.split(";")) {
    const c = cookie.trim();
    if (c.startsWith(name + "=")) return decodeURIComponent(c.substring(name.length + 1));
  }
  return null;
}

async function request(path, options = {}) {
  const csrfToken = getCookie("csrftoken");
  const headers = {
    Accept: "application/json",
    ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail || `API xatolik: ${response.status}`);
  }
  return data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function crudApi(base) {
  return {
    list: (token) =>
      request(`/${base}/`, { headers: authHeaders(token) }),
    create: (formData, token) =>
      request(`/${base}/`, { method: "POST", headers: authHeaders(token), body: formData }),
    update: (id, formData, token) =>
      request(`/${base}/${id}/`, { method: "PATCH", headers: authHeaders(token), body: formData }),
    delete: (id, token) =>
      request(`/${base}/${id}/`, { method: "DELETE", headers: authHeaders(token) }),
  };
}

// ── Site ─────────────────────────────────────────────────────
export const fetchSite = () => request("/site/");
export const fetchPages = () => request("/pages/");
export const fetchPage = (slug) => request(`/pages/${slug}/`);
export const updatePage = (slug, formData, token) =>
  request(`/pages/${slug}/`, { method: "PATCH", headers: authHeaders(token), body: formData });

// ── Account ──────────────────────────────────────────────────
export const loginUser = (username, password) =>
  request("/accounts/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: (username || "").trim(), password }),
  });
export const logoutUser = () => request("/accounts/logout/", { method: "POST" }).catch(() => null);
export const fetchProfile = (token) =>
  request("/accounts/profile/", { headers: authHeaders(token) });
export const getStoredToken = () => localStorage.getItem("uz_token") || null;
export const storeToken = (token) => localStorage.setItem("uz_token", token);
export const clearToken = () => localStorage.removeItem("uz_token");

// ── CRUD Resources ────────────────────────────────────────────
const _elonlar = crudApi("elonlar");
export const fetchElonlar = () => _elonlar.list(null);
export const createElon = (fd, t) => _elonlar.create(fd, t);
export const updateElon = (id, fd, t) => _elonlar.update(id, fd, t);
export const deleteElon = (id, t) => _elonlar.delete(id, t);

const _filiallar = crudApi("filiallar");
export const fetchFiliallar = (t) => _filiallar.list(t);
export const createFilial = (fd, t) => _filiallar.create(fd, t);
export const updateFilial = (id, fd, t) => _filiallar.update(id, fd, t);
export const deleteFilial = (id, t) => _filiallar.delete(id, t);

const _leaders = crudApi("leaders");
export const fetchLeaders = (t) => _leaders.list(t);
export const createLeader = (fd, t) => _leaders.create(fd, t);
export const updateLeader = (id, fd, t) => _leaders.update(id, fd, t);
export const deleteLeader = (id, t) => _leaders.delete(id, t);

const _narxNavo = crudApi("narx-navo-products");
export const fetchNarxNavoProducts = (t) => _narxNavo.list(t);
export const createNarxNavoProduct = (fd, t) => _narxNavo.create(fd, t);
export const updateNarxNavoProduct = (id, fd, t) => _narxNavo.update(id, fd, t);
export const deleteNarxNavoProduct = (id, t) => _narxNavo.delete(id, t);

const _vacancies = crudApi("vacancies");
export const fetchVacancies = (t) => _vacancies.list(t);
export const createVacancy = (fd, t) => _vacancies.create(fd, t);
export const updateVacancy = (id, fd, t) => _vacancies.update(id, fd, t);
export const deleteVacancy = (id, t) => _vacancies.delete(id, t);

const _catalogItems = crudApi("catalog-items");
export const fetchCatalogItems = (slug, t) =>
  request(`/catalog-items/?slug=${slug || ""}`, { headers: authHeaders(t) });
export const createCatalogItem = (fd, t) => _catalogItems.create(fd, t);
export const updateCatalogItem = (id, fd, t) => _catalogItems.update(id, fd, t);
export const deleteCatalogItem = (id, t) => _catalogItems.delete(id, t);

// ── Settings endpoints ────────────────────────────────────────
export const updateHomeContent = (formData, token) =>
  request("/home-content/", { method: "PATCH", headers: authHeaders(token), body: formData });

export const updateContactSettings = (data, token) =>
  request("/contact-settings/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });

export const updateAnnouncementSettings = (data, token) =>
  request("/announcement-settings/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });

export const API_DOCS = {
  swagger: "/swagger/",
  redoc: "/redoc/",
  schema: "/swagger.json",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('cis_auth_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const data = await response.json();
      if (data.error && data.error.message) {
        errorMessage = data.error.message;
      }
    } catch (e) {
      // JSON parse error ignored
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Authentication API
export function loginApi(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function demoLoginApi(role, email) {
  return apiFetch('/auth/demo-login', {
    method: 'POST',
    body: JSON.stringify({ role, email })
  });
}

export function getMeApi(authToken) {
  return apiFetch('/auth/me', {
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
  });
}

export function registerApi(data) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Projects API
export function getProjects() {
  return apiFetch('/projects');
}

export function getProject(id) {
  return apiFetch(`/projects/${id}`);
}

export function createProject(data) {
  return apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Stakeholders API
export function getProjectStakeholders(projectId) {
  return apiFetch(`/projects/${projectId}/stakeholders`);
}

export function createStakeholder(data) {
  return apiFetch('/stakeholders', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function addStakeholderToProject(projectId, stakeholderId, responsibilityAreas) {
  return apiFetch(`/projects/${projectId}/stakeholders/${stakeholderId}`, {
    method: 'POST',
    body: JSON.stringify({ responsibilityAreas })
  });
}

export function removeStakeholderFromProject(projectId, stakeholderId) {
  return apiFetch(`/projects/${projectId}/stakeholders/${stakeholderId}`, {
    method: 'DELETE'
  });
}

// Activities API
export function getProjectActivities(projectId) {
  return apiFetch(`/projects/${projectId}/activities`);
}

export function createActivity(data) {
  return apiFetch('/activities', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Dependencies API
export function getDependencies(projectId) {
  return apiFetch(`/projects/${projectId}/dependencies`);
}

export function createDependency(data) {
  return apiFetch('/dependencies', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Change Events API
export function getChangeEvents(projectId) {
  return apiFetch(`/projects/${projectId}/change-events`);
}

export function createChangeEvent(data) {
  return apiFetch('/change-events', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function getImpactResult(changeEventId) {
  return apiFetch(`/change-events/${changeEventId}/impact-result`);
}

// Actions API
export function getProjectActions(projectId) {
  return apiFetch(`/projects/${projectId}/actions`);
}

export function createAction(data) {
  return apiFetch('/actions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateActionStatus(id, status) {
  return apiFetch(`/actions/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

// Approvals API
export function getProjectApprovals(projectId, status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiFetch(`/projects/${projectId}/approvals${query}`);
}

export function createApproval(data) {
  return apiFetch('/approvals', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateApproval(id, data) {
  return apiFetch(`/approvals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Alerts API
export function getAlerts(stakeholderId) {
  return apiFetch(`/stakeholders/${stakeholderId}/alerts`);
}

export function markAlertRead(id) {
  return apiFetch(`/alerts/${id}/read`, {
    method: 'PUT'
  });
}

// Project Memory API
export function getProjectMemory(projectId, params = {}) {
  const queryParts = [];
  if (params.type) queryParts.push(`type=${encodeURIComponent(params.type)}`);
  if (params.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);

  const queryStr = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return apiFetch(`/projects/${projectId}/memory${queryStr}`);
}

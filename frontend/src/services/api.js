const API_BASE = 'http://localhost:4000/api';

function buildQuery(params = {}) {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
    return new URLSearchParams(entries).toString();
}

async function handle(res, expectJson = true) {
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
    }
    return expectJson ? res.json() : undefined;
}

export async function getTasks(params = {}) {
    const qs = buildQuery(params);
    const res = await fetch(`${API_BASE}/tasks${qs ? `?${qs}` : ''}`);
    return handle(res, true);
}

export async function createTask(data) {
    const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handle(res, true);
}

export async function updateTask(id, data) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handle(res, true);
}

export async function toggleTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'PATCH' });
    return handle(res, true);
}

export async function deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    return handle(res, false);
}

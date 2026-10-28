import { apiFetch, ApiError } from './apiClient.js';
import {
  readStoredRequests,
  writeStoredRequests,
  clearStoredRequests,
} from './requestStorage.js';

export { ApiError };

const isGitHubPages = window.location.hostname.endsWith('github.io');
const BASE_URL = import.meta.env?.BASE_URL ?? './';

async function getSeedRequests() {
  const url = isGitHubPages
    ? '/engse203-student-labs-685432100285/labs/week-07/data/initialRequests.json'
    : `${BASE_URL}data/initialRequests.json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('ไม่สามารถโหลดข้อมูลคำร้องเริ่มต้นได้');
  }
  return structuredClone(await response.json());
}

async function getLocalRequests() {
  const stored = readStoredRequests();
  if (stored.status === 'valid') return stored.requests;

  const seed = await getSeedRequests();
  writeStoredRequests(seed);
  return seed;
}

function makeId(requests) {
  let id;
  do {
    id = `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  } while (requests.some((item) => item.id === id));
  return id;
}

export async function getRequests(options = {}) {
  if (options.scenario === 'error') throw new ApiError('ทดสอบข้อผิดพลาด', 500);
  if (options.scenario === 'empty') return [];

  if (isGitHubPages) {
    const requests = await getLocalRequests();
    return options.status
      ? requests.filter((item) => item.status === options.status)
      : requests;
  }

  const query = options.status
    ? `?status=${encodeURIComponent(options.status)}`
    : '';
  return apiFetch(`/api/requests${query}`);
}

export async function getRequestById(requestId) {
  if (isGitHubPages) {
    const requests = await getLocalRequests();
    return requests.find((item) => item.id === requestId) ?? null;
  }

  try {
    return await apiFetch(`/api/requests/${encodeURIComponent(requestId)}`);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function addRequest(input) {
  if (!isGitHubPages) {
    return apiFetch('/api/requests', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  const requests = await getLocalRequests();
  const requesterName = input?.requesterName?.trim();
  const requestType = input?.requestType?.trim();
  const location = input?.location?.trim();
  const details = input?.details?.trim();
  const priority = input?.priority;

  if (
    !requesterName || requesterName.length < 2 ||
    !requestType || !location ||
    !details || details.length < 10 ||
    !['normal', 'urgent'].includes(priority)
  ) {
    throw new Error('ข้อมูลคำร้องไม่ครบหรือไม่ถูกต้อง');
  }

  const created = {
    id: makeId(requests),
    requesterName,
    requestType,
    location,
    details,
    priority,
    status: 'pending',
  };

  writeStoredRequests([...requests, created]);
  return structuredClone(created);
}

export async function updateRequestStatus(requestId, status) {
  if (!isGitHubPages) {
    return apiFetch(`/api/requests/${encodeURIComponent(requestId)}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    throw new Error('สถานะคำร้องไม่ถูกต้อง');
  }

  const requests = await getLocalRequests();
  const index = requests.findIndex((item) => item.id === requestId);
  if (index < 0) throw new ApiError('ไม่พบคำร้องที่ต้องการแก้ไข', 404);

  const updated = requests.map((item) =>
    item.id === requestId ? { ...item, status } : item
  );
  writeStoredRequests(updated);
  return structuredClone(updated[index]);
}

export async function deleteRequest(requestId) {
  if (!isGitHubPages) {
    await apiFetch(`/api/requests/${encodeURIComponent(requestId)}`, {
      method: 'DELETE',
    });
    return getRequests();
  }

  const requests = await getLocalRequests();
  const next = requests.filter((item) => item.id !== requestId);
  writeStoredRequests(next);
  return structuredClone(next);
}

export async function resetRequests() {
  if (!isGitHubPages) return getRequests();

  clearStoredRequests();
  const seed = await getSeedRequests();
  writeStoredRequests(seed);
  return structuredClone(seed);
}

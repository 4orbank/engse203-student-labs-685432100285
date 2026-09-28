import { clearStoredRequests, readStoredRequests, writeStoredRequests } from './requestStorage.js';

const LAB_DELAY_MS = 420;

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForLabDelay() {
  await delay(globalThis.__ENGSE203_SKIP_DELAY__ ? 0 : LAB_DELAY_MS);
}

async function fetchSeedRequests() {
  const baseUrl = import.meta.env?.BASE_URL ?? './';
  const response = await fetch(baseUrl + 'data/initialRequests.json');
  if (!response.ok) {
    throw new Error('โหลดข้อมูลตัวอย่างไม่สำเร็จ');
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('รูปแบบข้อมูลตัวอย่างไม่ถูกต้อง');
  }
  return structuredClone(data);
}

export async function getRequests(options = {}) {
  await waitForLabDelay();

  if (options.scenario === 'error') {
    throw new Error('LAB scenario: จำลองการโหลดข้อมูลไม่สำเร็จ');
  }
  if (options.scenario === 'empty') {
    return [];
  }

  return loadNormalRequests(options.onRecovery);
}

async function loadNormalRequests(onRecovery) {
  const stored = readStoredRequests();

  if (stored.status === 'valid') {
    return structuredClone(stored.requests);
  }

  const seed = await fetchSeedRequests();

  if (stored.status === 'invalid') {
    onRecovery?.('ข้อมูลที่บันทึกไว้เสียหาย ระบบกู้คืนข้อมูลตัวอย่างให้แล้ว');
  }

  writeStoredRequests(seed);
  return structuredClone(seed);
}

export async function getRequestById(requestId) {
  const requests = await getRequests();
  return requests.find((request) => request.id === requestId) ?? null;
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function addRequest(requestInput) {
  if (!requestInput || typeof requestInput !== 'object') {
    throw new Error('ข้อมูลคำร้องไม่ถูกต้อง');
  }

  const requesterName = cleanText(requestInput.requesterName);
  const requestType = cleanText(requestInput.requestType);
  const location = cleanText(requestInput.location);
  const details = cleanText(requestInput.details);
  const priority = requestInput.priority;

  if (requesterName.length < 2) throw new Error('กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร');
  if (!requestType) throw new Error('กรุณาเลือกประเภทคำร้อง');
  if (!location) throw new Error('กรุณาระบุสถานที่');
  if (details.length < 10) throw new Error('กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร');
  if (!['normal', 'urgent'].includes(priority)) throw new Error('ความเร่งด่วนไม่ถูกต้อง');

  const requests = await getRequests();
  let id;
  do {
    id = 'REQ-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  } while (requests.some((request) => request.id === id));

  const created = {
    id,
    requesterName,
    requestType,
    location,
    details,
    priority,
    status: 'pending',
  };

  const next = [...requests, created];
  writeStoredRequests(next);
  return structuredClone(created);
}

export async function deleteRequest(requestId) {
  if (typeof requestId !== 'string' || !requestId.trim()) {
    throw new Error('รหัสคำร้องไม่ถูกต้อง');
  }

  const requests = await getRequests();
  const next = requests.filter((request) => request.id !== requestId);
  writeStoredRequests(next);
  return structuredClone(next);
}

export async function resetRequests() {
  clearStoredRequests();
  const seed = await fetchSeedRequests();
  writeStoredRequests(seed);
  return structuredClone(seed);
}

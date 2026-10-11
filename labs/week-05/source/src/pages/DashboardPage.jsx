import { useEffect, useMemo, useState } from 'react';

import FilterBar from '../components/FilterBar.jsx';
import RequestForm from '../components/RequestForm.jsx';
import RequestList from '../components/RequestList.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import {
  addRequest,
  deleteRequest,
  getRequests,
  resetRequests,
} from '../services/requestService.js';

function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');

  const summary = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((request) => request.status === 'pending').length,
      inProgress: requests.filter((request) => request.status === 'in-progress').length,
      completed: requests.filter((request) => request.status === 'completed').length,
    }),
    [requests],
  );

  const filteredRequests =
    statusFilter === 'all'
      ? requests
      : requests.filter((request) => request.status === statusFilter);

async function handleAdd(input) {
  const createdRequest = await addRequest(input);
  setRequests((current) => [...current, createdRequest]);
  setNotice('เพิ่มคำร้องแล้ว');
}

async function handleDelete(requestId) {
  const nextRequests = await deleteRequest(requestId);
  setRequests(nextRequests);
  setNotice(`ลบคำร้อง ${requestId} แล้ว`);
}

useEffect(() => {
  async function loadRequests() {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'ไม่สามารถโหลดข้อมูลคำร้องได้',
      );
    }
  }

  loadRequests();
}, []);

  async function handleReset() {
    const nextRequests = await resetRequests();
    setRequests(nextRequests);
    setStatusFilter('all');
    setNotice('คืนค่าข้อมูลตัวอย่างเริ่มต้นแล้ว');
  }

  return (
    <section data-testid="page-dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">CP01 · DASHBOARD</p>
          <h1>Campus Service Request</h1>
          <p>รายการคำร้องบริการภายในมหาวิทยาลัย</p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          data-testid="reset-button"
        >
          รีเซ็ตข้อมูล
        </button>
      </div>

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      <SummaryPanel summary={summary} />

      <div className="workspace-grid">
        <section className="panel form-panel">
          <RequestForm onAddRequest={handleAdd} />
        </section>

        <section className="panel" aria-labelledby="request-list-title">
          <div className="section-heading">
            <h2 id="request-list-title">รายการคำร้อง</h2>

            <FilterBar
              value={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>

          {filteredRequests.length === 0 ? (
            <p data-testid="empty-state">ไม่พบรายการคำร้อง</p>
          ) : (
            <RequestList
              requests={filteredRequests}
              onDeleteRequest={handleDelete}
            />
          )}
        </section>
      </div>
    </section>
  );
}

export default DashboardPage;
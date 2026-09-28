import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import RequestForm from '../components/RequestForm.jsx';
import RequestList from '../components/RequestList.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { getRequests } from '../services/requestService.js';

function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [loadState, setLoadState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
const [reloadKey, reload] = useManualReload();
const [searchParams, setSearchParams] = useSearchParams();
const scenario = searchParams.get('scenario') ?? '';

useEffect(() => {
  let ignore = false;

  async function loadRequests() {
    setLoadState('loading');
    setErrorMessage('');

    try {
      const data = await getRequests({ scenario });

      if (!ignore) {
        setRequests(data);
        setLoadState('success');
      }
    } catch (loadError) {
      if (!ignore) {
        setErrorMessage(loadError.message);
        setLoadState('error');
      }
    }
  }

  loadRequests();

  return () => {
    ignore = true;
  };
}, [scenario, reloadKey]);

function handleRetry() {
  if (scenario === 'error') {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('scenario');
    setSearchParams(nextParams);
    return;
  }

  reload();
}
  const summary = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((request) => request.status === 'pending').length,
    inProgress: requests.filter((request) => request.status === 'in-progress').length,
    completed: requests.filter((request) => request.status === 'completed').length,
  }), [requests]);

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter((request) => request.status === statusFilter);

if (loadState === 'loading') {    return (
      <section data-testid="page-dashboard">
        <LoadingState />
      </section>
    );
  }

if (loadState === 'error') {
  return (
    <section data-testid="page-dashboard">
<ErrorState
  message={errorMessage}
  onRetry={handleRetry}
/>
    </section>
  );
}

if (loadState === 'success' && requests.length === 0) {
    return (
      <section data-testid="page-dashboard">
        <div className="page-heading">
          <div>
            <p className="eyebrow dark">CP03 · EMPTY STATE</p>
            <h1>Campus Service Request</h1>
            <p>ไม่พบรายการคำร้อง</p>
          </div>
        </div>

        <div
          className="state-card"
          data-testid="empty-state"
          role="status"
        >
          <h2>ยังไม่มีรายการคำร้อง</h2>
          <p>ตอนนี้ยังไม่มีข้อมูลคำร้องให้แสดง</p>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="page-dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">CP03 · SERVICE + EFFECT</p>
          <h1>Campus Service Request</h1>
          <p>รายการคำร้องที่โหลดผ่าน Service Layer</p>
        </div>
      </div>

      {notice && <p className="notice" role="status">{notice}</p>}

      <SummaryPanel summary={summary} />

      <div className="workspace-grid">
        <section className="panel form-panel">
          <RequestForm
            onAddRequest={() => {}}
          />
        </section>

        <section className="panel" aria-labelledby="request-list-title">
          <div className="section-heading">
            <h2 id="request-list-title">รายการคำร้อง</h2>
            <FilterBar
              value={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>

          <RequestList
            requests={filteredRequests}
            onDeleteRequest={() => {}}
          />
        </section>
      </div>
    </section>
  );
}

export default DashboardPage;
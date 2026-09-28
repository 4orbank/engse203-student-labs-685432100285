import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar.jsx';
import RequestList from '../components/RequestList.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { deleteRequest, getRequests, resetRequests } from '../services/requestService.js';
import useManualReload from '../hooks/useManualReload.js';

function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [reloadKey, reload] = useManualReload();
  const [searchParams, setSearchParams] = useSearchParams();
  const scenario = searchParams.get('scenario') ?? undefined;

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setErrorMessage('');

    getRequests({ scenario, onRecovery: setNotice })
      .then((data) => {
        if (!active) return;
        setRequests(data);
        setStatus('success');
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : 'โหลดข้อมูลไม่สำเร็จ');
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [scenario, reloadKey]);

  const summary = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((request) => request.status === 'pending').length,
    inProgress: requests.filter((request) => request.status === 'in-progress').length,
    completed: requests.filter((request) => request.status === 'completed').length,
  }), [requests]);

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter((request) => request.status === statusFilter);

  async function handleDelete(requestId) {
    try {
      const next = await deleteRequest(requestId);
      setRequests(next);
      setNotice('ลบคำร้อง ' + requestId + ' แล้ว');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'ลบคำร้องไม่สำเร็จ');
    }
  }

  async function handleReset() {
    try {
      const next = await resetRequests();
      setRequests(next);
      setStatusFilter('all');
      setNotice('คืนค่าข้อมูลตัวอย่างแล้ว');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'คืนค่าข้อมูลไม่สำเร็จ');
    }
  }

  return (
    <section data-testid="page-dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">CAMPUS SERVICE REQUEST</p>
          <h1>Dashboard</h1>
          <p>จัดการคำร้องและติดตามสถานะการดำเนินงาน</p>
        </div>
        <button className="button" type="button" data-testid="reset-button" onClick={handleReset}>Reset Demo Data</button>
      </div>

      {notice && <p className="notice" role="status">{notice}</p>}

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState
        message={errorMessage}
        onRetry={() => {
          if (scenario) {
            setSearchParams({});
          } else {
            reload();
          }
        }}
      />}
      {status === 'success' && requests.length === 0 && (
        <section className="state-card" data-testid="empty-state">
          <h2>ยังไม่มีคำร้อง</h2>
          <p>ไม่มีข้อมูลคำร้องให้แสดงในขณะนี้</p>
        </section>
      )}
      {status === 'success' && requests.length > 0 && (
        <>
          <SummaryPanel summary={summary} />
          <div className="workspace-grid">
            <section className="panel" aria-labelledby="request-list-title">
              <div className="section-heading">
                <h2 id="request-list-title">รายการคำร้อง</h2>
                <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
              </div>
              <RequestList requests={filteredRequests} onDeleteRequest={handleDelete} />
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardPage;

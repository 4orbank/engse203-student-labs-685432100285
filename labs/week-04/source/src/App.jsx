import { useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import FilterBar from './components/FilterBar.jsx';
import RequestForm from './components/RequestForm.jsx';
import RequestList from './components/RequestList.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import { initialRequests } from './data/initialRequests.js';

function App() {
  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = {
    total: requests.length,
    pending: requests.filter((request) => request.status === 'pending').length,
    inProgress: requests.filter((request) => request.status === 'in-progress').length,
    completed: requests.filter((request) => request.status === 'completed').length,
  };
  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter((request) => request.status === statusFilter);

  function handleAddRequest(requestData) {
    const newRequest = {
      id: `REQ-${Date.now()}`,
      ...requestData,
      status: 'pending',
    };

    setRequests((currentRequests) => [newRequest, ...currentRequests]);
  }

  function handleDeleteRequest(requestId) {
    setRequests((currentRequests) => (
      currentRequests.filter((request) => request.id !== requestId)
    ));
  }

  return (
    <>
      <AppHeader
        title="Campus Service Request"
        subtitle="แจ้งและติดตามคำร้องบริการภายในมหาวิทยาลัย"
      />

      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <div className="workspace-grid">
          <RequestForm onAddRequest={handleAddRequest} />
          <section className="panel">
            <h2>รายการคำร้อง</h2>
            <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
            <RequestList
              requests={filteredRequests}
              onDeleteRequest={handleDeleteRequest}
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;

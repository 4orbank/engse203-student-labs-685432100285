import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { getRequestById } from '../services/requestService.js';

function RequestDetailPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRequest() {
      try {
        setStatus('loading');
        setError('');

        const data = await getRequestById(requestId);

        if (data === null) {
          setStatus('not-found');
          return;
        }

        setRequest(data);
        setStatus('success');
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'ไม่สามารถโหลดข้อมูลคำร้องได้',
        );
        setStatus('error');
      }
    }

    loadRequest();
  }, [requestId]);

  if (status === 'loading') {
    return (
      <section data-testid="page-request-detail">
        <LoadingState />
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section data-testid="page-request-detail">
        <ErrorState message={error} />
      </section>
    );
  }

  if (status === 'not-found') {
    return (
      <section data-testid="page-request-detail">
        <div className="state-card">
          <p className="eyebrow dark">404 · REQUEST NOT FOUND</p>
          <h1>ไม่พบคำร้อง</h1>
          <p>ไม่พบคำร้องรหัส {requestId}</p>
          <Link className="button secondary inline" to="/">
            กลับหน้า Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">REQUEST DETAIL</p>
          <h1>รายละเอียดคำร้อง</h1>
          <p>ข้อมูลคำร้อง {request.id}</p>
        </div>
      </div>

      <section className="panel detail-card">
        <dl>
          <div>
            <dt>รหัสคำร้อง</dt>
            <dd>{request.id}</dd>
          </div>
          <div>
            <dt>ชื่อผู้แจ้ง</dt>
            <dd>{request.requesterName}</dd>
          </div>
          <div>
            <dt>ประเภท</dt>
            <dd>{request.requestType}</dd>
          </div>
          <div>
            <dt>สถานที่</dt>
            <dd>{request.location}</dd>
          </div>
          <div>
            <dt>รายละเอียด</dt>
            <dd>{request.details}</dd>
          </div>
          <div>
            <dt>ความเร่งด่วน</dt>
            <dd>{request.priority}</dd>
          </div>
          <div>
            <dt>สถานะ</dt>
            <dd>{request.status}</dd>
          </div>
        </dl>

        <p>
          <Link className="button secondary inline" to="/">
            กลับหน้า Dashboard
          </Link>
        </p>
      </section>
    </section>
  );
}

export default RequestDetailPage;
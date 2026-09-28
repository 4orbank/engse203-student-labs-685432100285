import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import LoadingState from '../components/LoadingState.jsx';
import { getRequestById } from '../services/requestService.js';

function RequestDetailPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loadState, setLoadState] = useState('loading');

  useEffect(() => {
    let ignore = false;

    async function loadRequest() {
      setLoadState('loading');

      const data = await getRequestById(requestId);

      if (!ignore) {
        setRequest(data);
        setLoadState('success');
      }
    }

    loadRequest();

    return () => {
      ignore = true;
    };
  }, [requestId]);

  if (loadState === 'loading') {
    return (
      <section data-testid="page-request-detail">
        <LoadingState message="กำลังโหลดรายละเอียดคำร้อง…" />
      </section>
    );
  }

  if (!request) {
    return (
      <section data-testid="page-request-detail">
        <div className="page-heading">
          <div>
            <p className="eyebrow dark">REQUEST NOT FOUND</p>
            <h1>ไม่พบคำร้อง</h1>
            <p>ไม่พบคำร้องรหัส {requestId}</p>
          </div>
        </div>

        <Link className="button secondary" to="/">
          กลับหน้ารายการคำร้อง
        </Link>
      </section>
    );
  }

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">REQUEST DETAIL</p>
          <h1>{request.id}</h1>
          <p>รายละเอียดคำร้อง</p>
        </div>
      </div>

      <div className="panel">
        <h2>{request.title}</h2>
        <p><strong>ผู้ยื่นคำร้อง:</strong> {request.requesterName}</p>
        <p><strong>ประเภท:</strong> {request.category}</p>
        <p><strong>รายละเอียด:</strong> {request.details}</p>
        <p><strong>ความเร่งด่วน:</strong> {request.priority}</p>
        <p><strong>สถานะ:</strong> {request.status}</p>
      </div>

      <Link className="button secondary" to="/">
        กลับหน้ารายการคำร้อง
      </Link>
    </section>
  );
}

export default RequestDetailPage;
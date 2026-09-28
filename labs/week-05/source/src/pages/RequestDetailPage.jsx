import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingState from '../components/LoadingState.jsx';
import { getRequestById } from '../services/requestService.js';

function RequestDetailPage() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    getRequestById(requestId)
      .then((result) => {
        if (!active) return;
        setRequest(result);
        setStatus(result ? 'success' : 'not-found');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [requestId]);

  if (status === 'loading') return <LoadingState />;
  if (status === 'not-found') {
    return (
      <section className="state-card" data-testid="request-detail-not-found">
        <h1>ไม่พบคำร้อง</h1>
        <p>ไม่พบคำร้องรหัส {requestId}</p>
        <Link className="button primary inline" to="/">กลับ Dashboard</Link>
      </section>
    );
  }
  if (status === 'error') {
    return (
      <section className="state-card error-state" role="alert">
        <h1>โหลดรายละเอียดไม่สำเร็จ</h1>
        <p>ไม่สามารถโหลดข้อมูลคำร้องได้</p>
        <Link className="button primary inline" to="/">กลับ Dashboard</Link>
      </section>
    );
  }

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">REQUEST DETAIL</p>
          <h1>{request.requestType}</h1>
          <p>{request.id}</p>
        </div>
      </div>
      <article className="panel prose">
        <p><strong>ผู้แจ้ง:</strong> {request.requesterName}</p>
        <p><strong>สถานที่:</strong> {request.location}</p>
        <p><strong>รายละเอียด:</strong> {request.details}</p>
        <p><strong>ความเร่งด่วน:</strong> {request.priority}</p>
        <p><strong>สถานะ:</strong> {request.status}</p>
        <Link className="button inline" to="/">กลับ Dashboard</Link>
      </article>
    </section>
  );
}

export default RequestDetailPage;

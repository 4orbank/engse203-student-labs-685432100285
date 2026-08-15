import RequestCard from './RequestCard.jsx';

function RequestList({ requests, onDeleteRequest }) {
  if (requests.length === 0) {
    return (
      <div className="empty-state" role="status">
        ไม่มีคำร้องในสถานะนี้ ลองเลือกตัวกรองอื่นหรือเพิ่มคำร้องใหม่
      </div>
    );
  }

  return (
    <div className="request-list">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}

export default RequestList;

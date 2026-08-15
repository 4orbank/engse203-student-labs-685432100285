function SummaryPanel({ summary }) {
  return (
    <section className="summary-grid" aria-label="สรุปจำนวนงาน">
      <article className="summary-card">
        <span>ทั้งหมด</span>
        <strong>{summary.total}</strong>
      </article>
      <article className="summary-card">
        <span>รอดำเนินการ</span>
        <strong>{summary.pending}</strong>
      </article>
      <article className="summary-card">
        <span>กำลังทำ</span>
        <strong>{summary.inProgress}</strong>
      </article>
      <article className="summary-card">
        <span>เสร็จสิ้น</span>
        <strong>{summary.completed}</strong>
      </article>
    </section>
  );
}

export default SummaryPanel;

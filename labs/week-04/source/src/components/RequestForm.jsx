import { useState } from 'react';

const initialFormData = {
  requesterName: '',
  requestType: '',
  location: '',
  details: '',
  priority: 'normal',
};

function validateRequest(formData) {
  const errors = {};

  if (formData.requesterName.trim().length < 2) errors.requesterName = 'กรุณาระบุชื่อผู้แจ้งอย่างน้อย 2 ตัวอักษร';
  if (!formData.requestType) errors.requestType = 'กรุณาเลือกประเภทคำร้อง';
  if (!formData.location.trim()) errors.location = 'กรุณาระบุสถานที่';
  if (formData.details.trim().length < 10) errors.details = 'กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร';
  if (!['normal', 'urgent'].includes(formData.priority)) errors.priority = 'กรุณาเลือกความเร่งด่วน';

  return errors;
}

function RequestForm({ onAddRequest }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setFeedback('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRequest(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback('ยังส่งคำร้องไม่ได้ กรุณาตรวจข้อมูลที่ระบุ');
      return;
    }

    onAddRequest({
      ...formData,
      requesterName: formData.requesterName.trim(),
      location: formData.location.trim(),
      details: formData.details.trim(),
    });
    setFormData(initialFormData);
    setFeedback('เพิ่มคำร้องใหม่เรียบร้อยแล้ว');
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <p className="eyebrow dark">CONTROLLED FORM</p>
      <h2 id="request-form-title">สร้างคำร้องใหม่</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>
          <input id="requesterName" name="requesterName" value={formData.requesterName} onChange={handleChange} aria-invalid={Boolean(errors.requesterName)} aria-describedby="requesterName-error" />
          <small className="error" id="requesterName-error">{errors.requesterName}</small>
        </div>
        <div className="field">
          <label htmlFor="requestType">ประเภทคำร้อง</label>
          <select id="requestType" name="requestType" value={formData.requestType} onChange={handleChange} aria-invalid={Boolean(errors.requestType)} aria-describedby="requestType-error">
            <option value="">-- เลือกประเภท --</option>
            <option value="แจ้งซ่อม">แจ้งซ่อม</option>
            <option value="ขอใช้ห้อง">ขอใช้ห้อง</option>
            <option value="บริการบัญชีผู้ใช้">บริการบัญชีผู้ใช้</option>
          </select>
          <small className="error" id="requestType-error">{errors.requestType}</small>
        </div>
        <div className="field">
          <label htmlFor="location">สถานที่</label>
          <input id="location" name="location" value={formData.location} onChange={handleChange} aria-invalid={Boolean(errors.location)} aria-describedby="location-error" />
          <small className="error" id="location-error">{errors.location}</small>
        </div>
        <div className="field">
          <label htmlFor="details">รายละเอียด</label>
          <textarea id="details" name="details" rows="4" value={formData.details} onChange={handleChange} aria-invalid={Boolean(errors.details)} aria-describedby="details-error" />
          <small className="error" id="details-error">{errors.details}</small>
        </div>
        <fieldset className="field">
          <legend>ความเร่งด่วน</legend>
          <label><input type="radio" name="priority" value="normal" checked={formData.priority === 'normal'} onChange={handleChange} /> ปกติ</label>
          <label><input type="radio" name="priority" value="urgent" checked={formData.priority === 'urgent'} onChange={handleChange} /> เร่งด่วน</label>
          <small className="error" id="priority-error">{errors.priority}</small>
        </fieldset>
        <button type="submit">เพิ่มคำร้อง</button>
        <p className="status" role="status">{feedback}</p>
      </form>
    </section>
  );
}

export default RequestForm;

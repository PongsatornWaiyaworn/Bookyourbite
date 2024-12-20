import React, { useState } from "react";

const RebookModal = ({ show, onClose, onSubmit }) => {
  // Hooks must always be called unconditionally
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);

  // Early return to skip rendering
  if (!show) return null;

  const handleSubmit = () => {
    onSubmit(date, time, people);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>จองใหม่อีกครั้ง</h2>
        <div>
          <label>วันที่:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="เช่น 29 / 10 / 2024"
          />
        </div>
        <div>
          <label>เวลา:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="เช่น 20:30"
          />
        </div>
        <div>
          <label>จำนวนคน:</label>
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
          />
        </div>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>จองเลย</button>
          <button onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
};

export default RebookModal;

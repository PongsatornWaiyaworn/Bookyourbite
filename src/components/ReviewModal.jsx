import React, { useState } from "react";
import './ReviewModal.css'

const ReviewModal = ({ show, onClose, onSubmit }) => {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  
  if (!show) return null;

  const handleSubmit = () => {
      onSubmit(score, comment);
  };

  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <h2>รีวิวการจอง</h2>
              <div>
                  <label>คะแนน (1-5):</label>
                  <input
                      type="number"
                      min="1"
                      max="5"
                      value={score}
                      onChange={(e) =>
                          setScore(Math.min(5, Math.max(1, Number(e.target.value))))
                      }
                  />
              </div>
              <div>
                  <label>ความคิดเห็น:</label>
                  <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="ใส่ความคิดเห็นที่นี่..."
                  />
              </div>
              <div className="modal-buttons">
                  <button onClick={handleSubmit}>ส่งรีวิว</button>
                  <button onClick={onClose}>ปิด</button>
              </div>
          </div>
      </div>
  );
};

export default ReviewModal;

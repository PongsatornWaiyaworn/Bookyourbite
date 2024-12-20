import { useState, useEffect } from 'react';
import './ReservationList.css';
import ReviewModal from './ReviewModal';
import RebookModal from './RebookModal';

const ReservationList = () => {
  const [activePage, setActivePage] = useState('myReservations');
  const [showModal, setShowModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [showRebookModal, setShowRebookModal] = useState(false);
  const [currentRebook, setCurrentRebook] = useState(null);
  const [reservations, setReservations] = useState({
    myReservations: [],
    completed: [],
    canceled: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/orderC', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        console.log(data);

        // แยกข้อมูลตามสถานะต่างๆ
        const myReservations = data.filter((reservation) => reservation.status === 'ยืนยันแล้ว' ||  reservation.status === 'รอการยืนยัน');
        const completed = data.filter((reservation) => reservation.status === 'เสร็จสิ้น');
        const canceled = data.filter((reservation) => reservation.status === 'ยกเลิก');

        setReservations({
          myReservations,
          completed,
          canceled,
        });
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchData();
  }, []);

  const renderReservations = (list) => {
    return list.map((reservation) => (
      <div key={reservation.id} className="reservation-card">
        <div className="reservation-details">
          <h3>{reservation.restaurantName}</h3>
          <p>ประเภท: {reservation.restaurantType}</p>
          <p>ที่อยู่: {reservation.address}</p>
          <p>เบอร์โทร: {reservation.phone}</p>
        </div>
        <div className="reservation-info">
          <p>วันที่: {reservation.date}</p>
          <p>เวลา: {reservation.time}</p>
          <p>จำนวน: {reservation.people} คน</p>
          <p
            className={
              reservation.status === 'ยืนยันแล้ว'
                ? 'status-confirmed'
                : reservation.status === 'ยกเลิก'
                ? 'status-cancel'
                : 'status-pending'
            }
          >
            {reservation.status}
          </p>

          {/* ปุ่มสำหรับหน้าการจองของฉัน */}
          {activePage === 'myReservations' && (
            <button
              className="cancel-button"
              onClick={() => handleCancel(reservation.id)}
            >
              ยกเลิก
            </button>
          )}

          {/* ปุ่มสำหรับหน้าการยกเลิก */}
          {activePage === 'canceled' && (
            <button
              className="rebook-button"
              onClick={() => handleRebook(reservation)}
            >
              จองใหม่อีกครั้ง
            </button>
          )}

          {/* ปุ่มสำหรับหน้าที่เสร็จสิ้น */}
          {activePage === 'completed' && (
            <button
              className="review-button"
              onClick={() => handleReview(reservation)}
            >
              รีวิวการจอง
            </button>
          )}
        </div>
      </div>
    ));
  };

  const handleCancel = async (id) => {
    setReservations((prevReservations) => {
      const updatedMyReservations = prevReservations.myReservations.filter(
        (reservation) => reservation.id !== id
      );

      const canceledReservation = prevReservations.myReservations.find(
        (reservation) => reservation.id === id
      );

      if (canceledReservation) {
        canceledReservation.status = 'ยกเลิก';
        console.log(id);
        // ส่งคำขอไปที่ API เพื่ออัพเดตสถานะคำสั่งเป็น "ยกเลิก"
        fetch('http://localhost:3000/api/updatecancel', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: id, cancel: true }),
          credentials: 'include',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to cancel order');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Order cancelled:', data);
          })
          .catch((error) => {
            console.error('Error cancelling order:', error);
          });

        return {
          ...prevReservations,
          myReservations: updatedMyReservations,
          canceled: [...prevReservations.canceled, canceledReservation],
        };
      }

      return prevReservations;
    });

    setActivePage('canceled');
  };

  const handleReview = (reservation) => {
    setCurrentReview(reservation);
    setShowModal(true);
  };

  const handleSubmitReview = (score, comment) => {
    alert(`คุณได้ให้คะแนน ${score} และแสดงความคิดเห็น: "${comment}" สำหรับ ${currentReview.restaurantName}`);

    // ส่งข้อมูลรีวิวไปที่ API
    fetch('http://localhost:3000/api/submitReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: currentReview.id,
        score,
        comment,
      }),
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit review');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Review submitted:', data);
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
      });

    setShowModal(false);
  };

  const handleRebook = (reservation) => {
    setCurrentRebook(reservation);
    setShowRebookModal(true);
  };

  const handleSubmitRebook = (date, time, people) => {
    // ส่งคำขอจองใหม่ไปที่ API
    fetch('http://localhost:3000/api/rebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: currentRebook.id,
        date,
        time,
        people,
      }),
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to rebook');
        }
        return response.json();
      })
      .then((data) => {
        setReservations((prevReservations) => ({
          ...prevReservations,
          myReservations: [
            ...prevReservations.myReservations,
            {
              ...currentRebook,
              date,
              time,
              people,
              status: 'รอการยืนยัน',
            },
          ],
          canceled: prevReservations.canceled.filter(
            (reservation) => reservation.id !== currentRebook.id
          ),
        }));
        alert('จองใหม่สำเร็จ!');
        setShowRebookModal(false);
      })
      .catch((error) => {
        console.error('Error rebooking order:', error);
      });
  };

  return (
    <div className="reservation-list">
      <header className="header">
        <ul className="Menu-1">
          <li
            id="item"
            className={activePage === 'myReservations' ? 'Active' : ''}
            onClick={() => setActivePage('myReservations')}
          >
            การจองของฉัน
          </li>
          <li
            id="item"
            className={activePage === 'completed' ? 'Active' : ''}
            onClick={() => setActivePage('completed')}
          >
            เสร็จสิ้น
          </li>
          <li
            id="item"
            className={activePage === 'canceled' ? 'Active' : ''}
            onClick={() => setActivePage('canceled')}
          >
            ยกเลิก
          </li>
        </ul>
      </header>
      <div className="reservation-container">
        {activePage === 'myReservations' &&
          renderReservations(reservations.myReservations)}
        {activePage === 'completed' &&
          renderReservations(reservations.completed)}
        {activePage === 'canceled' &&
          renderReservations(reservations.canceled)}
      </div>
      <ReviewModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitReview}
      />
      <RebookModal
        show={showRebookModal}
        onClose={() => setShowRebookModal(false)}
        onSubmit={handleSubmitRebook}
      />
    </div>
  );
};

export default ReservationList;

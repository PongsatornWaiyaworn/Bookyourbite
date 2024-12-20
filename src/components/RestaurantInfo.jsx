import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./RestaurantInfo.css";

const RestaurantInfo = () => {
    const { name } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reservation, setReservation] = useState({
        date: "",
        time: "",
        people: "",
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะการล็อกอิน

    // เช็คสถานะการล็อกอินจาก API
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/users/check-auth", {
                    credentials: "include", // เพิ่ม credentials เพื่อส่ง cookie ไปกับคำขอ
                });

                if (!response.ok) {
                    throw new Error("ไม่สามารถตรวจสอบสถานะการล็อกอินได้");
                }

                const data = await response.json();
                if (data.loggedIn) {
                    setIsLoggedIn(true); // ถ้าผู้ใช้ล็อกอิน
                } else {
                    setIsLoggedIn(false); // ถ้าผู้ใช้ไม่ได้ล็อกอิน
                }
            } catch (error) {
                console.error(error);
                setIsLoggedIn(false); // กรณีเกิดข้อผิดพลาดในการเช็คสถานะ
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (!name) {
            setRestaurant(null);
            return;
        }
    
        const controller = new AbortController(); 
    
        const fetchRestaurant = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/restaurant/search?q=${name}`, { credentials: 'include' });
                    const data = await response.json();
                    setRestaurant(data);
                } catch (error) {
                    console.error('Error:', error);
                }
        };
    
        fetchRestaurant();
    
        return () => {
            controller.abort(); // ยกเลิกการร้องขอเมื่อคอมโพเนนต์ถูกยกเลิกการเรนเดอร์
        };
    }, [name]);

    const handleReservationChange = (e) => {
        const { name, value } = e.target;
        setReservation({ ...reservation, [name]: value });
    };

    console.log(restaurant);
    
    const check = async () => {
        if(isLoggedIn){
            setIsModalOpen(true)
        }else{
            alert("กรุณาเข้าสู่ระบบก่อน");
        }
    }
    
        const handleSubmitReservation = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:3000/api/order", {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
    
                    body: JSON.stringify({
                        usernameStore: restaurant[0].username,
                        date: reservation.date,
                        time: reservation.time,
                        num_people: reservation.people,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("Failed to submit reservation");
                }
    
                const data = await response.json();
                alert(`จองสำเร็จสำหรับวันที่ ${reservation.date} เวลา ${reservation.time} จำนวน ${reservation.people} คน`);
            } catch (error) {
                console.error("Error submitting reservation:", error);
                alert("เกิดข้อผิดพลาดในการจอง");
            } finally {
                setLoading(false);
                setIsModalOpen(false); // ปิด modal หลังการจอง
            }
        };

    if (!restaurant) return <p>กำลังโหลดข้อมูล หรือ ข้อมูลร้านไม่พบ...</p>;
    console.log(reservation);
    return (
        <div className="restaurant-info-container" id="modal-overlay">
            <h2>ร้าน: {restaurant[0].name}</h2>
            <img
                src={restaurant[0].ImageView}
                alt={restaurant[0].name}
                className="restaurant-image"
            />
            <div className="con">
                <img
                    src={restaurant[0].ImageProfile}
                    alt={restaurant[0].name}
                    className="restaurant-image-Pro"
                />
                <div>
                    <p>ประเภท: {restaurant[0].CuisineType}</p>
                    <p>ที่อยู่: {restaurant[0].address}</p>
                    <p>เบอร์โทร: {restaurant[0].phone}</p>
                    <p>เวลาเปิด: {restaurant[0].OpeningHours_start} - {restaurant[0].OpeningHours_end}</p>
                </div>
            </div>
                <div className="btn-jong">
                    <button className="reserve-button" onClick={check}>
                        จอง
                    </button>
                </div>


            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setIsModalOpen(false)}>
                            X
                        </button>
                        <h3>การจอง</h3>
                        {loading ? (
                            <div className="loading">กำลังจอง...</div>
                        ) : (
                            <form onSubmit={(e) => e.preventDefault()}>
                                <label>
                                    วันที่:
                                    <input
                                        type="date"
                                        name="date"
                                        value={reservation.date}
                                        onChange={handleReservationChange}
                                        required
                                    />
                                </label>
                                <label>
                                    เวลา:
                                    <input
                                        type="time"
                                        name="time"
                                        value={reservation.time}
                                        onChange={handleReservationChange}
                                        required
                                    />
                                </label>
                                <label>
                                    จำนวนคน:
                                    <input
                                        type="number"
                                        name="people"
                                        min="1"
                                        value={reservation.people}
                                        onChange={handleReservationChange}
                                        required
                                    />
                                </label>
                                <button onClick={handleSubmitReservation} className="submit-button">
                                    ยืนยันการจอง
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantInfo;

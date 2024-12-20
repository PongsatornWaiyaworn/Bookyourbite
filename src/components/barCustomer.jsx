import React, { useState, useEffect } from "react";
import './barCustomer.css';

const Bar = () => {
    const [activeItem, setActiveItem] = useState("Order");
    const [orders, setOrders] = useState([]);
    const [restaurants, setRestaurants] = useState({});
    const port = 3000;

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:${port}/api/order`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);

                const restaurantData = {};
                for (const order of data) {
                    if (!restaurantData[order.usernameStore]) {
                        const res = await fetch(`http://localhost:${port}/api/restaurant/searchusername?username=${order.usernameStore}`, { credentials: 'include' });
                        if (res.ok) {
                            const restData = await res.json();
                            restaurantData[order.usernameStore] = restData[0];
                        }
                    }
                }
                setRestaurants(restaurantData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchOrders();
    }, []);

    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         try {
    //             // เรียก API เพื่อเคลียร์ออเดอร์เกิน 30 วัน
    //             const clearResponse = await fetch(`http://localhost:${port}/api/clear-old-orders`, {
    //                 method: 'DELETE',
    //                 credentials: 'include',
    //             });
    //             if (clearResponse.ok) {
    //                 console.log("Expired orders cleared successfully");
    //             } else {
    //                 console.error("Failed to clear expired orders");
    //             }

    //             // ดึงออเดอร์ทั้งหมด
    //             const response = await fetch(`http://localhost:${port}/api/order`, { credentials: 'include' });
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch orders');
    //             }
    //             const data = await response.json();
    //             setOrders(data);

    //             // ดึงข้อมูลร้านอาหาร
    //             const restaurantData = {};
    //             for (const order of data) {
    //                 if (!restaurantData[order.usernameStore]) {
    //                     const res = await fetch(`http://localhost:${port}/api/restaurant/searchusername?username=${order.usernameStore}`, { credentials: 'include' });
    //                     if (res.ok) {
    //                         const restData = await res.json();
    //                         restaurantData[order.usernameStore] = restData[0];
    //                     }
    //                 }
    //             }
    //             setRestaurants(restaurantData);

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchOrders();
    // }, [port]);
 
    const upcancel = async (orderId) => {
        try {
            // ส่งคำขอ PUT ไปยัง API
            const response = await fetch(`http://localhost:${port}/api/cancelorder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                },
                credentials: 'include', 
                body: JSON.stringify({ orderId }),
            });

            // ตรวจสอบสถานะการตอบกลับ
            if (response.ok) {
                const result = await response.json();
                console.log('Order cancelled successfully:', result);
                alert('ยกเลิกสำเร็จ');
                window.location.reload();
            } else {
                const errorMessage = await response.text();
                console.error('Failed to cancel order:', errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error during cancel request:', error);
            alert('An error occurred while cancelling the order.');
        }
    };
    const upfinish = async (orderId) => {
        try {
            // ส่งคำขอ PUT ไปยัง API
            const response = await fetch(`http://localhost:${port}/api/finishorder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                },
                credentials: 'include', 
                body: JSON.stringify({ orderId }),
            });

            // ตรวจสอบสถานะการตอบกลับ
            if (response.ok) {
                const result = await response.json();
                console.log('Order cancelled successfully:', result);
                alert('ยืนยันสำเร็จ');
                window.location.reload();

            } else {
                const errorMessage = await response.text();
                console.error('Failed to cancel order:', errorMessage);
                alert(`ยืนยันไม่สำเร็จ`);
            }
        } catch (error) {
            console.error('Error during cancel request:', error);
            alert('ยืนยันไม่สำเร็จ');
        }
    };
    return (
        <>
            <ul className="Menu">
                <li
                    id="item"
                    className={activeItem === "Order" ? "Active" : ""}
                    onClick={() => handleItemClick("Order")}
                >
                    Order
                </li>
                <li
                    id="item"
                    className={activeItem === "finish" ? "Active" : ""}
                    onClick={() => handleItemClick("finish")}
                >
                    เสร็จสิ้น
                </li>
                <li
                    id="item"
                    className={activeItem === "cancel" ? "Active" : ""}
                    onClick={() => handleItemClick("cancel")}
                >
                    ยกเลิก
                </li>
            </ul>
            <div className="list">
                {activeItem === "Order" ? (
                    <ul>
                        {orders.map((order, index) => {
                            const restaurant = restaurants[order.usernameStore] || {};
                            if (order.status || order.cancel) {
                                // eslint-disable-next-line array-callback-return
                                return;
                            }
                            return (
                                <li key={index} className="order-item">
                                    <div id="restaurant-e">
                                        <h1>ร้าน {restaurant.name}</h1>
                                        <div>ร้าน:{restaurant.name}</div>
                                        <div>ประเภทอาหาร:{restaurant.CuisineType}</div>
                                        <div>เวลาทำการ:{restaurant.OpeningHours_start}-{restaurant.OpeningHours_end}</div>
                                    </div>
                                    <div id="order-e">
                                        <h1>การจอง</h1>
                                        <div>วันที่ {order.date}</div>
                                        <div>เวลา {order.time}</div>
                                        <div>จำนวน {order.num_people} คน</div>
                                    </div>
                                    <div>
                                    <button className="accept-button" onClick={() => upfinish(order._id)}>ยืนยัน</button>
                                    <button className="cancel-button" onClick={() => upcancel(order._id)}>ยกเลิก</button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : activeItem === "finish" ? (
                    <ul>
                        {orders.map((order, index) => {
                            const restaurant = restaurants[order.usernameStore] || {};
                            if (!order.status || order.cancel) {
                                // eslint-disable-next-line array-callback-return
                                return;
                            }
                            return (
                                <li key={index} className="order-item">
                                    <div id="restaurant-e">
                                        <h1>ร้าน {restaurant.name}</h1>
                                        <div>ร้าน:{restaurant.name}</div>
                                        <div>ประเภทอาหาร:{restaurant.CuisineType}</div>
                                        <div>เวลาทำการ:{restaurant.OpeningHours_start}-{restaurant.OpeningHours_end}</div>
                                    </div>
                                    <div id="order-e">
                                        <h1>การจอง</h1>
                                        <div>วันที่ {order.date}</div>
                                        <div>เวลา {order.time}</div>
                                        <div>จำนวน {order.num_people} คน</div>
                                    </div>
                                    <div>
                                    <button className="cancel-button" onClick={() => upcancel(order._id)}>ยกเลิก</button> 
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : activeItem === "cancel" ? (
                    <ul>
                        {orders.map((order, index) => {
                            const restaurant = restaurants[order.usernameStore] || {};
                            if (!order.cancel) {
                                // eslint-disable-next-line array-callback-return
                                return;
                            }
                            return (
                                <li key={index} className="order-item">
                                    <div id="restaurant-e">
                                        <h1>ร้าน {restaurant.name}</h1>
                                        <div>ร้าน:{restaurant.name}</div>
                                        <div>ประเภทอาหาร:{restaurant.CuisineType}</div>
                                        <div>เวลาทำการ:{restaurant.OpeningHours_start}-{restaurant.OpeningHours_end}</div>
                                    </div>
                                    <div id="order-e">
                                        <h1>การจอง</h1>
                                        <div>วันที่ {order.date}</div>
                                        <div>เวลา {order.time}</div>
                                        <div>จำนวน {order.num_people} คน</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) :
                ( 
                    <div>ไม่มี</div>
                )}
            </div>
        </>
    );
};

export default Bar;

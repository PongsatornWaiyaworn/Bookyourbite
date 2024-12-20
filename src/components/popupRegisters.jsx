import React, { useState } from 'react';
import './popupRegisters.css';

// const { generateOTP, sendOTP } = require('../OTP/OTP');

const PopupRegisters = ({ 
    isSignupPopupOpen, 
    setSignupPopupOpen, 
    activeTab, 
    setActiveTab 
}) => {
    const [loading, setLoading] = useState(false);

    const server = 3000;

    const openTab = (tabName) => {
        setActiveTab(tabName);
    };

    // ฟังก์ชันสมัครสมาชิกแบบ Customer
    const handleCustomerSignUp = async (e) => {
        e.preventDefault();
        
        const customerData = {
            username: e.target['customer-username'].value,
            name: e.target['customer-name'].value,
            password: e.target['customer-password'].value,
            phone: e.target['customer-phone'].value,
            email: e.target['customer-email'].value,
            address: e.target['customer-address'].value,
            role: "customer"
        };

        const confirm = e.target['customer-confirm-password'].value;

        if (customerData.password !== confirm) {
            alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!");
            return;
        }

        if (!customerData.username || !customerData.name || !customerData.password || !confirm || !customerData.phone || !customerData.email || !customerData.address) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
            return;
        }

        setLoading(true); // แสดง loading indicator

        try {
            const response = await fetch(`http://localhost:${server}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(customerData)
            });
            const result = await response.json();
            if (result.success) {
               alert("สมัครสมาชิกเรียบร้อยแล้ว!");
               setSignupPopupOpen(false);  // ปิดป็อปอัพเมื่อสำเร็จ
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        } finally {
            setLoading(false); // ซ่อน loading indicator
        }
    };

    const base64 = async (path) => {
        try {
            const response = await fetch(path);
            if (!response) {
                throw new Error("fetch err.");
            }
            const blob = await response.blob();
            
            return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result); // คืนค่า Base64
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(blob); 
            });
        } catch (error) {
            console.error("Error fetching and converting image:", error);
            throw error; 
        }
    };

    // ฟังก์ชันสมัครสมาชิกแบบ Store
    const handleStoreSignUp = async (e) => {
        e.preventDefault();

        const storeData = {
            username: e.target['store-username'].value,
            password: e.target['store-password'].value,
            email: e.target['store-email'].value,
            role: "store"
        };

        const confirm = e.target['store-confirm-password'].value;

        if (storeData.password !== confirm) {
            alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!");
            return;
        }

        const RestaurantData = {
            username: e.target['store-username'].value,
            name: e.target['store-name'].value,
            CuisineType: e.target['store-type'].value,
            address: e.target['store-address'].value,
            phone: e.target['store-phone'].value,
            OpeningHours_start: e.target['store-time-start'].value,
            OpeningHours_end: e.target['store-time-end'].value,
            ImageProfile: await base64('/imageForDefault/ProfileDefault.png'),
            ImageView: await base64('/imageForDefault/ViewDefault.png'),
        };

        console.log(storeData.username , RestaurantData.name , storeData.password , storeData.email , RestaurantData.address , RestaurantData.CuisineType);
        console.log(RestaurantData.ImageProfile);
        if (!storeData.username || !RestaurantData.name || !storeData.password || !RestaurantData.phone || !storeData.email || !RestaurantData.address || !RestaurantData.CuisineType ) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
            return;
        }

        setLoading(true); // แสดง loading indicator

        try {
            const response = await fetch(`http://localhost:${server}/api/restaurant/upDefault`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(RestaurantData)
            });
            const result = await response.json();
            if (result.success) {
                console.log("ตั้งค่าเริ่มต้นสำเร็จ!");
            } else {
                alert(result.message);
                return;
            }
        } catch (error) {
            console.error("Error:", error);
            console.log("ตั้งค่าเริ่มต้นไม่สำเร็จ!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:${server}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storeData)
            });
            const result = await response.json();
            if (result.success) {
                alert("สมัครสมาชิกเรียบร้อยแล้ว!");
                setSignupPopupOpen(false);  // ปิดป็อปอัพเมื่อสำเร็จ
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        } finally {
            setLoading(false); // ซ่อน loading indicator
        }
    };
    
    return (
        <div 
            id="signupPopup" 
            className="popup" 
            style={{ 
                display: isSignupPopupOpen ? 'flex' : 'none', 
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'fixed', 
                top: '0', 
                left: '0', 
                right: '0', 
                bottom: '0', 
                backgroundColor: 'rgba(0,0,0,0.5)' 
            }}
        >
            <div className="popup-content" style={{ background: 'white', padding: '20px', borderRadius: '10px', position: 'relative' }}>
                <span className="close-btn" onClick={() => setSignupPopupOpen(false)}>&times;</span>
                <h2>ลงทะเบียน</h2>

                <div className="tabs">
                    <button 
                        className={`tablinks ${activeTab === 'customer' ? 'active' : ''}`} 
                        onClick={() => openTab('customer')}
                    >
                        User
                    </button>
                    <button 
                        className={`tablinks ${activeTab === 'store' ? 'active' : ''}`} 
                        onClick={() => openTab('store')}
                    >
                        Restaurant
                    </button>
                </div>

                <div 
                    id="customer" 
                    className="tabcontent" 
                    style={{ display: activeTab === 'customer' ? 'block' : 'none' }}
                >
                    <form onSubmit={handleCustomerSignUp}>
                        <div id="input">
                            <div>
                                <label htmlFor="customer-username">Username</label>
                                <input type="text" id="customer-username" name="customer-username" required />
                            </div>
                            <div>
                                <label htmlFor="customer-name">Name</label>
                                <input type="text" id="customer-name" name="customer-name" required />
                            </div>
                            <div>
                                <label htmlFor="customer-password">Password</label>
                                <input type="password" id="customer-password" name="customer-password" required />
                            </div>
                            <div>
                                <label htmlFor="customer-confirm-password">Confirm password</label>
                                <input type="password" id="customer-confirm-password" name="customer-confirm-password" required />
                            </div>
                            <div>
                                <label htmlFor="customer-phone">Phone</label>
                                <input type="tel" id="customer-phone" name="customer-phone" required />
                            </div>
                            <div>
                                <label htmlFor="customer-email">Email</label>
                                <input type="email" id="customer-email" name="customer-email" required />
                            </div>
                            <div id="address">
                                <label htmlFor="customer-address">Address</label>
                                <textarea id="customer-address" name="customer-address" rows="4" className="no-resize" required></textarea>
                            </div>
                        </div>
                        <div className="btn-signup">
                            <button type="submit" id="customer-signup" disabled={loading}>
                                {loading ? 'กำลังลงทะเบียน...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>

                <div 
                    id="store" 
                    className="tabcontent" 
                    style={{ display: activeTab === 'store' ? 'block' : 'none' }}
                >
                    <form onSubmit={handleStoreSignUp}>
                        <div id="input">
                            <div>
                                <label htmlFor="store-username">Username</label>
                                <input type="text" id="store-username" name="store-username" required />
                            </div>
                            <div>
                                <label htmlFor="store-name">Name restaurant</label>
                                <input type="text" id="store-name" name="store-name" required />
                            </div>
                            <div>
                                <label htmlFor="store-password">Password</label>
                                <input type="password" id="store-password" name="store-password" required />
                            </div>
                            <div>
                                <label htmlFor="store-confirm-password">Confirm password</label>
                                <input type="password" id="store-confirm-password" name="store-confirm-password" required />
                            </div>
                            <div>
                                <label htmlFor="store-phone">Phone</label>
                                <input type="tel" id="store-phone" name="store-phone" required />
                            </div>
                            <div>
                                <label htmlFor="store-email">Email</label>
                                <input type="email" id="store-email" name="store-email" required />
                            </div>
                            <div className='select-type'>
                                <label htmlFor="store-type">ประเภทอาหาร</label>
                                <select id="store-type" name="store-type" required>
                                    <option value="">--เลือกประเภทอาหาร--</option>
                                    <option value="thai">อาหารไทย</option>
                                    <option value="japanese">อาหารญี่ปุ่น</option>
                                    <option value="italian">อาหารอิตาเลียน</option>
                                    <option value="chinese">อาหารจีน</option>
                                    <option value="else">อื่นๆ</option>
                                </select>
                            </div>
                            <div className="store-hours">
                                <label htmlFor="store-time-start">เวลาทำการ</label>
                                <div className='input-time'>
                                    <span> เปิด: </span>
                                    <input type="time" id="store-time-start" name="store-time-start" required />
                                    <span> ถึง: </span>
                                    <input type="time" id="store-time-end" name="store-time-end" required />
                                </div>
                            </div>
                            <div id="address">
                                <label htmlFor="store-address">Address</label>
                                <textarea id="store-address" name="store-address" rows="4" className="no-resize" required></textarea>
                            </div>
                        </div>
                        <div className="btn-signup">
                            <button type="submit" id="store-signup" disabled={loading}>
                                {loading ? 'กำลังลงทะเบียน...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PopupRegisters;
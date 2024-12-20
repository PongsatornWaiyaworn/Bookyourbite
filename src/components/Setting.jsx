import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Setting.css';


const App = () => {
  // State สำหรับเก็บข้อมูลฟอร์ม
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        phone: "",
        address: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // ฟังก์ชันในการเปลี่ยนแปลงค่าของฟอร์ม
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ดึงข้อมูลผู้ใช้จาก API ตอนเริ่มต้น
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/user/profile', {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setFormData({
                    fullname: data.name || "",
                    username: data.username || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // ฟังก์ชันในการส่งข้อมูลไปยัง API สำหรับอัปเดตข้อมูลผู้ใช้
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน!");
            console.log(formData.newPassword, formData.confirmPassword);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullname: formData.fullname,
                    phone: formData.phone,
                    address: formData.address,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
              
            alert('บันทึกข้อมูลสำเร็จ!');
            navigate('/');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    return (
        <div className="container">
            <h2>ตั้งค่าบัญชี</h2>
            <form onSubmit={handleSubmit}>
                {/* Fullname Input */}
                <div className="form-group">
                    <label className="form-label">Fullname</label>
                    <input
                        type="text"
                        name="fullname"
                        className="form-input"
                        value={formData.fullname}
                        onChange={handleChange}
                    />
                </div>

                {/* Username Input */}
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        name="username"
                        className="form-input"
                        value={formData.username}
                        disabled
                    />
                </div>

                {/* Phone Input */}
                <div className="form-group">
                    <label className="form-label">Phone number</label>
                    <input
                        type="text"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                {/* Address Input */}
                <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea
                        name="address"
                        className="form-input"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <h2>เปลี่ยนรหัสผ่าน</h2>

                {/* Old Password Input */}
                <div className="form-group">
                    <label className="form-label">Old Password</label>
                    <input
                        type="password"
                        name="oldPassword"
                        className="form-input"
                        value={formData.oldPassword}
                        onChange={handleChange}
                    />
                </div>

                {/* New Password Input */}
                <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        className="form-input"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                </div>

                {/* Confirm New Password Input */}
                <div className="form-group">
                    <label className="form-label">Confirm new Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="form-input"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-change">
                    Change
                </button>
            </form>
        </div>
    );
};

export default App;

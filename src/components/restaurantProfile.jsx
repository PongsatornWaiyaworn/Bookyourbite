import React, { useState, useEffect } from "react";
import axios from 'axios';
import './restaurantProfile.css';
const port = 3000;

const RestaurantProfile = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [checkedit,setCheckedit] = useState(false);
    const [previewView, setPreviewView] = useState(null);
    const [fileView, setFileView] = useState(null); 
    const [previewProfile, setPreviewProfile] = useState(null);
    const [fileProfile, setFileProfile] = useState(null);
    
    const server = 3000;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:${port}/api/restaurant/searchusername`, {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurants");
                }
                const data = await response.json();
                if (!previewView){
                    setPreviewView(data[0].ImageView);
                }
                if (!previewProfile){
                    setPreviewProfile(data[0].ImageProfile);
                }
                setRestaurants(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []); 

    const toggleEdit = () => {
        setCheckedit((prev) => !prev);
    };

    const cancel = () => {
        window.location.reload();
    }

    const resizeImage = (file, maxWidth, maxHeight) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
            
            img.onload = () => {
                // สร้าง <canvas> เพื่อปรับขนาดภาพ
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                
                let width = img.width;
                let height = img.height;
                
                // ปรับขนาดภาพหากภาพมีขนาดใหญ่กว่า maxWidth หรือ maxHeight
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // วาดภาพลงใน <canvas>
                ctx.drawImage(img, 0, 0, width, height);
                
                // สร้าง Blob เพื่อใช้ในการส่ง
                canvas.toBlob((blob) => {
                    resolve(blob);  // คืนค่าภาพที่ถูกปรับขนาด
                }, 'image/jpeg', 0.8);  // บีบอัดเป็น JPEG ที่ 80% คุณภาพ
            };
            
            img.onerror = reject;
        });
    };
    
    // ตัวอย่างการใช้งานใน handleFileChangeView และ handleFileChangeProfile
    const handleFileChangeView = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const resizedFile = await resizeImage(selectedFile, 800, 800); // ปรับขนาดให้สูงสุดที่ 800px
            setFileView(resizedFile);  // ตั้งค่าภาพที่ปรับขนาดแล้ว
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewView(reader.result); // แสดงผลการดูภาพ
            };
            reader.readAsDataURL(resizedFile); // แปลงภาพที่ปรับขนาดแล้วเป็น base64
        }
    };
    
    const handleFileChangeProfile = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const resizedFile = await resizeImage(selectedFile, 800, 800); // ปรับขนาดให้สูงสุดที่ 800px
            setFileProfile(resizedFile);  // ตั้งค่าภาพที่ปรับขนาดแล้ว
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewProfile(reader.result); // แสดงผลการดูภาพ
            };
            reader.readAsDataURL(resizedFile); // แปลงภาพที่ปรับขนาดแล้วเป็น base64
        }
    };
    
    const save = async (e) => {
        e.preventDefault();
        
        const form = e.target; // อ้างอิงถึงฟอร์มที่ส่ง
        const formData = new FormData(form);
        
        try {
            const ProfileBase64 = fileProfile ? await base64(fileProfile) : restaurants[0].ImageProfile;
            const ViewBase64 = fileView ? await base64(fileView) : restaurants[0].ImageView;
            
            const Data = {
                name: formData.get("name"),
                address: formData.get("address"),
                phone: formData.get("phone"),
                CuisineType: formData.get("store-type"),
                OpeningHours_start: formData.get("store-time-start"),
                OpeningHours_end: formData.get("store-time-end"),
                ImageProfile: ProfileBase64,
                ImageView: ViewBase64,
            };
    
            console.log(Data);
    
            const restaurantId = restaurants[0]._id;
            if (!restaurantId) {
                alert("Missing restaurant ID");
                return;
            }
    
            const response = await axios.put(
                `http://localhost:${server}/api/restaurant/updateStore/${restaurantId}`,
                Data
            );
    
            console.log("Response:", response.data);
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to update store. Please try again.");
        }
    
        window.location.reload();
    };
    
      
    const base64 = (file) => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        });
    };
      

    return (
        <>
    {/* ภาพวิวร้านด้านบน */}
    <div className="image-view-container">
        <div className="image-view">
            <img 
                src={previewView || '/imageForDefault/ViewDefault.png'} 
                alt="Restaurant View" 
            />
        </div>
        <div className="btn-view">
            {checkedit && (
                <label htmlFor="view" className="edit-btn">แก้ไขรูปภาพ</label>
            )}
            <input 
                id="view" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChangeView} 
                style={{ display: "none" }} 
            />
        </div>
    </div>

    {/* คอนเทนเนอร์รูปโปรไฟล์และข้อมูล */}
    <div className="restaurant-profile-container">
        <div className="profile-with-text">
            {/* รูปโปรไฟล์ */}
            <div className="image-profile">
                <img 
                    src={previewProfile || '/imageForDefault/ProfileDefault.png'} 
                    alt="Restaurant Profile" 
                />
                {checkedit && (
                    <label htmlFor="profile" className="edit-btn">แก้ไขรูปภาพ</label>
                )}
                <input 
                    id="profile" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChangeProfile} 
                    style={{ display: "none" }} 
                />
            </div>

            {/* ข้อมูลร้านอาหาร */}
            <div className="restaurant-info">
                {!checkedit ? (
                    <>
                        <p>ชื่อร้าน: {restaurants[0]?.name || "ไม่มีข้อมูล"}</p>
                        <p>ประเภทอาหาร: {restaurants[0]?.CuisineType || "ไม่มีข้อมูล"}</p>
                        <p>ที่อยู่: {restaurants[0]?.address || "ไม่มีข้อมูล"}</p>
                        <p>เบอร์โทร: {restaurants[0]?.phone || "ไม่มีข้อมูล"}</p>
                        <p>
                            เวลา: {restaurants[0]?.OpeningHours_start || "ไม่มีข้อมูล"} - {restaurants[0]?.OpeningHours_end || "ไม่มีข้อมูล"}
                        </p>
                        <button onClick={toggleEdit} className="edit-text-btn">แก้ไข</button>
                    </>
                ) : (
                    <form onSubmit={save}>
                        <div>
                            <label htmlFor="name">ชื่อร้าน:</label>
                            <input type="text" name="name" defaultValue={restaurants[0]?.name || ""} />
                        </div>
                        <div>
                            <label htmlFor="store-type">ประเภทอาหาร:</label>
                            <select id="store-type" name="store-type" defaultValue={restaurants[0]?.CuisineType || ""}>
                                <option value="">--เลือกประเภทอาหาร--</option>
                                <option value="thai">อาหารไทย</option>
                                <option value="japanese">อาหารญี่ปุ่น</option>
                                <option value="italian">อาหารอิตาเลียน</option>
                                <option value="chinese">อาหารจีน</option>
                                <option value="etc">อื่นๆ</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="address">ที่อยู่:</label>
                            <input type="text" name="address" defaultValue={restaurants[0]?.address || ""} />
                        </div>
                        <div>
                            <label htmlFor="phone">เบอร์โทร:</label>
                            <input type="text" name="phone" defaultValue={restaurants[0]?.phone || ""} />
                        </div>
                        <div className="store-hours">
                            <label htmlFor="store-time">เวลาทำการ:</label>
                            <div className="input-time">
                                <span>เปิด:</span>
                                <input type="time" id="store-time-start" name="store-time-start" defaultValue={restaurants[0]?.OpeningHours_start || ""} />
                                <span>ถึง:</span>
                                <input type="time" id="store-time-end" name="store-time-end" defaultValue={restaurants[0]?.OpeningHours_end || ""} />
                            </div>
                        </div>
                        <div className="form-buttons">
                            <button type="button" onClick={cancel} className="cancel-btn">ยกเลิก</button>
                            <button type="submit" className="save-btn">บันทึก</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    </div>
</>
    );
};

export default RestaurantProfile;
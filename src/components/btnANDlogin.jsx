/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import Popup from './popupRegisters';
import './btnANDlogin.css';
import { useNavigate } from 'react-router-dom';

const BtnANDLoginPop = ({ isLoggedIn, setIsLoggedIn }) => {
    const [isSignupPopupOpen, setSignupPopupOpen] = useState(false);
    const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('customer');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');
    const navigate = useNavigate();

    const toggleLoginDropdown = () => setLoginPopupOpen(!isLoginPopupOpen);

    const server = 3000;

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
            setUserType(localStorage.getItem('userType') || '');
        }
    }, [isLoggedIn]);

    const handleLogout = async () => {
        try {
            const response = await fetch(`http://localhost:${server}/api/users/logout`, {
                method: 'GET',
                credentials: 'include',
            });
    
            if (response.ok) {
                setIsLoggedIn(false);
                setUsername('');
                setPassword('');
                setUserType('');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                navigate('/');
                window.location.reload();
            } else {
                console.error('Logout failed:', await response.text());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }

        //test
        // const response1 = await fetch(`http://localhost:${server}/api/users/check-auth`, {
        //     method: 'GET',
        //     credentials: 'include',
        // })

        // const data1 = await response1.json();

        // console.log(data1);

    };
    

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
    
        try {
            const response = await fetch(`http://localhost:${server}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });
    
            if (response.ok) {
                const data = await response.json();

                // test
                // console.log(data);

                // const response1 = await fetch(`http://localhost:${server}/api/users/check-auth`, {
                //     method: 'GET',
                //     credentials: 'include',
                // })

                // const data1 = await response1.json();

                // console.log(data1);

                setIsLoggedIn(true);
                setUsername(data.username);
                setUserType(data.role);
    
                localStorage.setItem('username', data.username);
                localStorage.setItem('userType', data.role);
                
                if (data.role === 'store') {
                    navigate('/store');
                }
                window.location.reload();
    
                setLoginPopupOpen(false); 
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };    

    return (
        <div>
            {!isLoggedIn ? (
                <>
                    <div className="nav-account">
                        <button onClick={toggleLoginDropdown} id="loginBtn">เข้าสู่ระบบ</button>
                        <div id="loginDropdown" className="dropdown-content" style={{ display: isLoginPopupOpen ? 'block' : 'none' }}>
                            <div className="dropdown-arrow"></div>
                            <form onSubmit={handleLogin}>
                                <label htmlFor="dropdown-username">Username</label>
                                <input
                                    type="text"
                                    id="dropdown-username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <label htmlFor="dropdown-password">Password</label>
                                <input 
                                    type="password"
                                    id="dropdown-password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {errorMessage && <p className="error">{errorMessage}</p>}
                                <div id="submit">
                                    <button type="submit">เข้าสู่ระบบ</button>
                                </div>
                            </form>
                        </div>
                        <button onClick={() => setSignupPopupOpen(true)} id="signupBtn">สมัครสมาชิก</button>
                    </div>

                    {isSignupPopupOpen && (
                        <Popup
                            isSignupPopupOpen={isSignupPopupOpen}
                            setSignupPopupOpen={setSignupPopupOpen}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    )}
                </>
            ) : (
                <div className="user-dropdown">
                    {userType === 'customer' ? (
                        <div className="profile-dropdown">
                            <div className="header">
                                <img src="https://icons.veryicon.com/png/o/education-technology/alibaba-big-data-oneui/user-profile.png" alt="Icon" className="profile-icon" width={25}/>
                                <div className="profile-button">profile</div>
                                <img src="https://static.thenounproject.com/png/551749-200.png" alt="Icon" className="dropdown-icon" width={15}/>
                            </div>
                            <div className="dropdown-content">
                                <a href="/ReservationList">การจองของฉัน</a>
                                <a href="/ProfileSetting">ตั้งค่าบัญชี</a>
                                <a onClick={handleLogout}>ออกจากระบบ</a>
                            </div>
                        </div>
                    ) : userType === 'store' ? (
                        <div className="profile-dropdown">
                            <div className="header">
                                <img src="https://icons.veryicon.com/png/o/education-technology/alibaba-big-data-oneui/user-profile.png" alt="Icon" className="profile-icon" width={25}/>
                                <div className="profile-button">profile</div>
                                <img src="https://static.thenounproject.com/png/551749-200.png" alt="Icon" className="dropdown-icon" width={15}/>
                            </div>
                            <div className="dropdown-content">
                                <a href="/store">การจองของฉัน</a>
                                <a href="/storeprofile">จัดการร้านค้า</a>
                                <a onClick={handleLogout}>ออกจากระบบ</a>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default BtnANDLoginPop;

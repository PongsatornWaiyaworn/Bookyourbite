import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Nav.css';
import BtnANDLoginPop from './btnANDlogin';

const Navbar = () => {
    const navigate = useNavigate();  
    const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
    const [isSignupPopupOpen, setSignupPopupOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRole, setRole] = useState(false); 

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const port = 3000;

    // ดึงข้อมูลร้านจาก API
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch(`http://localhost:${port}/api/restaurant/search?q=${searchQuery}`, { credentials: 'include' });
                const data = await response.json();
                setRestaurants(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (searchQuery.trim()) {
            fetchRestaurants();
        } else {
            setRestaurants([]); // ถ้าคำค้นเป็นค่าว่างให้เคลียร์ร้าน
        }
    }, [searchQuery]);

    const fetchAuth = async () => {
        try {
          const response = await fetch(`http://localhost:${port}/api/users/check-auth`, { credentials: 'include' }); 
          const data = await response.json();
          console.log(data);
          setIsLoggedIn(data.loggedIn);
          try{
              if(data.user.role === 'store'){
                  setRole(false);
              }else{
                  setRole(true);
              }
            } catch {
                setRole(true);
            }
        }catch (error){
            console.error('Error:', error);
          }
      };

    useEffect(() => {
        fetchAuth();
      });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); 
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(''); 
        setFilteredSuggestions([]);  
        performSearch(suggestion.name);  
    };

    const performSearch = (query) => {
        if (query) {
            navigate(`/RestaurantInfo/${query}`);
        } else {
            alert('ไม่พบร้านค้า');
        }
    };

    const goHome = () => {
        fetchAuth();
        if(!isRole){
            navigate('/store');  
        }else{
            navigate('/');
        }
    };

    return (
        <div className="navbar">
            <div className="logo" onClick={goHome}>
                <img src="LOGO.png" width="130px" alt="Logo" />
            </div>
            <div className="search-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="ค้นหามื้ออร่อยของคุณ..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                performSearch(e.target.value);
                                setFilteredSuggestions([]);
                            }
                        }}
                    />
                    <img
                        src="https://cdn.icon-icons.com/icons2/1129/PNG/512/searchmagnifierinterfacesymbol_79894.png"
                        alt="Icon"
                        className="srearc-icon"
                        width={20}
                    />
                    {/* แสดงผล Dropdown เมื่อค้นหามีผล และ searchQuery ไม่เป็นค่าว่าง */}
                    {searchQuery.trim() && restaurants.length > 0 && (
                        <ul className="suggestions-list">
                            {restaurants.map((restaurant, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(restaurant)}
                                >
                                    {restaurant.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div>
                <BtnANDLoginPop
                    isLoginPopupOpen={isLoginPopupOpen}
                    setLoginPopupOpen={setLoginPopupOpen}
                    isSignupPopupOpen={isSignupPopupOpen}
                    setSignupPopupOpen={setSignupPopupOpen}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                />
            </div>
        </div>
    );
};

export default Navbar;

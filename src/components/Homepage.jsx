import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/popular');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };

        fetchRestaurants();
    }, []);

    const cusine = [
        { id: 1, name: "อาหารไทย", image: "/cushine/ไทย.jpg" , CuisineType: "thai"},
        { id: 2, name: "อาหารญี่ปุ่น", image: "/cushine/ญี่ปุ่น.jpg" , CuisineType: "chinese"},
        { id: 3, name: "อาหารอิตาเลียน", image: "/cushine/อิตาเลียน.jpg" , CuisineType: "italian"},
        { id: 4, name: "อาหารจีน", image: "/cushine/จีน.jpg" , CuisineType: "japanese"},
        { id: 5, name: "อื่นๆ", image: "/cushine/อื่นๆ.jpg" , CuisineType: "else"}
      ];

    const handleImageClick = (path) => {
        navigate(path);
    };

    console.log(restaurants);

    return (
        <div className="popular-container">
            <section className="popular-restaurants">
                <h2>ร้านแนะนำที่ไม่ควรพลาด</h2>
                <div className="restaurant-list">
                    {restaurants.map((restaurant) => (
                         <div key={restaurant.restaurantName} className="restaurant-card">
                            <img src={restaurant.restaurantImage} alt={restaurant.restaurantName} 
                            onClick={() => handleImageClick(`/RestaurantInfo/${encodeURIComponent(restaurant.restaurantName)}`)}
                             />
                         <h3>{restaurant.restaurantName}</h3>
                     </div>
                    ))}
                </div>
            </section>
            <section className="cushine-restaurants">
                <h2>ค้นหามื้ออร่อย</h2>
                <div className="cushine-list">
                    {cusine.map((item) => (
                        <div className="cushine-item" key={item.id}>
                            <img src={item.image} alt={item.name} 
                            onClick={() => handleImageClick(`/category/${item.CuisineType}`)}/>
                            <h3>{item.name}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Homepage;
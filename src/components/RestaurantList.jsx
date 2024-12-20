import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RestaurantList.css";

const RestaurantList = () => {
    const { category } = useParams(); // Capture category from URL
    const [restaurants, setRestaurants] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/category/${category}`);
                if (!response.ok) {
                    throw new Error("Network error");
                }
                const data = await response.json();
                setRestaurants(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRestaurants();
    }, [category]);

    const handleImageClick = (path) => {
        navigate(path); 
    };

    return (
        <div className="restaurant-list-container">
            <h2 className="category-title">อาหาร{category}</h2>
            <div className="restaurant-list">
                {restaurants.length > 0 ? (
                    restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="restaurant-card">
                            <img
                                src={restaurant.ImageProfile}
                                alt={restaurant.name}
                                onClick={() => handleImageClick(`/RestaurantInfo/${restaurant.id}`)}
                                className="restaurant-image"
                            />
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                        </div>
                    ))
                ) : (
                    <p className="no-restaurant"></p>
                )}
            </div>
        </div>
    );
};

export default RestaurantList;

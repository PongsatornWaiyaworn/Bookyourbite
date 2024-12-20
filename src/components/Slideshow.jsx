import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = ["imageSlides/1.jpg", "imageSlides/2.jpg", "imageSlides/3.jpg", "imageSlides/4.jpg"];

    const changeImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); 
    };

    useEffect(() => {
        const intervalId = setInterval(changeImage, 30000);  
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="slideshow-container">
            <img
                className="slideshow-image"
                src={images[currentIndex]}
                alt="Slideshow"
            />
            <div className="overlay">
                <span className="overlay-text">จองทุกมื้อให้อร่อยกว่าเดิม</span>
            </div>
        </div>
    );
};

export default Slideshow;

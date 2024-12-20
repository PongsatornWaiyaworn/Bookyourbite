import React from 'react';
import Slideshow from './components/Slideshow';
import './Home.css';
import Homepage from './components/Homepage';

const Home = () => {
    return (
        <div>
            <Slideshow />
            <Homepage/>
        </div>
    );
};

export default Home;

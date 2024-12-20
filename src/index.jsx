import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import NotFound from './components/NotFound'; 
import Navbar from './components/Nav';
import BarCustomer from './components/barCustomer';
import reportWebVitals from './reportWebVitals';
import RestaurantProfile from './components/restaurantProfile';
import Homepage from './components/Homepage';
import RestaurantList from "./components/RestaurantList";
import RestaurantInfo from './components/RestaurantInfo';
import ReservationList from './components/ReservationList';
import Setting from './components/Setting';


const App = () => {
  // const [auth, setAuth] = useState({ loggedIn: false, user: null });

  // useEffect(() => {
  //   const fetchAuth = async () => {
  //     try {
  //       const response = await fetch('/api/check-auth', { credentials: 'include' }); 
  //       const data = await response.json();
  //       setAuth(data);
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //     // console.log(auth);
  //   };

  //   fetchAuth();
  // });

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/storeprofile' element={<RestaurantProfile/>}/>
        <Route path="/store" element={<BarCustomer />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/category/:category" element={<RestaurantList />} />
        <Route path="/RestaurantInfo/:name" element={<RestaurantInfo />} />
        <Route path="/ReservationList" element={<ReservationList />} />
        <Route path="/ProfileSetting" element={<Setting />} />
        <Route path="*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

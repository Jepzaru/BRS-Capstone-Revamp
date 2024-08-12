import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Homepage.css';
import homelogo from '../Images/citlogo1.png';
import mainImage from '../Images/homebanner.png';
import LoadingScreen from './HomeLoadingScreen';
import serviceIcon1 from '../Images/1.png';
import serviceIcon2 from '../Images/2.png';
import serviceIcon3 from '../Images/3.png';
import serviceIcon4 from '../Images/4.png';

function HomePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // Adjust the time as needed

        return () => clearTimeout(timer);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="homepage-container"> 
            <header className="homepage-header">
                <nav className="homepage-navbar">
                    <img src={homelogo} alt="Logo" className="home-logo" />
                    <div className={`home-nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#about-us">About Us</a></li>
                        <Link to="/user-authentication">
                            <button className="get-started">Get Started</button>
                        </Link>
                    </div>
                    <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                </nav>
            </header>
            
            <div className="main-image-container">
                <img src={mainImage} alt="Main Visual" className="main-image" />
            </div>
            <div className='home-label'>
                <p>Ride with Ease, Reserve with Confidence!</p>
                <Link to="/user-authentication">
                    <button className='home-reserve-btn'>RESERVE NOW!</button>
                </Link>
            </div>
            <div className='home-services'>
                <p>Services</p>
                <div className='service-label'>
                    <p>We offer convenient and reliable reservation services! ✨</p>
                </div>
                <div className="service-boxes">
                    <div className="service-box maroon">
                        <span><img src={serviceIcon1} alt="Icon 1" className="service-icon" />Convenient Reservation</span>
                    </div>
                    <div className="service-box gold">
                        <span><img src={serviceIcon2} alt="Icon 2" className="service-icon" />User Friendly</span>
                    </div>
                    <div className="service-box maroon">
                        <span><img src={serviceIcon3} alt="Icon 3" className="service-icon" />Secure and Reliable</span>
                    </div>
                    <div className="service-box gold">
                        <span><img src={serviceIcon4} alt="Icon 4" className="service-icon" />24/7 Support</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

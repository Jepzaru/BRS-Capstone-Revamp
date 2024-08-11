import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Homepage.css';
import homelogo from '../Images/citlogo1.png';
import mainImage from '../Images/homebanner.png';
import LoadingScreen from './HomeLoadingScreen';
import { SlGlobe } from "react-icons/sl";


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
        <div>
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
                <div className='service-grid'>
                    <div className='grid-item'><img src="path/to/image1.png" alt="Service 1" /></div>
                    <div className='grid-item'><img src="path/to/image2.png" alt="Service 2" /></div>
                    <div className='grid-item'><img src="path/to/image3.png" alt="Service 3" /></div>
                    <div className='grid-item'><img src="path/to/image4.png" alt="Service 4" /></div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

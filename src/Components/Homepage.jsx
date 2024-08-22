import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Homepage.css';
import homelogo from '../Images/citlogo1.png';
import mainImage from '../Images/homebanner.png';
import LoadingScreen from './HomeLoadingScreen';
import serviceIcon1 from '../Images/1.png';
import serviceIcon2 from '../Images/2.png';
import serviceIcon3 from '../Images/3.png';
import serviceIcon4 from '../Images/4.png';
import jep from '../Images/jep.jpg';
import kim from '../Images/kim.jpg';
import rj from '../Images/rj.jpg';
import saly from '../Images/saly.jpg';
import carlo from '../Images/busimage.jpg';
import carouselImage1 from '../Images/busimage.jpg';
import carouselImage2 from '../Images/busimage2.jpg';
import carouselImage3 from '../Images/Vehicle1.jpg';
import carouselImage4 from '../Images/Vehicle2.jpg';
import carouselImage5 from '../Images/coasterimage.jpg';
import carouselImage6 from '../Images/coasterimage2.jpg';
import carouselImage7 from '../Images/coasterimage3.jpg';

function HomePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [carouselImage1, carouselImage2, carouselImage3, carouselImage4, carouselImage5, carouselImage6, carouselImage7];
    const sectionsRef = useRef([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 3000);

        return () => clearInterval(slideInterval);
    }, [images.length]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
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
            
            <div className="main-image-container" ref={(el) => (sectionsRef.current[0] = el)}>
                <img src={mainImage} alt="Main Visual" className="main-image" />
            </div>
            <div className='home-label' ref={(el) => (sectionsRef.current[1] = el)}>
                <p>Ride with Ease, Reserve with Confidence!</p>
                <Link to="/user-authentication">
                    <button className='home-reserve-btn'>RESERVE NOW!</button>
                </Link>
            </div>
            <div className='home-services' ref={(el) => (sectionsRef.current[2] = el)}>
                <p>Services ⚙️  </p>
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
                <div className='carousel-label'>
                    <p>Safe, Secure and Clean Buses and vehicles for you to ride!</p>
                </div>
                <div className="carousel" ref={(el) => (sectionsRef.current[3] = el)}>
                    <div className="carousel-wrapper">
                        {images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={`Slide ${index + 1}`} 
                                className={`carousel-image ${index === currentSlide ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                    <button className="carousel-button prev" onClick={prevSlide}>&#10094;</button>
                    <button className="carousel-button next" onClick={nextSlide}>&#10095;</button>
                    <div className="carousel-indicators">
                        {images.map((_, index) => (
                            <span 
                                key={index} 
                                className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`} 
                                onClick={() => goToSlide(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
            <div className='about-us'>
                <p>About Us 👨🏻‍💻</p>
                <div className='about-us2'> 
                    <p>Meet the developers behind the creation of the project!</p>
                </div>
                <div className='about-us-grid'>
        <div className='grid-box'>
            <img src={jep} alt="Image 1" />
            <span className='image-name'>Jeff Francis D. Conson</span>
        </div>
        <div className='grid-box'>
            <img src={kim} alt="Image 2" />
            <span className='image-name'>Kimverly B. Bacalso</span>
        </div>
        <div className='grid-box'>
            <img src={rj} alt="Image 3" />
            <span className='image-name'>Rise Jade Benavente</span>
        </div>
        <div className='grid-box'>
            <img src={saly} alt="Image 4" />
            <span className='image-name'>Thesaly Tejano</span>
        </div>
        <div className='grid-box'>
            <img src={carlo} alt="Image 5" />
            <span className='image-name'>Carlo Garcia</span>
        </div>
    </div>
            </div>
        </div>
    );
}

export default HomePage;

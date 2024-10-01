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
import jep from '../Images/Jep.png';
import kim from '../Images/kem.png';
import rj from '../Images/rays.png';
import saly from '../Images/saly.png';
import carlo from '../Images/caloy.png';
import carouselImage1 from '../Images/busimage.jpg';
import carouselImage2 from '../Images/busimage2.jpg';
import carouselImage3 from '../Images/Vehicle1.jpg';
import carouselImage4 from '../Images/Vehicle2.jpg';
import carouselImage5 from '../Images/coasterimage.jpg';
import carouselImage7 from '../Images/coasterimage3.jpg';
import footerImage from '../Images/footerlogo.png';
import { FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { RiComputerLine } from "react-icons/ri";
import { FaBriefcase } from "react-icons/fa6";

function HomePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [carouselImage1, carouselImage2, carouselImage3, carouselImage4, carouselImage5, carouselImage7];
    const sectionsRef = useRef([]);
    const navLinksRef = useRef([]);

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
        setCurrentSlide((prevSlide - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const scrollToSection = (index) => {
        sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false); 
    };

    useEffect(() => {
        const handleScroll = () => {
            let current = '';

            sectionsRef.current.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
                    current = index;
                }
            });

            navLinksRef.current.forEach((link, index) => {
                link.classList.remove('active');
                if (index === current) {
                    link.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="homepage-container">
            <header className="homepage-header">
                <nav className="homepage-navbar">
                    <img src={homelogo} alt="Logo" className="home-logo" />
                    <div className={`home-nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                        <li><a onClick={() => scrollToSection(0)}>Home</a></li>
                        <li><a onClick={() => scrollToSection(2)}>Services</a></li>
                        <li><a onClick={() => scrollToSection(3)}>About Us</a></li>
                        <Link to="/user-authentication">
                            <button className="get-started">Log in</button>
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

            <div className="home-label" ref={(el) => (sectionsRef.current[1] = el)}>
                <p>Ride with Ease, Reserve with Confidence!</p>
                <Link to="/user-authentication">
                    <button className="home-reserve-btn">RESERVE NOW!</button>
                </Link>
            </div>

            <div className="home-services" ref={(el) => (sectionsRef.current[2] = el)}>
                <p>Services</p>
                <div className="service-label">
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

            <div className="carousel-label">
                <p>Safe, Secure, Clean Buses and vehicles for you to ride!</p>
            </div>
            <div className="carousel" ref={(el) => (sectionsRef.current[3] = el)}>
                <div className="carousel-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {images.map((image, index) => (
                        <div key={index} className="carousel-slide">
                            <img src={image} alt={`Slide ${index + 1}`} className="carousel-image" />
                        </div>
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

            <div className="about-us" ref={(el) => (sectionsRef.current[3] = el)}>
                <p style={{fontWeight: "600"}}>About Us 👨🏻‍💻</p>
                <div className="about-us2">
                    <p>Meet the developers behind the creation of the project!</p>
                </div>
                <div className="about-us-grid">
                    <div className="grid-box">
                        <img src={jep} alt="Image 1" />
                        <span className="image-name">Jeff Francis Conson</span>
                    </div>
                    <div className="grid-box">
                        <img src={kim} alt="Image 2" />
                        <span className="image-name">Kimverly Bacalso</span>
                    </div>
                    <div className="grid-box">
                        <img src={carlo} alt="Image 3" />
                        <span className="image-name">Carlo Garcia</span>
                    </div>
                    <div className="grid-box">
                        <img src={saly} alt="Image 4" />
                        <span className="image-name">Thesaly Tejano</span>
                    </div>
                    <div className="grid-box">
                        <img src={rj} alt="Image 5" />
                        <span className="image-name">Rise Jade Benavente</span>
                    </div>
                </div>
            </div>

            <footer className="custom-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src={footerImage} alt="Logo" />
                    </div>
                    <div className="footer-nav">
                       <p><RiComputerLine /> Capstone 2 Project</p>
                       <p><FaBriefcase /> Transportation Reservation System</p>
                    </div>
                    <div className="footer-social">
                        <p style={{fontWeight: "700"}}>Get in Touch</p>
                        <a href="https://www.facebook.com/CITUniversity" ><FaFacebook style={{color: "blue", fontSize: "34px"}}/></a>
                        <a href="https://www.tiktok.com/@cituniversity?lang=en" ><FaTiktok style={{color: "black", fontSize: "34px"}}/></a>
                        <a href="https://www.instagram.com/cituniversity/" ><FaInstagram style={{color: "brown", fontSize: "34px"}}/></a>
                        <a href="https://www.youtube.com/results?search_query=cit+university" ><FaYoutube style={{color: "red", fontSize: "34px"}}/></a>
                    </div>
                    <div className="footer-bottom">
                    <p>&copy; 2024 Cebu Institute of Technology University. All rights reserved.</p>
                </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
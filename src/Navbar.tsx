import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

interface NavbarProps {
    isLoggedIn: boolean,
    setIsLoggedIn: (loggedIn: boolean) => void,
    setBlurEffect: (blurEffect: boolean) => void,
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn, setBlurEffect }) => {
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const toggleExploreMenu = () => {
        const isOpen = !isExploreOpen;
        setIsExploreOpen(isOpen);
        setBlurEffect(isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsExploreOpen(false);
            setBlurEffect(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="brand-name">Competition Math Academy</Link>
                <div className="navbar-links">
                    <div className="dropdown" ref={dropdownRef}>
                        <button className="dropdown-toggle" onClick={toggleExploreMenu}>
                            Explore Classes
                        </button>
                        {isExploreOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-section">
                                    <ul>
                                        <li>
                                            <Link to="/mathpage/calculus">Calculus</Link>
                                        </li>
                                        <li>
                                            <Link to="/mathpage/amc8">AMC 8</Link>
                                        </li>
                                        <li>
                                            <Link to="/mathpage/amc10_12">AMC 12</Link>
                                        </li>
                                        <li>
                                            <Link to="/mathpage/aime">AIME</Link>
                                        </li>
                                        <li>
                                            <Link to="/mathpage/usamo">USAMO</Link>
                                        </li>
                                        <li>
                                            <Link to="/mathpage/mop">Mathematical Olympiad Program (MOP)</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="dropdown">
                        <Link to="/discussion-board" className="dropdown-toggle">Discussion</Link> 
                    </div>
                </div>
            </div>
            <div className="navbar-end">
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="login-button">Log out</button>
                ) : (
                    <Link to="/login" className="login-button">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
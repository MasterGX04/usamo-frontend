import React, { useEffect, useRef, useState } from "react";
import { calculusUnits, amc8Topics, amc10_12Topics, aimeTopics, usamoTopics } from "../data/DataAndUnits";
import VideoEmbed from "../VideoComponents/VideoEmbed";
import './math-page.css';

interface MathPageProps {
    mathType: string;
}

interface Unit {
    unit: string,
    subunits: string[],
    videos: string[],
}

const unitDataMap: Record<string, Unit[]> = {
    calculus: calculusUnits,
    amc8: amc8Topics,
    amc10_12: amc10_12Topics,
    aime: aimeTopics,
    usamo: usamoTopics
};

const MathPage: React.FC<MathPageProps> = ({ mathType }) => {
    const units = unitDataMap[mathType.toLowerCase()] || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const currentUnit = units[Math.floor(currentIndex / units[0].subunits.length)];
    const currentSubIndex = currentIndex % units[0].subunits.length;

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? units.length * units[0].subunits.length - 2 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === units.length * units[0].subunits.length - 2 ? 0 : prevIndex + 1
        );
    }

    // Open menu after triple click
    useEffect(() => {
        const handleTripleClick = () => {
            setClickCount((prevCount) => prevCount + 1);

            if (clickCount === 2) {
                console.log('Mouse clicked 3 times!');
                setMenuVisible(true);
                setClickCount(0);
            }

            const timer = setTimeout(() => setClickCount(0), 500);
            return () => clearTimeout(timer);
        }

        window.addEventListener("click", handleTripleClick);
        return () => window.removeEventListener("click", handleTripleClick);
    }), [clickCount];

    // CLose menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (menuVisible && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuVisible(false);
            }
        };

        if (menuVisible) {
            window.addEventListener("mousedown", handleOutsideClick);
        }

        return () => window.removeEventListener("mousedown", handleOutsideClick);
    }, [menuVisible]);

    const handleLessonClick = (unitIndex: number, subIndex: number) => {
        const newIndex = unitIndex * units[0].subunits.length + subIndex;
        setCurrentIndex(newIndex);
        setMenuVisible(false);
    };

    return (
        <div className="math-page-container">
            {!menuVisible && (
                <div className="menu-icon" onClick={() => setMenuVisible(true)}>
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                </div>
            )}

            {menuVisible && (
                <div ref={menuRef} className="menu">
                    <h2>{mathType.toUpperCase()} Outline</h2>
                    {units.map((unit, unitIndex) => (
                        <div key={unitIndex} className="menu-unit">
                            <h3>{`Unit ${unitIndex + 1}: ${unit.unit}`}</h3>
                            <ul>
                                {unit.subunits.map((subunit, subIndex) => (
                                    <li
                                        key={subIndex}
                                        onClick={() => handleLessonClick(unitIndex, subIndex)}
                                        className="menu-subunit"
                                    >
                                        {subunit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            <h1 className="math-header">{mathType.toUpperCase()} Lessons</h1>

            <div className="navigation-arrows">
                <button className="nav-arrow-button prev-arrow" onClick={handlePrev}></button>
                <div className="current-unit">{`${currentUnit.unit}`}</div>
                <button className="nav-arrow-button next-arrow" onClick={handleNext}></button>
            </div>

            <div className="content-area">
                <h2 className="unit-header">{`Topic: ${currentUnit.subunits[currentSubIndex]}`}</h2>
                <VideoEmbed videoUrl={currentUnit.videos[currentSubIndex]} height="500px" />
            </div>
        </div>
    );
};

export default MathPage;
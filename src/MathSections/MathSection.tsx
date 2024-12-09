import React from 'react';
import './math-section.css';
import { useNavigate } from 'react-router-dom';

interface MathSectionProps {
    icon: string;
    name: string;
    path: string;
}

const MathSection: React.FC<MathSectionProps> = ({icon, name, path}) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(path);
    }

    return (
        <div className="math-section" onClick={handleRedirect}>
            <img src={icon} alt={`${name} icon`} className="section-icon" />
            <p className="section-name">{name}</p>
        </div>
    );
};

export default MathSection;
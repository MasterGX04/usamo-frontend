import React from "react";
import { useParams } from "react-router-dom";
import MathPage from './MathPage';

const MathPageWrapper: React.FC = () => {
    const { mathType } = useParams<{mathType: string}>();
    return <MathPage mathType={mathType || 'calculus'} />
}

export default MathPageWrapper;
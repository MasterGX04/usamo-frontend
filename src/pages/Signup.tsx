import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../LoginComponents/GoogleLoginButton';

const Signup: React.FC = () => {
    const [stage, setStage] = useState('birthday');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [dateError, setDateError] = useState('');
    const [nextButtonVisible, setNextButtonVisible] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [fullBirthday, setFullBirthday] = useState('');
    const navigate = useNavigate();

    // Move to next stage after confirming birthday
    const handleNext = () => {
        if (isValidDate(birthMonth, birthDay, birthYear)) {
            if (birthMonth && birthDay && birthYear) {
                const formattedDate = `${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}-${birthYear}`;
                setFullBirthday(formattedDate);
                console.log(`Current birthday: ${formattedDate}`);
                setStage('signup');
                setNextButtonVisible(true);
                setDateError('');
            } else {
                setDateError('Invalid date. Please select a valid date');
            }
        } else {
            setDateError('Please complete all birthday fields.');
        }
    };

    useEffect(() => {
        if (birthMonth && birthYear && birthDay) {
            setNextButtonVisible(isValidDate(birthMonth, birthDay, birthYear));
        } else {
            setNextButtonVisible(false);
        }
    }, [birthMonth, birthYear, birthDay]);

    const isValidDate = (month: string, day: string, year: string) => {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.getDate() === parseInt(day) && date.getMonth() === parseInt(month) - 1;
    }

    const handleBack = () => {
        setStage('birthday');
        setFullBirthday('');
    }

    const birthdayInput = (
        <div className="birthday-form">
            <h2>Enter Your Birthday</h2>

            <div className="birthday-labels">
                <div className="birthday-item">
                    <label>Month</label>
                    <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
                        <option value="">Month</option>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                            .map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                    </select>
                </div>

                <div className="birthday-item">
                    <label>Day</label>
                    <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)}>
                        <option value="">Day</option>
                        {[...Array(31)].map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>

                <div className="birthday-item">
                    <label>Year</label>
                    <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
                        <option value="">Year</option>
                        {[...Array(116)].map((_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {dateError && <p className="error">{dateError}</p>}
            {nextButtonVisible ? <button onClick={handleNext}>Next</button> : null}
        </div>
    );

    const validateEmail = async (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/users/check-email?email=${email}`);
            return response.data.exists ? 'Email is already taken' : '';
        } catch (error: any) {
            console.error("Validate email error:", error);
            return 'Unable to validate email';
        }
    }

    const validateUsername = async (username: string) => {
        if (username.length == 0) return 'Username cannot be empty';
        try {
            const response = await axios.get(`http://localhost:8080/api/users/check-username?username=${username}`);
            return response.data.exists ? 'Username is already taken' : '';
        } catch (error: any) {
            console.error("Validate username error:", error);
            return 'Unable to validate username';
        }
    };

    const validatePassword = (password: string) => {
        const minLength = 8;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const upperCase = /[A-Z]/;
        const lowerCase = /[a-z]/;

        if (password.length < minLength) return 'Password must be at least 8 characters';
        if (!specialChar.test(password)) return 'Password must include a special character';
        if (!upperCase.test(password)) return 'Password must include an uppercase letter';
        if (!lowerCase.test(password)) return 'Password must include a lowercase letter';
        return '';
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        //Reset errors:
        const newErrors = { username: '', email: '', password: '', confirmPassword: '' };
        newErrors.email = await validateEmail(email);
        newErrors.username = await validateUsername(username);
        newErrors.password = validatePassword(password);
        newErrors.confirmPassword = password !== confirmPassword ? 'Passwords do not match' : '';

        setErrors(newErrors);

        //Submit if no errors
        if (!newErrors.email && !newErrors.username && !newErrors.password && !newErrors.confirmPassword) {
            try {
                const response = await axios.post('http://localhost:8080/api/users/signup', {
                    username,
                    email,
                    password,
                    birthday: fullBirthday
                });
                console.log('User signed up successfully:', response.data);
                navigate('/');
            } catch (error) {
                console.error('Error signing up:', error);
            }
        }
    };

    return (
        <div className="signup-container">
            {stage !== 'birthday' && (
                <button onClick={handleBack} className="back-arrow">
                    ←
                </button>
            )}
            {stage === 'birthday' ? birthdayInput : (
                <div className="signup-options">
                <h2>Sign Up for Math Competition Academy!</h2>
                <form className="signup-form" onSubmit={handleSignup}>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}

                    <label>Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                    <button type="submit">Sign Up</button>
                </form>
                <div className="divider">OR</div>
                <GoogleLoginButton fullBirthday={fullBirthday} />
            </div>
            )}
        </div>
    );
};

export default Signup;
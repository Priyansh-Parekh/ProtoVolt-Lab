import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// --- Importing icons from the react-icons library ---
import { BsCpu } from 'react-icons/bs';


//components
import LeftHalfVer from '../components/Auth/LeftHalfVer.jsx';
import LeftHalfAccVer from '../components/Auth/leftHalfAccVer.jsx';
import api from '../utils/axios';
import { error, success } from '../utils/toastify';


const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type')
    const email = searchParams.get('email')

    const handleVerify = async (e) => {
        e.preventDefault();
        e.target.disabled = true;
        e.target.style.opacity = 0.5;
        try {
            const res = await api.post('/user/auth/otpVer', { otp, email, type });
            if (res.data.success === false) {
                error(res.data.message);
                setOtp("");
                e.target.disabled = false;
                e.target.style.opacity = 1;
            } else if (res.status === 200) {
                success(res.data.message);
                const redirectUrl = res.data.redirectUrl;
                setTimeout(() => {
                    // Manually redirect browser
                    window.location.href = redirectUrl;
                }, 3000);
            }
        } catch (err) {
            error(err.response?.data?.message || 'Verification failed');
            console.log(err.message);
            setOtp('');
            e.target.disabled = false;
            e.target.style.opacity = 1;
        }
    };

    const handleResendOTP = async () => {

        setOtp("");
        try {
            const res = await api.get(`/user/auth/otpGen?type=${type}&email=${email}`);
            if (res.status === 200) {
                success(res.data.message || "OTP has been resent!");
            }

        } catch (error) {
            console.error("Resend OTP Error:", error);
            error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
        }
    }


    return (
        <div className='h-[91vh]'>
            <style>
                {`
            @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap');
            body { font-family: 'Chakra Petch', sans-serif; }
            @keyframes float1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
            .animate-float1 { animation: float1 3s ease-in-out infinite; }
            .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
            .custom-input {
                background-color: var(--color-primary);
                border: 1px solid var(--color-border);
                color: var(--color-text-bright);
                transition: border-color 0.3s, box-shadow 0.3s;
                letter-spacing: 0.5em; /* For OTP input styling */
                text-align: center;
            }
            .custom-input:focus {
                outline: none;
                border-color: var(--color-accent-cyan);
                box-shadow: var(--shadow-neon);
            }
            .custom-input::placeholder {
                color: var(--color-placeholder);
                letter-spacing: normal;
                text-align: center;
            }
            `}
            </style>
            <div className="h-full flex bg-[var(--color-primary)]">
                {/* Using the reusable and informative component for the left panel */}
                {type === "forgotPass" && <LeftHalfVer />}
                {type === "signUp" && <LeftHalfAccVer />}

                {/* Right Panel: OTP Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full p-8 rounded-2xl animate-fadeIn bg-[var(--color-secondary)]">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <BsCpu className="w-10 h-10 text-[color:var(--color-accent-cyan)] animate-float1" />
                            <h1 className="text-4xl font-bold text-[var(--color-text-bright)]">
                                Circuit<span className="text-[var(--color-accent-cyan)]">Sim</span>
                            </h1>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-[var(--color-text-bright)]">Check Your Email</h2>
                        <p className="mt-2 text-center text-sm text-[var(--color-text-light)]">We've sent a 6-digit verification code to your email address.</p>

                        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                            <div>
                                <label htmlFor="otp" className="sr-only">Verification Code</label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    maxLength="6"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Only allow numbers
                                    placeholder="_ _ _ _ _ _"
                                    className="custom-input w-full p-3 rounded-md text-2xl font-semibold"
                                />
                            </div>

                            <button type="submit" className="w-full hover:cursor-pointer py-3 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg" style={{ backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))', boxShadow: 'var(--shadow-neon)' }}>
                                Verify Account
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-[var(--color-text-light)]">
                            Didn't receive the code?{' '}
                            <a onClick={handleResendOTP} className="font-medium hover:cursor-pointer hover:underline text-[var(--color-accent-cyan)]">
                                Resend Code
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
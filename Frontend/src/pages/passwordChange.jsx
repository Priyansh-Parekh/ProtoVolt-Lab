import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// --- Importing icons ---
import { BsCpu } from 'react-icons/bs';

//importing compornents
import LeftHalfPass from '../components/Auth/leftHalfPass';

//importing utils
import api from '../utils/axios';

const PasswordChange = () => {
    const [newPassword,setNewPassword]= useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');


    const handleSubmit = async(e)=>{
        e.preventDefault();
        e.target.diabled = true;
        e.target.style.opacity = 0.5;
        if(newPassword!=confirmPassword){
            alert("Your Password is not matching");
            setNewPassword("");
            setConfirmPassword("");
        }else{
            //call api
            const res = await api.post(`/user/auth/userPassChange?email=${email}`,{newPassword});
            alert(res.data.message);
            if(res.data.success === true){
                let redirectUrl = res.data.redirectUrl;
                if(redirectUrl){
                    console.log("Redirect to:", redirectUrl);
                    // Manually redirect browser
                    window.location.href = redirectUrl;
                }
            }else{
                setNewPassword("");
                setConfirmPassword("");
            }
        }
        e.target.diabled = false;
        e.target.style.opacity = 1;
    }

  return (
    <div>
        <div className="min-h-screen flex bg-[var(--color-primary)]">
            {/* Using the reusable and informative component for the left panel */}
            <LeftHalfPass />

            {/* Right Panel: Password Change Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full p-8 rounded-2xl animate-fadeIn bg-[var(--color-secondary)]">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                        <BsCpu className="w-10 h-10 text-[var(--color-accent-cyan)] animate-float1" />
                        <h1 className="text-4xl font-bold text-[var(--color-text-bright)]">
                            Circuit<span className="text-[var(--color-accent-cyan)]">Sim</span>
                        </h1>
                    </div>
                
                    <h2 className="text-2xl font-bold text-center text-[var(--color-text-bright)]">Set New Password</h2>
                    <p className="mt-2 text-center text-sm text-[var(--color-text-light)]">Please create a new password for your account.</p>

                    <form className="mt-8 space-y-6" onSubmit={(e)=>{handleSubmit(e)}}>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-[var(--color-text-light)] mb-1">New Password</label>
                            <input 
                                id="new-password"
                                name="new-password"
                                type="password"
                                required 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password" 
                                className="custom-input w-full p-3 rounded-md text-sm"
                            />
                        </div>
                         <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--color-text-light)] mb-1">Confirm New Password</label>
                            <input 
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password" 
                                className="custom-input w-full p-3 rounded-md text-sm"
                            />
                        </div>

                        <button type="submit" className="w-full py-3 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg" style={{backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))', boxShadow: 'var(--shadow-neon)'}}>
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PasswordChange;

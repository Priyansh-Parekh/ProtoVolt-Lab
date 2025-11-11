const generateOtp =  () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    return otp; // send to user via email/SMS
};

const generateExpiry = () => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    return expiresAt;
}

export {generateExpiry,generateOtp};
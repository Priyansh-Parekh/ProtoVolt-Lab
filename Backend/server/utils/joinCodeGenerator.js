import crypto from "crypto";

const generateJoinCode = (length = 10) => {
  // 1️⃣ Base character set (A-Z, a-z, 0-9)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // 2️⃣ Random part
  let randomPart = Array.from(crypto.randomBytes(length))
    .map(b => chars[b % chars.length])
    .join('');

  // 3️⃣ Time-based part (YYMMDDHHmm)
  const now = new Date();
  const datePart = now
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(2, 10); // YYMMDDHH

  // 4️⃣ Combine both parts and shuffle a bit
  const baseCode = `${randomPart}${datePart}`;
  const shuffled = baseCode.split('').sort(() => 0.5 - Math.random()).join('');

  return shuffled.slice(0, length + 4); // final join code (e.g., 14 chars)
};

export default generateJoinCode;
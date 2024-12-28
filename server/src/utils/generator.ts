import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

/**
 * Generates a 6-digit OTP
 * @returns {number} A 6-digit OTP
 */
function otpGenerator(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

/**
 * Creates a random secret key
 * @returns {string} A 64-byte hexadecimal secret key
 */
function createMySecretKey(): string {
  const randomBytes = CryptoJS.lib.WordArray.random(64);
  return CryptoJS.enc.Hex.stringify(randomBytes);
}

/**
 * Hashes a secret key using bcrypt
 * @param secretKey - The secret key to hash
 * @returns {Promise<string>} A promise that resolves to the hashed secret key
 */
async function hashSecretKey(secretKey: string): Promise<string> {
  return await bcrypt.hash(secretKey, 10);
}

/**
 * Validates a secret key against a hashed secret key
 * @param secretKey - The secret key to validate
 * @param hashedSecretKey - The hashed secret key to compare against
 * @returns {Promise<boolean>} A promise that resolves to true if valid, false otherwise
 */
async function isSecretKeyValid(
  secretKey: string,
  hashedSecretKey: string
): Promise<boolean> {
  return await bcrypt.compare(secretKey, hashedSecretKey);
}

export { otpGenerator, createMySecretKey, hashSecretKey, isSecretKeyValid };

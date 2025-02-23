import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const PrivateAdmin: React.FC = () => {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string>(""); // Field for QR Code

  const navigate = useNavigate(); // React Router navigation

  // Handle Private Key Submission
  const handlePrivateKeySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (privateKey.length !== 25) {
      setError("Private key must be exactly 25 characters.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/SuperAdmin/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ privateKey }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { token, refreshToken, adminId } = data;

        // Save tokens to localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        setAdminId(adminId);
        setIsOtpSent(true);
        setSuccess(
          "Private key verified. Please scan the QR code and enter OTP."
        );
        // ดึงข้อมูล QR Code สำหรับตั้งค่า TOTP
        const qrResponse = await fetch(
          "http://localhost:3000/api/SuperAdmin/Login/verify/setup-2fa",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ privateKey }),
          }
        );

        const qrData = await qrResponse.json();
        if (qrResponse.ok) {
          setQrCode(qrData.qrCode);
        } else {
          throw new Error(qrData.message || "Failed to generate QR code");
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Submission
  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/SuperAdmin/Login/verifyOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("MFA verification successful!");
        navigate("/AdminACMD"); // Redirect using React Router
      } else {
        throw new Error(data.message || "OTP verification failed.");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "OTP verification failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Private Admin</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {!isOtpSent ? (
          // Form for Private Key Submission
          <form onSubmit={handlePrivateKeySubmit}>
            <div className="mb-4">
              <input
                type="text"
                maxLength={25}
                placeholder="Private Key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg text-white
                ${
                  isLoading
                    ? "bg-yellow-300 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
            >
              {isLoading ? "Verifying Key..." : "Submit Private Key"}
            </button>
          </form>
        ) : (
          <>
            {/* Show QR Code if TOTP is set up */}
            {qrCode && (
              <div className="mb-4">
                <p className="text-center mb-2">
                  Scan this QR code in Google Authenticator
                </p>
                <img src={qrCode} alt="QR Code for 2FA" className="mx-auto" />
              </div>
            )}
            {/* Form for OTP Submission */}
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 rounded-lg text-white
                  ${
                    isLoading
                      ? "bg-yellow-300 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
              >
                {isLoading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivateAdmin;

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { setClientSession } from "../lib/auth";
import { verifyUserAction } from "../lib/auth-actions";
import { Eye, EyeOff } from "lucide-react";
import { createPortal } from "react-dom";

export default function LoginForm({ onClose }: { onClose?: () => void }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUsername = localStorage.getItem("skylink_remember_username");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // Handle Lockout countdown
  useEffect(() => {
    let timer: any;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockoutTimer === 0 && failedAttempts >= 3) {
      setFailedAttempts(0); // reset after timeout
    }
    return () => clearInterval(timer);
  }, [lockoutTimer, failedAttempts]);

  const handleLogin = async () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const sessionUser = await verifyUserAction(username, password);

    if (sessionUser) {
      if (rememberMe) {
        localStorage.setItem("skylink_remember_username", username);
      } else {
        localStorage.removeItem("skylink_remember_username");
      }
      setClientSession(sessionUser);
      setErrors({});
      setFailedAttempts(0);
      router.push("/dashboard");
      if (onClose) onClose();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        setLockoutTimer(30);
        setErrors({ form: "Too many failed attempts. Please wait 30 seconds." });
      } else {
        setErrors({ form: "Username atau password salah" });
      }
    }
  };

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[9999] p-4 overflow-y-auto">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-8 w-full max-w-[380px] text-white shadow-2xl relative my-auto"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/bg_profil.png"
            className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* GENERAL FORM ERROR */}
        {errors.form && (
          <p className="text-red-400 text-sm text-center mb-4 font-medium">
            {errors.form}
          </p>
        )}

        {/* USERNAME */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.username;
                  return copy;
                });
              }
            }}
            className={`w-full p-3 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.username ? "border border-red-500" : ""
            }`}
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1 font-medium">
              {errors.username}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4 relative">
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.password;
                    return copy;
                  });
                }
              }}
              className={`w-full p-3 pr-12 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.password ? "border border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* REMEMBER ME */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-500 bg-gray-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900 cursor-pointer transition-all"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-white cursor-pointer select-none">
            Remember Me
          </label>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={lockoutTimer > 0}
          className={`w-full transition p-3 rounded-lg font-semibold text-white ${
            lockoutTimer > 0 
              ? "bg-gray-600 cursor-not-allowed" 
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {lockoutTimer > 0 ? `Please wait ${lockoutTimer}s` : "Login"}
        </button>

        {/* CLOSE */}
        {onClose && (
          <p
            onClick={onClose}
            className="text-center text-gray-400 mt-4 cursor-pointer hover:text-white"
          >
            Close
          </p>
        )}
      </form>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyUser, setClientSession } from "../lib/auth";

export default function LoginForm({ onClose }: { onClose?: () => void }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = () => {
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

    const sessionUser = verifyUser(username, password);

    if (sessionUser) {
      setClientSession(sessionUser);
      setErrors({});
      router.push("/dashboard");
      if (onClose) onClose();
    } else {
      setErrors({ form: "Username atau password salah" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-8 w-[380px] text-white shadow-2xl animate-fadeIn">
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
        <div className="mb-6">
          <input
            type="password"
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
            className={`w-full p-3 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.password ? "border border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 hover:bg-orange-600 transition p-3 rounded-lg font-semibold text-white"
        >
          Login
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
      </div>
    </div>
  );
}
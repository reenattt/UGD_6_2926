"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "241712926" && password === "hajarsiweb") {
      router.push("/dashboard");
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">

      {/* CARD */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-8 w-[380px] text-white shadow-2xl animate-fadeIn">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/bg_profil.png"
            className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Login
        </h2>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 hover:bg-orange-600 transition p-3 rounded-lg font-semibold text-white"
        >
          Login
        </button>

        {/* CLOSE */}
        <p
          onClick={onClose}
          className="text-center text-gray-400 mt-4 cursor-pointer hover:text-white"
        >
          Close
        </p>

      </div>
    </div>
  );
}
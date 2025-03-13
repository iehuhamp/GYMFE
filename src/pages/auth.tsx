import React, { useEffect, useState } from "react";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/use-user";
import "./auth.css";

const loginApi =
  "https://gymbe-production-233d.up.railway.app/api/authen/login";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 3;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 3 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(loginApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      const user = data.data;
      setUser(user);

      navigateToDashboard();
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (user) return navigateToDashboard();
  }, [user]);

  console.log("user:", user);

  return (
    <div className="container">
      <div className="card">
        <div className="text-center">
          <div className="iconWrapper">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="inputWrapper">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Email"
              disabled={isLoading}
            />
          </div>

          <div className="inputWrapper">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Password"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={isLoading} className="button">
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" /> Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>

          {/* <div className="textCenter">
            Don’t have an account? <span className="link">Sign up</span>
          </div> */}
        </form>
      </div>
    </div>
  );
}

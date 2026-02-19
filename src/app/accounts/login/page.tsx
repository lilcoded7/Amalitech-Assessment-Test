"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/apis"; // Using our axios setup

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });

      const { access_token, refresh_token } = response.data;

      if (access_token) {
        localStorage.setItem("vault_token", access_token);
        if (refresh_token) {
          localStorage.setItem("vault_refresh_token", refresh_token);
        }
        // Redirect to the vault dashboard
        router.push("/vault");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(
        error.response?.data?.detail ||
          "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-lock-alt"></i>
          <h1>Secure Vault</h1>
          <p>Enter your credentials to access your files</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <i className="fas fa-shield-check"></i> End-to-end encrypted session
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f7f9;
        }
        .login-card {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 400px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-header i {
          font-size: 2.5rem;
          color: #2563eb;
          margin-bottom: 1rem;
        }
        .login-header h1 {
          font-size: 1.5rem;
          color: #1e293b;
          margin: 0;
        }
        .login-header p {
          color: #64748b;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .error-banner {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          border-left: 4px solid #dc2626;
        }

        .input-group {
          margin-bottom: 1.25rem;
        }
        .input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #475569;
        }
        .input-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-group input:focus {
          border-color: #2563eb;
        }

        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-btn:hover {
          background: #1d4ed8;
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

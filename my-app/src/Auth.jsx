import React, { useState } from "react";
import { supabase } from "./supabase-client";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    console.log("Trying to sign in with:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Sign in result:", data, error);

    if (error) {
      setError(error.message);
    } else {
      setError("Check your mail for confirmation link!");
      console.log("Sign up response:", data);
    }
  };

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      setError(error.message);
    } else {
      setError("Check your email for password reset link");
    }
  };

  return (
    <div className="flex items-center justify-center mx-40">
      <div className="flex flex-col items-center justify-center gap-5 w-1/2">
        <h1 className="font-serif text-5xl tracking-wide my-10 text-[#4a6378] flex justify-center">
          Dear Today
        </h1>
        <h3 className="font-serif text-3xl tracking-wide  text-[#4a6378]">
          {isSignUp ? "Create account" : "Sign in"}
        </h3>

        {error && <p className="font-sans text-gray-500 text-xl">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          className="auth"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="auth"
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isSignUp && (
          <button
            type="button"
            className="forgot-password-button"
            onClick={handleResetPassword}
          >
            Forgot password?
          </button>
        )}

        <button type="button" onClick={isSignUp ? handleSignUp : handleSignIn}>
          {isSignUp ? "Sign up" : "Sign in"}
        </button>
        <h4 className="flex flex-col items-center my-10">
          {isSignUp ? "Already have an account" : "Don't have an account"}
          <button
            type="button"
            className="switch-button"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </h4>
      </div>
    </div>
  );
}

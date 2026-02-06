import React, { useState } from "react";
import { supabase } from "./supabase-client";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully");
    }
  };

  const handleGoToLogin = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 my-40">
      <h2>Reset Password</h2>

      {message && <p>{message}</p>}

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        type="button"
        onClick={handleUpdatePassword}
        className="update-password"
      >
        Update password
      </button>

      <button type="button" onClick={handleGoToLogin} className="go-to-signin">
        Go to Sign in
      </button>
    </div>
  );
}

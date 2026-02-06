import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./supabase-client";
import Hero from "./hero.jsx";
import Auth from "./Auth.jsx";
import ResetPassword from "./reset-password.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:");

      if (event === "PASSWORD_RECOVERY") {
        window.location.href = "/reset-password";
        return;
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-[#8dbbcc] text-xl m-20 absolute left-0">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={session ? <Hero /> : <Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

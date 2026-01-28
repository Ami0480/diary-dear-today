import React, { useState, useEffect } from "react";
import { supabase } from "./supabase-client";
import Hero from "./hero.jsx";
import Auth from "./Auth.jsx";

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-[#8dbbcc] text-xl">Loading...</div>;
  }

  return session ? <Hero /> : <Auth />;
}

export default App;

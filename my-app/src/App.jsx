import React, { useState } from "react";
import { supabase } from "./supabase-client";
import Hero from "./hero.jsx";
import Auth from "./Auth.jsx";

function App() {
  const [session, setSession] = useState(null);
  return session ? <Hero /> : <Auth />;
}

export default App;

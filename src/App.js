import React from "react";
import LoginButton from "./components/LoginButton";
import { useAuth } from "./contexts/AuthContext";
import TeamList from "./components/TeamList";
import BidForm from "./components/BidForm";
import AdminControls from "./components/AdminControls";
import Leaderboard from "./components/Leaderboard";
import UpcomingTeams from "./components/UpcomingTeams";
import CurrentAuctionTeam from "./components/CurrentAuctionTeam";
import AllowedUsersAdmin from "./components/AllowedUsersAdmin";
import PropsAdmin from "./components/PropsAdmin";

function App() {
  const { user, loading, signOut } = useAuth();


  // ✅ Safe to return conditionally now
  if (loading) return <div>Loading...</div>;
  if (!user) return (
    <div>
      <h2>Please log in</h2>
      <LoginButton />
    </div>
  );

  return (
    <div style={{ display: "flex", padding: "2rem" }}>
      {/* Left Column */}
      <div style={{ flex: 2.5, paddingRight: "2rem" }}>
        <h1>NFL Calcutta Auction</h1>
        <p>Welcome, {user?.displayName || user?.email || "Guest"}</p>
        <button onClick={() => signOut()}>Logout</button>

        <CurrentAuctionTeam />
        <BidForm />
        <Leaderboard />
        <UpcomingTeams />
        
        {/* Admin Tools */}
        <AdminControls />
        <AllowedUsersAdmin />
        <PropsAdmin />
      </div>

      {/* Right Column */}
      <div style={{ flex: 1.5, borderLeft: "1px solid #ddd", paddingLeft: "2rem" }}>
        <h2>Teams</h2>
        <TeamList />
      </div>
    </div>
  );
}

export default App;
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import LoginButton from "./components/LoginButton";
import { useAuth } from "./contexts/AuthContext";
import TeamList from "./components/TeamList";
import BidForm from "./components/BidForm";
import AdminControls from "./components/AdminControls";
import Leaderboard from "./components/Leaderboard";
import UpcomingTeams from "./components/UpcomingTeams";
import CurrentAuctionTeam from "./components/CurrentAuctionTeam";


function App() {
  const { user, signOut } = useAuth();
  const [teams, setTeams] = useState([]);

useEffect(() => {
  const fetchTeams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "teams"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Fetched teams:", data);
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  fetchTeams();
}, []);

  return (
  <div style={{ display: "flex", padding: "2rem" }}>
  {/* Left Column */}
  <div style={{ flex: 2.5, paddingRight: "2rem" }}>
    <h1>NFL Calcutta Auction</h1>
   <p>Welcome, {user?.displayName || user?.email || "Guest"}</p>
    <button onClick={() => signOut()}>Logout</button>

    <CurrentAuctionTeam />      {/* NEW component to show current team */}
    <BidForm />
    <Leaderboard />
    <UpcomingTeams />
    <AdminControls />
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
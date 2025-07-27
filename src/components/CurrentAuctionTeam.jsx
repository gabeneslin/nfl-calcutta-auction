import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import teamLogos from "../utils/teamLogos";
import { getUserColor } from "../utils/colorUtils";

export default function CurrentAuctionTeam() {
  const [currentTeam, setCurrentTeam] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

 useEffect(() => {
  const unsub = onSnapshot(doc(db, "settings", "auction"), (docSnap) => {
    if (docSnap.exists()) {
      const { currentTeamId, highBid, highBidder, currentDeadline } = docSnap.data();
      setDeadline(currentDeadline?.toDate?.());
      if (!currentTeamId) {
        setCurrentTeam(null);
        return;
      }

      // Fetch team details
      const teamRef = doc(db, "teams", currentTeamId);
      onSnapshot(teamRef, (teamSnap) => {
        if (teamSnap.exists()) {
          setCurrentTeam({
            ...teamSnap.data(),
            id: teamSnap.id,
            bid: highBid,
            owner: highBidder,
          });
        }
      });
    } else {
      setCurrentTeam(null);
    }
  });

  return () => unsub();
}, []);

useEffect(() => {
  if (!deadline) {
    setRemainingTime(null);
    return;
  }

  const interval = setInterval(() => {
    const now = new Date();
    const diff = Math.max(0, Math.floor((deadline - now) / 1000));
    setRemainingTime(diff);
  }, 1000);

  return () => clearInterval(interval);
}, [deadline]);

  if (!currentTeam) {
    return <div><h2>🔒 No team currently up for auction</h2></div>;
  }

  return (
    <div style={{
      border: "2px solid #444",
      padding: "1rem",
      marginBottom: "1.5rem",
      borderRadius: "8px",
      background: "#f9f9f9",
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    }}>
    {remainingTime !== null && (
  <p><strong>Time Left:</strong> {String(Math.floor(remainingTime / 60)).padStart(2, '0')}:{String(remainingTime % 60).padStart(2, '0')}</p>
)}
      <img
        src={teamLogos[currentTeam.id]}
        alt={currentTeam.name}
        style={{ width: 48, height: 48 }}
      />
      <div>
        <h2>🟡 Current Team: {currentTeam.name}</h2>
        <p><strong>High Bid:</strong> ${currentTeam.bid ?? 0}</p>
        <p>
          <strong>Owner:</strong>{" "}
          {currentTeam.owner ? (
            <span
              style={{
                fontWeight: 600,
                color: "white",
                backgroundColor: getUserColor(currentTeam.owner),
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {currentTeam.owner}
            </span>
          ) : (
            "Unclaimed"
          )}
        </p>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot
} from "firebase/firestore";
import teamLogos from "../utils/teamLogos";

export default function UpcomingTeams() {
  const [orderedTeams, setOrderedTeams] = useState([]);

  useEffect(() => {
    // Subscribe to teams
    const unsubscribeTeams = onSnapshot(collection(db, "teams"), (teamsSnap) => {
      const teamMap = {};
      teamsSnap.forEach((doc) => {
        teamMap[doc.id] = { id: doc.id, ...doc.data() };
      });

      // Subscribe to auction settings
      const unsubscribeAuction = onSnapshot(doc(db, "settings", "auction"), (auctionSnap) => {
        if (!auctionSnap.exists()) return;
        const data = auctionSnap.data();
        const teamOrder = data.teamOrder || [];
        const currentTeamId = data.currentTeamId;

        if (teamOrder.length === 0 || !currentTeamId) return;

        const index = teamOrder.indexOf(currentTeamId);
        if (index === -1) return;

        const remaining = teamOrder.slice(index);
        const ordered = remaining.map((id) => teamMap[id]).filter(Boolean);
        setOrderedTeams(ordered);
      });

      return unsubscribeAuction;
    });

    return () => unsubscribeTeams();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>🗂 Upcoming Teams</h3>
      <ol>
        {orderedTeams.map((team) => (
          <li key={team.id}>
            <img
              src={teamLogos[team.id]}
              alt={team.name}
              style={{ width: 20, height: 20, marginRight: 6, verticalAlign: "middle" }}
            />
            {team.name} {team.owner ? `(Owned by ${team.owner})` : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
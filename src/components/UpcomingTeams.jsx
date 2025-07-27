import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function UpcomingTeams() {
  const [orderedTeams, setOrderedTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsSnap = await getDocs(collection(db, "teams"));
      const teamMap = {};
      teamsSnap.forEach((doc) => {
        teamMap[doc.id] = { id: doc.id, ...doc.data() };
      });

      const auctionSnap = await getDoc(doc(db, "settings", "auction"));
      if (auctionSnap.exists()) {
        const data = auctionSnap.data();
const teamOrder = data.teamOrder || [];
const currentTeamId = data.currentTeamId;

if (teamOrder.length === 0 || !currentTeamId) return;

const index = teamOrder.indexOf(currentTeamId);
if (index === -1) return;

const remaining = teamOrder.slice(index);
const ordered = remaining.map((id) => teamMap[id]).filter(Boolean);
setOrderedTeams(ordered);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>🗂 Upcoming Teams</h3>
      <ol>
        {orderedTeams.map((team) => (
          <li key={team.id}>
            {team.name} {team.owner ? `(Owned by ${team.owner})` : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
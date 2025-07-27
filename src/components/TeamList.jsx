// src/components/TeamList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import teamLogos from "../utils/teamLogos";
import { getUserColor } from "../utils/colorUtils";
import { saveAs } from "file-saver";

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  
  const exportToCSV = () => {
  const headers = ["Team", "Bid", "Owner"];
  const rows = teams.map((team) => [
    team.name,
    team.bid ?? "",
    team.owner ?? "",
  ]);
  const csvContent =
    [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "nfl_calcutta_teams.csv");
};

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
     const data = snapshot.docs
  .map((doc) => ({ id: doc.id, ...doc.data() }))
  .sort((a, b) => a.name.localeCompare(b.name));
setTeams(data);    });

    return () => unsubscribe();
  }, []);

return (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
    <div style={{ marginBottom: "1rem" }}>
      <button onClick={exportToCSV}>📥 Export Teams to CSV</button>
    </div>

    {teams.map((team) => (
      <div
        key={team.id}
        style={{
          padding: "0.5rem",
          borderRadius: "4px",
          backgroundColor: team.owner ? "#f8f8f8" : "transparent",
          border: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <img
          src={teamLogos[team.id]}
          alt={team.name}
          style={{ width: 24, height: 24 }}
        />
        <div>
          <strong>{team.name}</strong>
          <span style={{ color: "#555", marginLeft: "0.5rem" }}>
            — ${team.bid ?? "N/A"} — Owned by:{" "}
            {team.owner && team.owner !== "" ? (
              <span
                style={{
                  fontWeight: 600,
                  color: "white",
                  backgroundColor: getUserColor(team.owner),
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                }}
              >
                {team.owner}
              </span>
            ) : (
              "Unclaimed"
            )}
          </span>
        </div>
      </div>
    ))}
  </div>
);
}
// src/components/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getUserColor } from "../utils/colorUtils";

export default function Leaderboard() {
  const [summary, setSummary] = useState([]);
  const [totalPot, setTotalPot] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teams = snapshot.docs.map((doc) => doc.data());

      const spendMap = {};
      let pot = 0;

      teams.forEach((team) => {
        if (team.owner && team.bid !== undefined) {
             pot += team.bid;
          if (!spendMap[team.owner]) {
            spendMap[team.owner] = { total: 0, count: 0 };
          }

            spendMap[team.owner].total += team.bid;
          spendMap[team.owner].count += 1;
        }
      });

     const leaderboard = Object.entries(spendMap)
        .map(([owner, stats]) => ({
          owner,
          total: stats.total,
          count: stats.count,
        }))
        .sort((a, b) => b.total - a.total);

      setSummary(leaderboard);
      setTotalPot(pot);
    });

    return () => unsub();
  }, []);

 return (
  <div style={{ marginTop: "2rem" }}>
    <h3>Leaderboard</h3>
    <p><strong>Total Pot:</strong> ${totalPot.toFixed(2)}</p>
    {summary.length === 0 ? (
      <p>No teams have been won yet.</p>
    ) : (
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#eee" }}>
            <th align="left" style={{ padding: "8px" }}>Owner</th>
            <th align="right" style={{ padding: "8px" }}>Spend</th>
            <th align="right" style={{ padding: "8px" }}>Teams</th>
          </tr>
        </thead>
        <tbody>
          {[...summary]
            .sort((a, b) => b.total - a.total)
            .map((entry, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: getUserColor(entry.owner),
                  color: "white",
                }}
              >
                <td style={{ padding: "8px", fontWeight: "bold" }}>{entry.owner}</td>
                <td style={{ padding: "8px" }} align="right">
                  ${entry.total.toFixed(2)}
                </td>
                <td style={{ padding: "8px" }} align="right">
                  {entry.count}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
);
}
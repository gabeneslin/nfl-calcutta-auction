import React, { useEffect, useState } from "react";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import teamLogos from "../utils/teamLogos";
import { getUserColor } from "../utils/colorUtils";

export default function CurrentAuctionTeam() {
  const [currentTeam, setCurrentTeam] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [estimatedPot, setEstimatedPot] = useState("");
  const [projectedWins, setProjectedWins] = useState("");
  const [estimatedPayout, setEstimatedPayout] = useState(null);
  const [propChances, setPropChances] = useState({});
  const [propNames, setPropNames] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "auction"), (docSnap) => {
      if (docSnap.exists()) {
        const { currentTeamId, highBid, highBidder, currentDeadline } = docSnap.data();
        setDeadline(currentDeadline?.toDate?.());
        if (!currentTeamId) {
          setCurrentTeam(null);
          return;
        }

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

  useEffect(() => {
    const pot = parseFloat(estimatedPot);
    const wins = parseFloat(projectedWins);

    const propEV = Object.values(propChances).reduce((sum, val) => {
      const pct = parseFloat(val);
      return sum + (isNaN(pct) ? 0 : pct / 100);
    }, 0);

    if (!isNaN(pot) && !isNaN(wins)) {
      const basePayout = wins * ((0.8 * pot) / 272);
      const propBonus = propNames.length > 0 ? propEV * ((0.2 * pot) / propNames.length) : 0;
      setEstimatedPayout((basePayout + propBonus).toFixed(2));
    } else {
      setEstimatedPayout(null);
    }
  }, [estimatedPot, projectedWins, propChances, propNames]);

  useEffect(() => {
    const fetchProps = async () => {
      const snapshot = await getDocs(collection(db, "props"));
      const props = snapshot.docs.map(doc => doc.data().name).filter(Boolean);
      setPropNames(props);
      const initialChances = Object.fromEntries(props.map(name => [name, ""]));
      setPropChances(initialChances);
    };
    fetchProps();
  }, []);

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
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {remainingTime !== null && (
          <p><strong>Time Left:</strong> {String(Math.floor(remainingTime / 60)).padStart(2, '0')}:{String(remainingTime % 60).padStart(2, '0')}</p>
        )}
       <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
  <img
    src={teamLogos[currentTeam.id]}
    alt={currentTeam.name}
    style={{ width: 48, height: 48 }}
  />
  <h2 style={{ margin: 0 }}>Current Team: {currentTeam.name}</h2>
</div>
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

      {/* 💰 Simulation Tool */}
      <div style={{
        marginTop: "1.5rem",
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}>
        <h3>🔍 Simulate Expected Payout</h3>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label>Estimated Total Pot ($):</label><br />
            <input
              type="number"
              value={estimatedPot}
              onChange={(e) => setEstimatedPot(e.target.value)}
              style={{ width: "120px" }}
            />
          </div>
          <div>
            <label>Projected Wins:</label><br />
            <input
              type="number"
              value={projectedWins}
              onChange={(e) => setProjectedWins(e.target.value)}
              style={{ width: "80px" }}
            />
          </div>
        </div>

        {propNames.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <label><strong>Chance this team wins each prop (%):</strong></label>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {propNames.map((name) => (
                <div key={name}>
                  <label>{name}:</label><br />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={propChances[name] ?? ""}
                    onChange={(e) =>
                      setPropChances({ ...propChances, [name]: e.target.value })
                    }
                    style={{ width: "60px" }}
                  />
                  <span>%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {estimatedPayout !== null && (
          <p><strong>💵 Estimated Payout:</strong> ${estimatedPayout}</p>
        )}
      </div>
    </div>
  );
}
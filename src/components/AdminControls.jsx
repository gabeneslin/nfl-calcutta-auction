// src/components/AdminControls.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase"; // your initialized Firebase app

export default function AdminControls() {
  const { user } = useAuth();
  const [allTeams, setAllTeams] = useState([]);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [teamOrder, setTeamOrder] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(30); // ⏱️ Timer control

  const handlePopulateTeams = async () => {
    try {
      const functions = getFunctions(app);
      const populateTeams = httpsCallable(functions, "populateTeams");
      const result = await populateTeams();
      alert("✅ Teams populated successfully!");
      console.log(result.data.message);
    } catch (err) {
      console.error("❌ Error calling function:", err.message);
      alert("Failed to populate teams.");
    }
  };

  // Sync auction state
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "auction"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentTeamId(data.currentTeamId);
        setTeamOrder(data.teamOrder || []);
        setTimerSeconds(data.timerSeconds ?? 30); // ⏱️ Load saved timer value
      }
    });

    return unsub;
  }, []);

  // Fetch list of teams
  useEffect(() => {
    const fetchTeams = async () => {
      const querySnapshot = await getDocs(collection(db, "teams"));
      const sortedTeams = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setAllTeams(sortedTeams);
    };

    fetchTeams();
  }, []);

  // Track current index
  useEffect(() => {
    const fetchCurrent = async () => {
      const auctionDoc = await getDoc(doc(db, "settings", "auction"));
      if (auctionDoc.exists()) {
        const { currentTeamId } = auctionDoc.data();
        const index = teamOrder.indexOf(currentTeamId);
        setCurrentIndex(index >= 0 ? index : 0);
      }
    };

    if (allTeams.length > 0) fetchCurrent();
  }, [allTeams, teamOrder]);

  const advanceAuction = async () => {
    if (currentIndex === null || currentIndex >= teamOrder.length) return;

    const currentTeamIdFromOrder = teamOrder[currentIndex];
    const nextTeamId = teamOrder[currentIndex + 1] ?? null;

    const auctionRef = doc(db, "settings", "auction");
    const teamRef = doc(db, "teams", currentTeamIdFromOrder);
    const auctionDoc = await getDoc(auctionRef);

    if (auctionDoc.exists()) {
      const { highBid, highBidder } = auctionDoc.data();

      // ✅ Assign final bid and owner to the team doc
      await updateDoc(teamRef, {
        bid: highBid ?? 0,
        owner: highBidder ?? "",
      });

      // ✅ Advance to next team and reset auction state
      await updateDoc(auctionRef, {
        currentTeamId: nextTeamId,
        highBid: 0,
        highBidder: "",
        currentDeadline: nextTeamId
          ? Timestamp.fromDate(new Date(Date.now() + timerSeconds * 1000))
          : null,
      });

      setCurrentIndex(currentIndex + 1);
    }
  };

  return user?.email === "gabeneslin@gmail.com" ? (
    <div style={{ marginTop: "2rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
      <h3>Admin Controls</h3>

      <p>
        Current Team:{" "}
        {allTeams.find((t) => t.id === currentTeamId)?.name ?? "Loading..."}
      </p>

      <button onClick={advanceAuction}>✅ Mark as Sold & Advance</button>

      <button onClick={handlePopulateTeams} style={{ marginTop: "1rem" }}>
        🧹 Reset Teams for New Auction
      </button>

      {/* ⏱️ Timer Controls */}
      <div style={{ marginTop: "1rem" }}>
        <label><strong>Default Timer Duration (seconds):</strong></label><br />
        <input
          type="number"
          value={timerSeconds}
          onChange={(e) => setTimerSeconds(Number(e.target.value))}
          min={5}
          max={300}
          step={5}
          style={{ width: "100px", marginRight: "0.5rem" }}
        />
        <button onClick={async () => {
          await updateDoc(doc(db, "settings", "auction"), {
            timerSeconds
          });
          alert("⏱️ Timer duration updated!");
        }}>
          Save Timer
        </button>
      </div>
    </div>
  ) : null;
}
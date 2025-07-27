// src/components/BidForm.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function BidForm() {
  const { user } = useAuth();
  const [auctionState, setAuctionState] = useState(null);
  const [teams, setTeams] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  // const [teams, setTeams] = useState([]);
  // const [selectedTeamId, setSelectedTeamId] = useState("");
  // const [bidAmount, setBidAmount] = useState("");
  

 useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "auction"), (docSnap) => {
      if (docSnap.exists()) {
        setAuctionState(docSnap.data());
      }
    });
    
    const fetchTeams = async () => {
      const snapshot = await getDocs(collection(db, "teams"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeams(data);
    };

    fetchTeams();
    return () => unsub();
  }, []);
  
const currentTeam = teams.find((t) => t.id === auctionState?.currentTeamId);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!auctionState || !currentTeam || !bidAmount || isNaN(bidAmount)) return;

let bidValue = parseFloat(bidAmount);
const currentHighBid = auctionState?.highBid ?? 0;

if (bidValue === -1) {
  bidValue = currentHighBid + 1;
} else if (bidValue <= currentHighBid) {
  alert(`Your bid must be more than $${currentHighBid}.`);
  return;
} else if (bidValue < currentHighBid + 1) {
  alert(`Minimum increment is $1. Your bid must be at least $${currentHighBid + 1}.`);
  return;
}

  if (auctionState?.highBid !== undefined && bidValue <= auctionState.highBid) {
    alert(`Your bid must be greater than the current bid of $${auctionState.highBid}.`);
    return;
  }
  
  const now = new Date();
if (auctionState?.currentDeadline?.toDate && auctionState.currentDeadline.toDate() < now) {
  alert("The auction for this team has ended. No more bids allowed.");
  return;
}

  const auctionRef = doc(db, "settings", "auction");
  const newDeadline = Timestamp.fromDate(new Date(Date.now() + 30 * 1000)); // ✅ defined first

  await updateDoc(auctionRef, {
    highBid: bidValue,
    highBidder: user.displayName || user.email,
    currentDeadline: newDeadline, // ✅ used safely after definition
  });

  await addDoc(collection(db, "bids"), {
    teamId: currentTeam.id,
    amount: bidAmount,
    bidder: user.displayName || user.email,
    timestamp: serverTimestamp(),
  });

  setBidAmount("");
};
  
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
     <h3>
        Bid on: {currentTeam?.name ?? auctionState?.currentTeamId ?? "Loading..."}
      </h3>
      <p>
        Current bid: ${auctionState?.highBid ?? "N/A"} — High Bidder:{" "}
        {auctionState?.highBidder ?? "None"}
      </p>

     <input
        type="number"
        placeholder="Your bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
     <button
  type="submit"
  disabled={!auctionState?.currentTeamId || !bidAmount}
  style={{ marginLeft: "1rem" }}
>
  Submit Bid
</button>    </form>
  );
}
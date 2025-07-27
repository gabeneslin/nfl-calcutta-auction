// src/components/AllowedUsersAdmin.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function AllowedUsersAdmin() {
  const { user } = useAuth();
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [newEmail, setNewEmail] = useState("");

  const fetchAllowedUsers = async () => {
    const snapshot = await getDocs(collection(db, "allowed_users"));
    const users = snapshot.docs.map((doc) => ({
  id: doc.id,         // document ID (email)
  email: doc.id,      // treat doc ID as email
}));
    setAllowedUsers(users);
  };

  useEffect(() => {
    fetchAllowedUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newEmail) return;
    await setDoc(doc(db, "allowed_users", newEmail), {});
    setNewEmail("");
    fetchAllowedUsers();
  };

  const handleRemoveUser = async (id) => {
    await deleteDoc(doc(db, "allowed_users", id));
    fetchAllowedUsers();
  };

  if (user?.email !== "gabeneslin@gmail.com") return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Allowed Users Admin</h3>
      <input
        type="email"
        placeholder="Enter email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <button onClick={handleAddUser} style={{ marginLeft: "1rem" }}>
        ➕ Add User
      </button>
      <ul>
        {allowedUsers.map((u) => (
          <li key={u.id}>
            {u.email}{" "}
            <button onClick={() => handleRemoveUser(u.id)}>🗑 Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
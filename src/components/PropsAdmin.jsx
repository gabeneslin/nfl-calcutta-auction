import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function PropsAdmin() {
  const [propsList, setPropsList] = useState([]);
  const [newPropName, setNewPropName] = useState("");
  const [newPropWeight, setNewPropWeight] = useState(5);

  useEffect(() => {
    fetchProps();
  }, []);

  const fetchProps = async () => {
    const querySnapshot = await getDocs(collection(db, "props"));
    const props = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPropsList(props);
  };

  const handleAddProp = async () => {
    if (!newPropName.trim()) return;
    await addDoc(collection(db, "props"), {
      name: newPropName,
      weight: parseFloat(newPropWeight) || 0,
    });
    setNewPropName("");
    setNewPropWeight(5);
    fetchProps();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "props", id));
    fetchProps();
  };

  const handleUpdate = async (id, field, value) => {
    const ref = doc(db, "props", id);
    await updateDoc(ref, { [field]: field === "weight" ? parseFloat(value) : value });
    fetchProps();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>🎛️ Manage Prop List</h3>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Prop Name"
          value={newPropName}
          onChange={(e) => setNewPropName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Weight (%)"
          value={newPropWeight}
          onChange={(e) => setNewPropWeight(e.target.value)}
          style={{ width: "80px", marginRight: "0.5rem" }}
        />
        <button onClick={handleAddProp}>Add Prop</button>
      </div>

      <ul>
        {propsList.map((prop) => (
          <li key={prop.id} style={{ marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={prop.name}
              onChange={(e) => handleUpdate(prop.id, "name", e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            <input
              type="number"
              value={prop.weight}
              onChange={(e) => handleUpdate(prop.id, "weight", e.target.value)}
              style={{ width: "60px", marginRight: "0.5rem" }}
            />
            <button onClick={() => handleDelete(prop.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
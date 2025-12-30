import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

export default function DeleteViewingProperty({ selectedViewId }) {
  const id = selectedViewId;
  const navigate = useNavigate();

  const [data, setData] = useState(null);

useEffect(() => {
  if (!id) return; // prevent crash

  const fetchData = async () => {
    try {
      const ref = doc(db, "viewingRequests", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setData(snap.data());
      }
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  fetchData();
}, [id]);


  const handleDelete = async () => {
    const ref = doc(db, "viewingRequests", id);
    await deleteDoc(ref);

    alert("Viewing Request Deleted!");
    navigate("/view-all-viewings");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Delete Viewing Request</h2>

      {data && (
        <>
          <p><strong>Name:</strong> {data.fullName}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Mobile:</strong> {data.mobile}</p>
          <p><strong>Date:</strong> {data.selectedDate}</p>
          <p><strong>Time:</strong> {data.selectedTime}</p>
        </>
      )}

      <button style={{ background: "red", color: "#fff" }} onClick={handleDelete}>
        Confirm Delete
      </button>
    </div>
  );
}

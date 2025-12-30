import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

export default function EditViewingProperty({ selectedViewId }) {
  const id = selectedViewId;  // Use ID coming from AdminDashboard

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    selectedDate: "",
    selectedTime: "",
    propertyId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Prevents the undefined error

      const ref = doc(db, "viewingRequests", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setForm(snap.data());
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const ref = doc(db, "viewingRequests", id);
    await updateDoc(ref, form);

    alert("Viewing Request Updated Successfully!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Viewing Request</h2>

      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile" />
      <input type="date" name="selectedDate" value={form.selectedDate} onChange={handleChange} />
      <input type="time" name="selectedTime" value={form.selectedTime} onChange={handleChange} />
      <input name="propertyId" value={form.propertyId} onChange={handleChange} placeholder="Property ID" />

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}

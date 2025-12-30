import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

export default function ViewPropertyRequest({ onEdit, onDelete }) {
  const [requests, setRequests] = useState([]);
  const [propertyNames, setPropertyNames] = useState({});

  // Update collection names as per your database
  const LAND_COLLECTION = "landPortfolio";
  const RESIDENTIAL_COLLECTION = "residentialPortfolio";

  // Auto-pick property name field (title, name, etc.)
  const getNameField = (data) =>
    data.title ||
    data.name ||
    data.propertyName ||
    data.propertyTitle ||
    "Unnamed Property";

  // Searches in Land → if not found → Residential
  const fetchPropertyName = async (propertyId) => {
    try {
      // 1️⃣ Check LAND collection
      const landRef = doc(db, LAND_COLLECTION, propertyId);
      const landSnap = await getDoc(landRef);

      if (landSnap.exists()) {
        return getNameField(landSnap.data());
      }

      // 2️⃣ Check RESIDENTIAL collection
      const resRef = doc(db, RESIDENTIAL_COLLECTION, propertyId);
      const resSnap = await getDoc(resRef);

      if (resSnap.exists()) {
        return getNameField(resSnap.data());
      }

      return "Not Found";
    } catch (err) {
      console.error("Error fetching property name:", err);
      return "Not Found";
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "viewingRequests"));

      const data = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setRequests(data);

      const names = {};
      const fetchPromises = data.map(async (item) => {
        if (item.propertyId) {
          names[item.propertyId] = await fetchPropertyName(item.propertyId);
        }
      });

      await Promise.all(fetchPromises);
      setPropertyNames(names);
    };

    fetchRequests();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Viewing Property Requests</h2>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Date</th>
            <th>Time</th>
            <th>Property ID</th>
            <th>Property Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No viewing requests found.
              </td>
            </tr>
          ) : (
            requests.map((item) => (
              <tr key={item.id}>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.selectedDate}</td>
                <td>{item.selectedTime}</td>
                <td>{item.propertyId}</td>

                {/* Show fetched name from Land/Residential portfolio */}
                <td>{propertyNames[item.propertyId] || "Loading..."}</td>

                <td>
                  <button
                    onClick={() => onEdit(item.id)}
                    style={{
                      marginRight: "10px",
                      padding: "4px 8px",
                      background: "#4caf50",
                      color: "#fff",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    style={{
                      padding: "4px 8px",
                      background: "red",
                      color: "#fff",
                      borderRadius: "4px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
  
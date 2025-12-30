// setUserRole.js (CommonJS version - MULTI-ROLE SUPPORT)
const admin = require("firebase-admin");

// Load service account JSON
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ----------------------------
// SET USER UID + ROLES HERE
// ----------------------------
const uid = "jJaFAVCRncVmPk07mGYNqrOxMbz2";

// OPTIONS:
// "admin"
// "agent"
// "admin+agent"
// ["admin", "agent"]
const roles = ["admin", "agent"]; 
// ----------------------------

// Convert roles into clean object
const claims = {};

// If user passes array of roles
if (Array.isArray(roles)) {
  roles.forEach((r) => {
    claims[r] = true;
  });
}

// If user uses "admin+agent"
else if (typeof roles === "string" && roles.includes("+")) {
  roles.split("+").forEach((r) => {
    claims[r] = true;
  });
}

// Single role
else if (typeof roles === "string") {
  claims[roles] = true;
}

admin
  .auth()
  .setCustomUserClaims(uid, claims)
  .then(() => {
    console.log("=====================================");
    console.log("✔ Roles updated successfully!");
    console.log(`✔ UID: ${uid}`);
    console.log("✔ Assigned claims:", claims);
    console.log("-------------------------------------");
    console.log("👉 User must LOG OUT and LOG IN again");
    console.log("   for the new role(s) to apply.");
    console.log("=====================================");
  })
  .catch((err) => {
    console.error("❌ ERROR while setting user role:", err);
  });

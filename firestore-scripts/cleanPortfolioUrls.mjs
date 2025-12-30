import admin from "firebase-admin";
import fs from "fs";

// Load service account key
const serviceAccount = JSON.parse(
  fs.readFileSync("./firestore-scripts/serviceAccountKey.json", "utf8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const PROJECT_DOMAIN = "https://igahymbyfdfahtglpvcg.supabase.co";
const BUCKET = "portfolio-images";

const fixImageUrl = (url) => {
  if (!url) return "";

  const clean = url
    .split("http")
    .filter((x) => x.includes("supabase"))
    .pop();

  if (!clean) return "";

  const fixed = "http" + clean;

  const idx = fixed.lastIndexOf(BUCKET + "/");
  if (idx === -1) return "";

  const path = fixed.slice(idx);

  return `${PROJECT_DOMAIN}/storage/v1/object/public/${path}`;
};

const COLLECTIONS = [
  "residentialPortfolio",
  "commercialPortfolio",
  "landPortfolio",
];

async function cleanAll() {
  console.log("\n🔥 Starting Firestore Cleanup...\n");

  for (const collectionName of COLLECTIONS) {
    console.log(`📁 Checking: ${collectionName}`);

    const snapshot = await db.collection(collectionName).get();

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      if (!data.images || !Array.isArray(data.images)) continue;

      const original = data.images;
      const cleaned = Array.from(
        new Set(original.map(fixImageUrl).filter(Boolean))
      );

      if (JSON.stringify(original) === JSON.stringify(cleaned)) {
        console.log(`✔ Already clean: ${docSnap.id}`);
        continue;
      }

      await docSnap.ref.update({ images: cleaned });

      console.log(`✨ FIXED: ${docSnap.id}`);
      console.log("  BEFORE:", original);
      console.log("  AFTER: ", cleaned);
    }
  }

  console.log("\n🎉 Cleanup Complete!");
}

cleanAll();

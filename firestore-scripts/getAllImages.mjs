import admin from "firebase-admin";
import fs from "fs";

// Load Firebase Admin credentials
const serviceAccount = JSON.parse(
  fs.readFileSync("./firestore-scripts/serviceAccountKey.json", "utf8")
);

// Initialize Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const COLLECTIONS = [
  "residentialPortfolio",
  "commercialPortfolio",
  "landPortfolio",
];

async function getAllImages() {
  console.log("\n📸 Fetching ALL Images from Firestore...\n");

  let allImages = [];

  for (const colName of COLLECTIONS) {
    console.log(`📁 Checking collection: ${colName}`);

    const snap = await db.collection(colName).get();

    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const images = data.images || [];

      if (Array.isArray(images) && images.length) {
        console.log(`✔ Found ${images.length} images in ${docSnap.id}`);
        allImages.push(...images);
      }
    }
  }

  // Remove duplicates
  allImages = Array.from(new Set(allImages));

  // Save to file
  fs.writeFileSync(
    "./firestore-scripts/allImages.json",
    JSON.stringify(allImages, null, 2)
  );

  console.log("\n🎉 DONE!");
  console.log(`📸 Total Unique Images Found: ${allImages.length}`);
  console.log("📁 Saved to: firestore-scripts/allImages.json\n");
}

getAllImages();

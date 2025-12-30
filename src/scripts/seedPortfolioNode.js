// Node.js script to seed portfolio data
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase config - replace with your actual config
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample portfolio data
const residentialSamples = [
  {
    title: "Ocean View Villa",
    category: 'residential',
    subcategory: 'villa',
    status: 'for-sale',
    price: "$2,500,000",
    location: {
      address: "Cruz Bay, St. John, VI 00830",
      quarter: "Cruz Bay",
      country: "US"
    },
    images: ["https://example.com/villa1.jpg"],
    description: "Stunning ocean view villa with modern amenities and private pool.",
    features: {
      beds: 4,
      baths: 3,
      sqft: "3,200",
      pool: true
    },
    amenities: ["Ocean Views", "Private Pool", "Gourmet Kitchen", "Air Conditioning"],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'manual'
  },
  {
    title: "Cozy Coral Bay Cottage",
    category: 'residential',
    subcategory: 'cottage',
    status: 'for-sale',
    price: "$895,000",
    location: {
      address: "Coral Bay, St. John, VI 00830",
      quarter: "Coral Bay",
      country: "US"
    },
    images: ["https://example.com/cottage1.jpg"],
    description: "Charming cottage with tropical gardens and mountain views.",
    features: {
      beds: 2,
      baths: 2,
      sqft: "1,200",
      pool: false
    },
    amenities: ["Mountain Views", "Tropical Gardens", "Wrap-around Deck"],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'manual'
  }
];

const landSamples = [
  {
    title: "Prime Building Lot",
    category: 'land',
    subcategory: 'land',
    status: 'for-sale',
    price: "$450,000",
    location: {
      address: "Estate Carolina, St. John, VI 00830",
      quarter: "Coral Bay",
      country: "US"
    },
    images: ["https://example.com/land1.jpg"],
    description: "Prime building lot with panoramic views and easy access.",
    overview: {
      lotSizeSqFt: 25000,
      lotSizeAcres: 0.57,
      grade: "Moderate"
    },
    details: {
      zoning: "R-1 Residential",
      access: "paved road"
    },
    mls: "25-100",
    type: "Land",
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'manual'
  }
];

const recentSales = [
  {
    title: "Sold Villa Paradise",
    category: 'residential',
    subcategory: 'villa',
    status: 'recent-sale',
    price: "$1,850,000",
    soldPrice: "$1,800,000",
    soldDate: new Date('2024-09-15'),
    location: {
      address: "Fish Bay, St. John, VI 00830",
      quarter: "Fish Bay",
      country: "US"
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
    ],
    description: "Beautiful villa recently sold with ocean access.",
    features: {
      beds: 3,
      baths: 2,
      sqft: "2,400",
      pool: true
    },
    amenities: ["Ocean Access", "Private Pool", "Sunset Views"],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'manual'
  }
];

async function seedPortfolios() {
  try {
    console.log('🚀 Starting portfolio seeding...');

    // Seed residential portfolio
    console.log('🏠 Seeding residential portfolio...');
    for (const item of [...residentialSamples, ...recentSales.filter(s => s.category === 'residential')]) {
      const docRef = await addDoc(collection(db, 'residentialPortfolio'), item);
      console.log(`✅ Added ${item.title} with ID: ${docRef.id}`);
    }

    // Seed land portfolio
    console.log('🏞️ Seeding land portfolio...');
    for (const item of landSamples) {
      const docRef = await addDoc(collection(db, 'landPortfolio'), item);
      console.log(`✅ Added ${item.title} with ID: ${docRef.id}`);
    }

    console.log('🎉 Portfolio seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error seeding portfolios:', error);
    process.exit(1);
  }
}

// Run the seeding
seedPortfolios();
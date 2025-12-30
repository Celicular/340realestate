import { getAgents, getAgent } from "../firebase/firestore";

// Import local images for fallback
import tina10 from "../assets/agent/tina/tina10.png";
import tammy1 from "../assets/agent/tammy/tammy1.jpg";
import jenn1 from "../assets/agent/Jenn/jenn1.jpg";
import adonis1 from "../assets/agent/adronis/adronis1.jpg";

// Cache for agents data
let cachedAgents = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Default fallback data (same structure as before but as fallback)
const defaultAgentsData = [
  {
    id: 1,
    legacyId: 1,
    name: "Tammy Donnelly",
    title: "Broker/Owner/ABR®",
    bio: "Tammy Donnelly has lived on St. John since 1978. Her first retail job was in 1979 – 1981 here at the ..",
    fullBio: "Tammy Donnelly has lived on St. John since 1978. Her first retail job was in 1979 – 1981 here at the Wharfside Village. Tammy has been a licensed real estate agent since 1989 and has owned 340 Real Estate Company since 1999. She specializes in residential sales and vacation rental management.",
    image: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tammy-Donnelly-About-150x150.jpg",
    email: "340realestateco@gmail.com",
    phone: "+1 340-643-6068",
    location: "St. John, USVI",
    specialties: ["Residential Sales", "Vacation Rental Management", "Property Investment"],
    additionalImages: [],
  },
  {
    id: 2,
    legacyId: 2,
    name: "Jennifer Doran",
    title: "Sales Associate",
    bio: "Jennifer arrived on St. John in the mid 80's, just in time to celebrate her 18th birthday! Jennifer .",
    fullBio: "Jennifer arrived on St. John in the mid 80's, just in time to celebrate her 18th birthday! Jennifer has been a part of the island community for decades and brings extensive local knowledge to every transaction.",
    image: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Jennifer-Doran-home-334x500-1-150x150.jpg",
    email: "jdoran.340realestate@gmail.com",
    phone: "+1 340-998-0006",
    location: "St. John, USVI",
    specialties: ["Residential Sales", "Local Market Expert"],
    additionalImages: [],
  },
  {
    id: 3,
    legacyId: 3,
    name: "Tina Petitto",
    title: "Sales Associate",
    bio: "Tina Petitto has lived on St John since 2004, when she left her then position as Director of Finance",
    fullBio: "Tina Petitto has lived on St John since 2004, when she left her then position as Director of Finance. She brings her financial expertise and deep island knowledge to help clients navigate the real estate market with confidence.",
    image: tina10,
    email: "tina340realestate@gmail.com",
    phone: "+1 305-299-4411",
    location: "St. John, USVI",
    specialties: ["Financial Analysis", "Investment Properties", "Market Analysis"],
    additionalImages: [],
  },
  {
    id: 4,
    legacyId: 4,
    name: "Rosanne Ramos Lloyd",
    title: "Sales Associate",
    bio: "Rosanne Ramos Lloyd is the newest sales agent to join 340 Real Estate Company. Born and raised in ...",
    fullBio: "Rosanne Ramos Lloyd is the newest sales agent to join 340 Real Estate Company. Born and raised in the Virgin Islands, she brings local expertise and fresh perspective to the team.",
    image: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Rosanne-Ramos-Lloyd-150x150.jpg",
    email: "340realestaterrl@gmail.com",
    phone: "+1 401-996-6751",
    location: "St. John, USVI",
    specialties: ["First-time Buyers", "Local Market"],
    additionalImages: [],
  },
  {
    id: 5,
    legacyId: 5,
    name: "Jenn Manes",
    title: "Sales Associate",
    bio: "Jenn Manes is the newest realtor to join 340 Real Estate Co. She has blogged about St. John real ...",
    fullBio: "Jenn Manes is the newest realtor to join 340 Real Estate Co. She has blogged about St. John real estate and brings digital marketing expertise and passion for the island to every client interaction.",
    image: "https://340realestatestjohn.com/wp-content/uploads/2024/05/image0-150x150.png",
    email: "jenn@explorestj.com",
    phone: "+1 203-376-3786",
    location: "St. John, USVI",
    specialties: ["Digital Marketing", "Content Creation", "Modern Sales"],
    additionalImages: [],
  },
  {
    id: 6,
    legacyId: 6,
    name: "Adonis Morton",
    title: "Sales Associate",
    bio: "Born, raised and educated on ST Thomas, Adonis moved to St John 20 years ago after meeting and ...",
    fullBio: "Born, raised and educated on ST Thomas, Adonis moved to St John 20 years ago after meeting and marrying his wife. His deep knowledge of both islands makes him an invaluable resource for clients.",
    image: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Adonis-Morton-2-150x150.jpg",
    email: "adonis.340realestate@gmail.com",
    phone: "+1 340-690-0338",
    location: "St. John, USVI",
    specialties: ["Inter-island Knowledge", "Local Connections", "Community Relations"],
    additionalImages: [],
  },
  {
    id: 7,
    legacyId: 7,
    name: "Mary Moroney",
    title: "Sales Associate",
    bio: "Mary Moroney hails from New England, born and raised in Connecticut she moved north to Maine in ..",
    fullBio: "Mary Moroney hails from New England, born and raised in Connecticut she moved north to Maine. She brings her northeastern work ethic and attention to detail to Caribbean real estate.",
    image: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mary-Moroney-welcome-page-150x150.jpg",
    email: "mcm.340realestate@gmail.com",
    phone: "+1 340-244-6664",
    location: "St. John, USVI",
    specialties: ["Attention to Detail", "Client Service", "Mainland Connections"],
    additionalImages: [],
  },
  {
    id: 8,
    legacyId: 8,
    name: "John McCann",
    title: "Broker Associate",
    bio: "Born in Hawaii, John has always had island living in his blood. Life leads him from Hawaii to ...",
    fullBio: "Born in Hawaii, John has always had island living in his blood. Life leads him from Hawaii to the Virgin Islands, bringing his island lifestyle expertise to help clients find their perfect tropical home.",
    image: "https://340realestatestjohn.com/wp-content/uploads/2024/02/John-McCann-150x150.jpg",
    email: "john@helloimjohn.com",
    phone: "+1 340-998-0423",
    location: "St. John, USVI",
    specialties: ["Island Lifestyle", "Luxury Properties", "Investment Advisory"],
    additionalImages: [],
  },
  {
    id: 9,
    legacyId: 9,
    name: "Mark Shekleton",
    title: "Sales Associate",
    bio: "Mark Shekleton arrived on St. John in 1979 and has been a full-time resident since. Mark started a .",
    fullBio: "Mark Shekleton arrived on St. John in 1979 and has been a full-time resident since. Mark started a construction company and has extensive knowledge of island building and development.",
    image: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mark-Shekleton-500x500-1-150x150.jpg",
    email: "mark@seaviewhomes.com",
    phone: "+1 340-513-2608",
    location: "St. John, USVI",
    specialties: ["Construction", "Development", "Property Renovation"],
    additionalImages: [],
  },
];

// Transform Firebase agent data to match our expected format
const transformFirebaseAgent = (firebaseAgent) => {
  return {
    id: firebaseAgent.legacyId || firebaseAgent.id,
    legacyId: firebaseAgent.legacyId || firebaseAgent.id,
    name: firebaseAgent.name,
    title: firebaseAgent.title,
    bio: firebaseAgent.bio,
    fullBio: firebaseAgent.fullBio || firebaseAgent.bio,
    image: firebaseAgent.image,
    email: firebaseAgent.email,
    phone: firebaseAgent.phone,
    location: firebaseAgent.location || "St. John, USVI",
    specialties: firebaseAgent.specialties || [],
    additionalImages: firebaseAgent.additionalImages || [],
    allImages: firebaseAgent.allImages || []
  };
};

// Check if cache is still valid
const isCacheValid = () => {
  return cachedAgents && lastFetched && (Date.now() - lastFetched < CACHE_DURATION);
};

// Fetch agents from Firebase with caching
export const fetchAgentsData = async () => {
  try {
    // Return cached data if still valid
    if (isCacheValid()) {
      console.log('📋 Using cached agents data');
      return cachedAgents;
    }

    console.log('🔄 Fetching agents from Firebase...');
    const result = await getAgents();
    
    if (result.success && result.agents && result.agents.length > 0) {
      // Transform Firebase data to our expected format
      const transformedAgents = result.agents.map(transformFirebaseAgent);
      
      // Cache the data
      cachedAgents = transformedAgents;
      lastFetched = Date.now();
      
      console.log('✅ Successfully fetched agents from Firebase:', transformedAgents.length);
      return transformedAgents;
    } else {
      console.log('⚠️ No agents found in Firebase, using default data');
      cachedAgents = defaultAgentsData;
      lastFetched = Date.now();
      return defaultAgentsData;
    }
  } catch (error) {
    console.error('❌ Error fetching agents from Firebase:', error);
    console.log('📋 Falling back to default agents data');
    return defaultAgentsData;
  }
};

// Get all agents (with caching)
export const agentsData = await fetchAgentsData().catch(() => defaultAgentsData);

// Helper function to get agent by ID (works with both Firebase and default data)
export const getAgentById = async (id) => {
  try {
    const agents = await fetchAgentsData();
    return agents.find(agent => 
      agent.id === parseInt(id) || 
      agent.legacyId === parseInt(id) ||
      agent.id === id ||
      agent.legacyId === id
    );
  } catch (error) {
    console.error('Error getting agent by ID:', error);
    return defaultAgentsData.find(agent => 
      agent.id === parseInt(id) || agent.legacyId === parseInt(id)
    );
  }
};

// Helper function to get all agent images including additional ones
export const getAgentImages = (agent) => {
  if (!agent) return [];
  
  const mainImage = agent.image;
  const additionalImages = agent.additionalImages || [];
  const allImages = agent.allImages || [];
  
  // Prefer allImages if available, otherwise combine main + additional
  if (allImages.length > 0) {
    return allImages;
  }
  
  return [mainImage, ...additionalImages].filter(Boolean);
};

// Force refresh agents data
export const refreshAgentsData = async () => {
  console.log('🔄 Force refreshing agents data...');
  cachedAgents = null;
  lastFetched = null;
  return await fetchAgentsData();
};

// Export for backward compatibility
export { defaultAgentsData as fallbackAgentsData };
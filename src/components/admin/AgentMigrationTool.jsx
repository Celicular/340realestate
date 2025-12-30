import React, { useState, useCallback } from 'react';
import { Users, Upload, Download, Check, X, AlertCircle, Trash2, Edit } from 'lucide-react';
import { bulkAddAgents, getAgents, deleteAgent, updateAgent } from '../../firebase/firestore';

// Static agent data from AgentDetail.jsx
const staticAgentsData = [
  {
    legacyId: 1,
    name: "Tammy Donnelly",
    title: "Broker / Owner / ABR®",
    bio: "Tammy Donnelly has lived on St. John since 1978. Her first retail job was in 1979 – 1981 here at the 340 Real Estate Company. She has been a licensed real estate agent since 1981 and has been the broker/owner of 340 Real Estate Company since 1985.",
    fullBio: `Tammy Donnelly has lived on St. John since 1978. Her first retail job was in 1979 – 1981 here at the Dockshop.

Prior to earning her real estate brokers license in 2000, Tammy worked for many years as a restaurant manager and a vacation rental home manager on St. John. She is also the former owner/builder of the "Tennis Villa" and has experience in the construction and development field.

Tammy has served on the St John Board of Realtors for seven years; two terms as President, a Board member of the Fish Bay Owners Association, Past President of the St. John Antilles Parent Association, and current Board member of the Friends of the Park. She supports many other community organizations including (St John Cancer Fund, Friends of the Park, Love City Pan Dragons, the ACC and more) and environmental organizations here and abroad.

Tammy and her husband Jeff another longtime island resident reside in Fish Bay. Jeff is the owner of Jolly Dog and Zemi Designs stores located in Isola Shoppes in Coral Bay.

Tammy has gained the respect of customers and clients who recognize her dedication, hard work, honesty and knowledge in real estate. Tammy prides herself on providing excellent customer service.`,
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tammy-Donnelly-About.jpg",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tammy-Donnelly-About.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/IMG_3838-375x500.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Tammy-Donnelly.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/IMG_5960-375x500.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Tammy-Grandbabies.jpg"
    ],
    email: "340realestateco@gmail.com",
    phone: "+1 340-643-6068",
    experience: "40+ Years",
    specialties: ["Luxury Properties", "Investment Properties", "Beachfront Homes", "Commercial Real Estate"],
    achievements: ["Top Producer 2023", "Luxury Property Specialist", "Community Leader Award"],
    location: "Cruz Bay, St. John",
    status: "active"
  },
  {
    legacyId: 2,
    name: "Jennifer Doran",
    title: "Sales Associate",
    bio: "Jennifer arrived on St. John in the mid 80's, just in time to celebrate her 18th birthday! Jennifer has been a licensed real estate agent since 1990.",
    fullBio: `Jennifer arrived on St. John in the mid 80's, just in time to celebrate her 18th birthday! Jennifer was born and raised in Germany and the mountains of the Basque country, world famous for its exquisite surfing beaches and the beauty of the Pyrenees Mountains. Her love for beautiful places brought Jennifer to St. John when her father asked her to work with him on his new venture, the first "true" grocery store on island and NY style deli.

After many years, Jennifer left the successful family business and opened the famous Dockside Pub on St. John. For 12 years she was the first smiling face you saw when arriving by ferry to St. John. Her passion for food and hard work made Dockside Pub a local favorite and it is still missed 14 years after its closing. Her two sons Justin and Julien, who were both born and raised in St. John, had their lunch boxes coveted daily for the fabulous sandwiches Jennifer packed for them!

Jennifer eventually took her natural salesmanship abilities to the Westin St. John and successfully sold vacation ownership for 13 years. Her friendly and hardworking personality made her a favorite among Westin St. John clients.

Life in an office became too sedentary for this energetic lady and it became time to move on to her long dreamt passion for real estate sales and property management. Her never-ending quest for perfection and exemplary customer service makes this an easy transition for Jennifer. She has traded her corporate heels for flip flops and is quickly growing her property management business with several homes already under her management.

Jennifer joined 340 Real Estate in 2015 and is very excited to translate her love and knowledge of St. John into finding the perfect home for clients looking for their own beloved piece of the island. Her never-ending smile and trusting soul make her the right choice for anyone looking to buy or sell property on this little slice of paradise she has called home for over 30 years.`,
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Jennifer-Doran-home-334x500-1.jpg",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/02/Jennifer-Doran-home-334x500-1.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Jennifer-Doran-Family-500x335.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Jennifer-Doran-Happy-500x333.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Jennifer-Doran.jpg"
    ],
    email: "jdoran.340realestate@gmail.com",
    phone: "+1 340-998-0006",
    experience: "30+ Years",
    specialties: ["Residential Sales", "Property Management", "First-time Buyers", "Island Properties"],
    achievements: ["Excellence in Service Award", "Top Sales Associate 2022"],
    location: "Coral Bay, St. John",
    status: "active"
  },
  {
    legacyId: 3,
    name: "Tina Petitto",
    title: "Sales Associate",
    bio: "Tina Petitto has lived on St John since 2004, when she left her then position as Director of Finance to pursue her passion for real estate.",
    fullBio: `Tina Petitto has lived on St John since 2004, when she left her then position as Director of Finance for the Sales and Marketing Division of Hearst Publications in Charlotte, NC. She spent her childhood until the age of 21 living in the Middle East and SE Asia. Time away from home was spent at boarding school, college and the Graduate School at Villanova University.

In the late 80's she was introduced to St John by her still best friend from High School. After a short two year stay, and many return visits, she moved back with her family. Tina is a Finance and Accounting Manager for many St John businesses, owns several rental properties, and has recently become more formally involved in the world of Real Estate.

She currently resides in quiet and peaceful Fish Bay with her contractor husband, Joe Nogueira.

Her daughter, stepson, and two stepdaughters live in the Carolinas, which is a place still close to her heart. She loves spending time in Miami visiting her mother and, most of all, traveling and exploring the world with her daughter and family.`,
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tina-Petitto-sm.jpg",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tina-Petitto-sm.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Maia-Tina.png",
      "https://340realestateco.com/wp-content/uploads/2021/10/Joe-Tina-500x425.png"
    ],
    email: "tina340realestate@gmail.com",
    phone: "+1 305-299-4411",
    experience: "15+ Years",
    specialties: ["Investment Properties", "Financial Analysis", "Property Valuation", "Market Trends"],
    achievements: ["Financial Excellence Award", "Investment Specialist"],
    location: "Cruz Bay, St. John",
    status: "active"
  },
  {
    legacyId: 4,
    name: "Rosanne Ramos Lloyd",
    title: "Sales Associate",
    bio: "Rosanne Ramos Lloyd is the newest sales agent to join 340 Real Estate Company. Born and raised in the Virgin Islands, she brings local expertise and fresh perspective.",
    fullBio: `Rosanne Ramos Lloyd is the newest sales agent to join 340 Real Estate Company. Born and raised in Houston Texas, Rosanne started what would become a lifelong Residential Design career with a Bachelor's Degree in Architecture from the University of Houston in 1997. After five years working as a designer in the office of Natalye Appel + Associates Architects LLC, she left Houston for Rhode Island School of Design to complete her Masters in Industrial Design. After graduating, Rosanne taught in the Undergraduate ID program at RISD and started her own design practice, Inclusion By Design LLC. During her time in Rhode Island, Rosanne was introduced to St. John when she met the owner of Maho Bay Camps, Stanley Selengut, in New York. Stanley's interest in Rosanne's work was routed in her commitment inclusive design, and then grew to impact the development, and later renovation, of Concordia Eco-Resort.

Rosanne met her future husband Wayne on St. John in 2004 while working on "Building a Destination for All, 2005;" an awareness raising initiative for the tourism industry to develop an island wide physical infrastructure accessible for all ages and abilities, specifically aging populations and persons with disabilities. In January 2010 Rosanne moved full time to St John, married Wayne and continued her design work.

Rosanne has 23 years of professional experience working directly with homeowners on residential design, construction administration and owner representation. Rosanne is owner of Antares Property & Hospitality LLC, serving St. John homeowners with management and marketing of short-term villa rentals. Subsequently, she and her husband opened Island Host, a full-service concierge located in the Isola Shops Building in Coral Bay.

Since 2005, Rosanne has donated her professional expertise on the Francis Bay Accessible Trail, and Cinnamon Bay Accessible Trail through Friends of the Virgin Islands National Park and has taken commissioned work with FVINP, including a comprehensive accessibility study of the park's beaches and trail system, as well as a Trail Ratings Project. Rosanne is an active member of FVINP advisory council.

Prior to 340 and Antares, Rosanne was principal of Inclusion By Design LLC, an interdisciplinary design practice committed to creating built environments, products, systems, and graphic information for people across all ages and abilities. Her hands-on, collaborative style of research, analysis, and design is a result of her multidisciplinary training in Architecture and Industrial Design combined with her 23 years of professional experience. Rosanne's work history is diverse in industry and scope. Her greatest talent is for understanding the multiplicity in human experience and using that knowledge to ensure user-centered solutions. Her capabilities range from lead designer, project manager, and primary consultant to construction administrator.

Under Rosanne's direction, Inclusion By Design became an established leader in the field of inclusive strategy for both public and private projects. Her passion and commitment to socially responsible and sustainable design remains a significant part of her life's work. The confidence that is displayed in her work comes from understanding the impact her design will have on people's lives and receiving that knowledge as an obligation and responsibility to demonstrate discipline and accountability in everything she does. Rosanne has been invited to speak at national and international forums, from Nevada to Florida and from Brazil to Mozambique, about these issues and to showcase her work.

Her gift is in listening and understanding to the wants, needs and tastes of her clients. Her expertise is in knowing how design impacts usability and the satisfaction of each individual client.

Focus
Real Estate / Property Management
Home Design, Addition & Renovation
Inclusive Design / Universal Design / Human Centered Design
Assistive Technology / Ethnographic Research Methodologies
User Experience / Collaborative & Inclusive Processes
Beyond ADA Compliance`,
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Rosanne-Ramos-Lloyd.jpg",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/02/Rosanne-Ramos-Lloyd.jpg",
      "https://340realestateco.com/wp-content/uploads/2023/05/Rosanne-768x822.jpeg"
    ],
    email: "340realestaterrl@gmail.com",
    phone: "+1 401-996-6751",
    experience: "5+ Years",
    specialties: ["Local Market Expertise", "New Construction", "Luxury Homes", "International Buyers"],
    achievements: ["Rising Star Award", "Local Expert Recognition"],
    location: "St. John, USVI",
    status: "active"
  },
  {
    legacyId: 5,
    name: "Jenn Manes",
    title: "Sales Associate",
    bio: "Jenn Manes is the newest realtor to join 340 Real Estate Co. She has blogged about St. John real estate and brings digital marketing expertise.",
    fullBio: `Jenn Manes is the newest realtor to join 340 Real Estate Co. She has blogged about St. John real estate for over a decade and discusses it almost daily with her island tour guests. Jenn is very excited to formally launch her real estate career here in St. John.

Jenn Manes and sonJenn moved to St. John from Connecticut more than 10 years ago. She launched News of St. John, an online blog geared toward tourists in 2013, and was the owner and publisher until it was sold in 2020. During that time, she created St. Johnopoly, a Monopoly-style board game that was customized for the island of St. John. Jenn has provided in-person island tours since 2017 and launched Explore STJ, a newer online blog for tourists in 2022. Prior to moving to the island, Jenn worked as a marketing director for a university in Connecticut and also as an award-winning crime reporter.

Jenn officially became a homeowner on St. John in 2023 when she purchased an adorable little cottage in Fish Bay (with the help of 340 Real Estate Co., of course!). She lives with her longtime partner Mike Hedy, their five-year-old son Dalton, who attends Gifft Hill School, and Lucy, their rambunctious ACC rescue cat.

Jenn is on the board of the Animal Care Center (ACC) and the Estate Fish Bay Owners' Association. In her free time, Jenn enjoys gardening, snorkeling with Dalton and hiking around the island.

If you'd like to know more about the happenings in St. John, please check out Jenn's blog at www.explorestj.com.`,
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/05/image0.png",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/05/image0.png",
      "https://340realestateco.com/wp-content/uploads/2024/05/Jenn-Manes-2-1152x1536.jpg"
    ],
    email: "jenn@explorestj.com",
    phone: "+1 203-376-3786",
    experience: "3+ Years",
    specialties: ["Digital Marketing", "Property Photography", "Social Media", "First-time Buyers"],
    achievements: ["Digital Innovation Award", "Marketing Excellence"],
    location: "St. John, USVI",
    status: "active"
  },
  {
    legacyId: 6,
    name: "Adonis Morton",
    title: "Sales Associate",
    bio: "Born, raised and educated on ST Thomas, Adonis moved to St John 20 years ago after meeting and marrying his wife.",
    fullBio: `Born, raised and educated on ST Thomas, Adonis moved to St John 20 years ago after meeting and falling in love with his now wife, Krista. In addition to being a family man raising two daughters Triniese and Aria, Adonis has over 30 years in the banking field, in positions ranging from Consumer Loan Officer and Mortgage Specialist to Branch, Collections, Operation and REO Management. Adonis also currently holds memberships on The VI Real Estate Appraiser's Board and the St John Caner Fund Board. Adonis is well-known throughout his island community for volunteering his DJ and MC skills to many community organizations fundraisers such as, St John Cancer Fund, Friends of NPS, Team River Runner, ACC, Gifft Hill School etc. Adonis and Krista truly embrace their commitment to family life and community involvement.`,
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Adonis-Morton-2.jpg",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/02/Adonis-Morton-2.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/image2-1-300x300.jpeg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Adonis2-768x1024.jpeg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Adonis-Family.jpeg"
    ],
    email: "adonis.340realestate@gmail.com",
    phone: "+1 340-690-0338",
    experience: "20+ Years",
    specialties: ["Local Market", "Island Properties", "Community Integration", "Cultural Expertise"],
    achievements: ["Local Expert Award", "Community Service Recognition"],
    location: "St. John, USVI",
    status: "active"
  },
  {
    legacyId: 7,
    name: "Mary Moroney",
    title: "Sales Associate",
    bio: "Mary Moroney hails from New England, born and raised in Connecticut she moved north to Maine in her early twenties.",
    fullBio: `Mary Moroney hails from New England, born and raised in Connecticut she moved north to Maine in 1976. In Maine, she raised her children and was a K-12 Art teacher with over 500 students per week. Mary and husband Tim bought land on St John in 1998 as their 5 children were emptying the nest. They had a 5-year plan to sell all of their property in Maine so they could sail their boat down to St John and build a home. In 2003 they pushed off the mooring in Rockland, Maine and sailed to St John. Their adventure had begun in earnest and although there were rough seas at times and hoops to jump through with the building process they managed to build their home on St John. Mary and Tim were designers, general contractors, builders, electricians, carpenters, tilers, masons, plumbers, and laborers.

Their home is masonry, poured concrete with wood jalousie windows and doors. Although they did hire help for large cement pours, they managed to achieve the build themselves with patience and hard work. This experience has given Mary great insight into the building process and how to make dreams come true. Mary is a board member of Estate Fish Bay Owners Association. Mary and Tim love life and have an ever-growing family of their 5 children they have 16 grandchildren. Let her put her passion and experience to work for you!`,
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mary-Moroney-welcome-page.jpg",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mary-Moroney-welcome-page.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Mary-Tim-Moroney-500x391.jpg"
    ],
    email: "mcm.340realestate@gmail.com",
    phone: "+1 340-244-6664",
    experience: "15+ Years",
    specialties: ["Mainland to Island Transitions", "Luxury Properties", "Property Management", "Relocation Services"],
    achievements: ["Relocation Specialist", "Luxury Property Expert"],
    location: "St. John, USVI",
    status: "active"
  },
  {
    legacyId: 8,
    name: "John McCann",
    title: "Broker Associate",
    bio: "Born in Hawaii, John has always had island living in his blood. Life leads him from Hawaii to various tropical destinations.",
    fullBio: `Born in Hawaii, John has always had island living in his blood. Life leads him from Hawaii to southern California and then to Boston where he began his real estate career in 1995, over 20 years ago. Needing to escape the harsh winters in the northeast, John discovered St. John and the rest is history. He made a 2-year plan to uproot his life and move to paradise, but, he couldn't wait that long…18 months later, in 2001, St. John was home and he began his St. John real estate career. John brings a multi-faceted, progressive approach to his real estate career and is licensed in the US Virgin Islands, California, and Massachusetts.

Whether you are looking to buy or sell, John would love to put his over 20 years of real estate experience to work for you.`,
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/02/John-McCann.jpg",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/02/John-McCann.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/John-McCann.jpg"
    ],
    email: "john@helloimjohn.com",
    phone: "+1 340-998-0423",
    experience: "25+ Years",
    specialties: ["Island Properties", "Luxury Real Estate", "Investment Analysis", "Tropical Markets"],
    achievements: ["Island Property Specialist", "Broker Excellence Award"],
    location: "St. John, USVI",
    status: "active"
  },
  {
    legacyId: 9,
    name: "Mark Shekleton",
    title: "Sales Associate",
    bio: "Mark Shekleton arrived on St. John in 1979 and has been a full-time resident since. Mark started his real estate career in the early 1980s.",
    fullBio: "Mark Shekleton is one of St. John's longest-standing real estate professionals, having arrived on the island in 1979 and been a full-time resident ever since. His career in real estate began in the early 1980s, giving him over four decades of experience in the St. John market. Mark's deep historical knowledge of the island's development and real estate evolution makes him an invaluable resource for understanding market trends and property values. His long-term perspective helps clients make informed decisions about their real estate investments.",
    profileImage: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mark-Shekleton-500x500-1.jpg",
    galleryImages: [
      "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mark-Shekleton-500x500-1.jpg",
      "https://340realestateco.com/wp-content/uploads/2021/10/Mark-Shekleton-500x500.jpg"
    ],
    email: "mark@seaviewhomes.com",
    phone: "+1 340-513-2608",
    experience: "40+ Years",
    specialties: ["Historical Market Knowledge", "Property Development", "Investment Properties", "Market Analysis"],
    achievements: ["Lifetime Achievement Award", "Market Expert Recognition"],
    location: "St. John, USVI",
    status: "active"
  }
];

const AgentMigrationTool = () => {
  const [loading, setLoading] = useState(false);
  const [migratedAgents, setMigratedAgents] = useState([]);
  const [firestoreAgents, setFirestoreAgents] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingAgent, setEditingAgent] = useState(null);

  // Load existing agents from Firestore
  const loadFirestoreAgents = useCallback(async () => {
    try {
      const result = await getAgents({ sortBy: 'name' });
      if (result.success) {
        setFirestoreAgents(result.data);
      }
    } catch (error) {
      console.error('Error loading Firestore agents:', error);
    }
  }, []);

  // Initial load of Firestore agents
  React.useEffect(() => {
    loadFirestoreAgents();
  }, [loadFirestoreAgents]);

  // Migrate agents to Firestore
  const handleMigration = async () => {
    if (firestoreAgents.length > 0) {
      setMessage({
        type: 'warning',
        text: 'Agents already exist in Firestore. Use "Force Re-migrate" to replace existing data.'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: 'Starting agent migration...' });

    try {
      const result = await bulkAddAgents(staticAgentsData);
      
      if (result.success) {
        setMigratedAgents(result.results);
        setMessage({
          type: 'success',
          text: `Successfully migrated ${staticAgentsData.length} agents to Firestore!`
        });
        // Reload Firestore agents
        await loadFirestoreAgents();
      } else {
        setMessage({
          type: 'error',
          text: `Migration failed: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Migration error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Force re-migration (clear and re-add)
  const handleForceMigration = async () => {
    setLoading(true);
    setMessage({ type: 'info', text: 'Force re-migrating agents...' });

    try {
      // Delete existing agents
      for (const agent of firestoreAgents) {
        await deleteAgent(agent.id);
      }

      // Add new agents
      const result = await bulkAddAgents(staticAgentsData);
      
      if (result.success) {
        setMigratedAgents(result.results);
        setMessage({
          type: 'success',
          text: `Successfully re-migrated ${staticAgentsData.length} agents to Firestore!`
        });
        // Reload Firestore agents
        await loadFirestoreAgents();
      } else {
        setMessage({
          type: 'error',
          text: `Re-migration failed: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Re-migration error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete agent
  const handleDeleteAgent = async (agentId, agentName) => {
    if (!window.confirm(`Are you sure you want to delete ${agentName}?`)) {
      return;
    }

    try {
      const result = await deleteAgent(agentId);
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Successfully deleted ${agentName}`
        });
        await loadFirestoreAgents();
      } else {
        setMessage({
          type: 'error',
          text: `Failed to delete ${agentName}: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error deleting ${agentName}: ${error.message}`
      });
    }
  };

  // Start editing agent
  const handleEditAgent = (agent) => {
    setEditingAgent({ ...agent });
  };

  // Save agent changes
  const handleSaveAgent = async () => {
    if (!editingAgent) return;

    try {
      const { id, createdAt, updatedAt, ...updateData } = editingAgent;
      const result = await updateAgent(id, updateData);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Successfully updated ${editingAgent.name}`
        });
        setEditingAgent(null);
        await loadFirestoreAgents();
      } else {
        setMessage({
          type: 'error',
          text: `Failed to update agent: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error updating agent: ${error.message}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      
       
        

      
        {/* Messages */}
        {message.text && (
          <div className={`mt-4 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : message.type === 'warning'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' && <Check className="h-4 w-4" />}
              {message.type === 'error' && <X className="h-4 w-4" />}
              {message.type === 'warning' && <AlertCircle className="h-4 w-4" />}
              {message.type === 'info' && <AlertCircle className="h-4 w-4" />}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}
    

      {/* Firestore Agents List */}
      {firestoreAgents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Agents in Firestore ({firestoreAgents.length})
          </h3>
          
          <div className="space-y-4">
            {firestoreAgents.map((agent) => (
              <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={agent.profileImage}
                      alt={agent.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/avatar.jpeg';
                      }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <p className="text-sm text-gray-600">{agent.title}</p>
                      <p className="text-sm text-gray-500">{agent.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.status}
                    </span>
                    
                    <button
                      onClick={() => handleEditAgent(agent)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteAgent(agent.id, agent.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Experience:</span>
                    <span className="text-gray-600 ml-2">{agent.experience}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="text-gray-600 ml-2">{agent.location}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="text-gray-600 ml-2">{agent.phone}</span>
                  </div>
                </div>
                
                {agent.specialties && agent.specialties.length > 0 && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700 text-sm">Specialties:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {agent.specialties.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{agent.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Agent: {editingAgent.name}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingAgent.name || ''}
                      onChange={(e) => setEditingAgent({...editingAgent, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingAgent.title || ''}
                      onChange={(e) => setEditingAgent({...editingAgent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingAgent.email || ''}
                      onChange={(e) => setEditingAgent({...editingAgent, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editingAgent.phone || ''}
                      onChange={(e) => setEditingAgent({...editingAgent, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingAgent.status || 'active'}
                    onChange={(e) => setEditingAgent({...editingAgent, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAgent}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentMigrationTool;
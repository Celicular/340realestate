import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addAgent } from '../firebase/firestore';

// Import local images
import tina10 from '../assets/agent/tina/tina10.png';

// Original agents data to migrate
const agentsToMigrate = [
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
    active: true,
    dateJoined: "1999-01-01"
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
    active: true,
    dateJoined: "1985-01-01"
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
    active: true,
    dateJoined: "2004-01-01"
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
    active: true,
    dateJoined: "2023-01-01"
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
    active: true,
    dateJoined: "2024-01-01"
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
    active: true,
    dateJoined: "2004-01-01"
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
    active: true,
    dateJoined: "2020-01-01"
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
    active: true,
    dateJoined: "2019-01-01"
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
    active: true,
    dateJoined: "1979-01-01"
  }
];

const AgentDataMigration = () => {
  const navigate = useNavigate();
  const [migrationStatus, setMigrationStatus] = useState({
    inProgress: false,
    completed: false,
    errors: [],
    successCount: 0,
    currentAgent: '',
    results: []
  });

  const startMigration = async () => {
    setMigrationStatus({
      inProgress: true,
      completed: false,
      errors: [],
      successCount: 0,
      currentAgent: '',
      results: []
    });

    const results = [];
    let successCount = 0;
    const errors = [];

    for (const agent of agentsToMigrate) {
      setMigrationStatus(prev => ({
        ...prev,
        currentAgent: agent.name
      }));

      try {
        const result = await addAgent({
          ...agent,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        if (result.success) {
          successCount++;
          results.push({
            name: agent.name,
            status: 'success',
            message: 'Successfully migrated'
          });
        } else {
          errors.push(`${agent.name}: ${result.error}`);
          results.push({
            name: agent.name,
            status: 'error',
            message: result.error
          });
        }
      } catch (error) {
        errors.push(`${agent.name}: ${error.message}`);
        results.push({
          name: agent.name,
          status: 'error',
          message: error.message
        });
      }

      // Small delay to avoid overwhelming Firebase
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setMigrationStatus({
      inProgress: false,
      completed: true,
      errors,
      successCount,
      currentAgent: '',
      results
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-tropical-600 hover:text-tropical-700 font-medium mb-4"
          >
            <ArrowLeft size={20} /> Back to Admin
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agent Data Migration
          </h1>
          <p className="text-gray-600">
            Migrate all agent data from local files to Firebase Firestore
          </p>
        </motion.div>

        {/* Migration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {!migrationStatus.inProgress && !migrationStatus.completed && (
            <div className="text-center">
              <Upload size={48} className="text-tropical-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Migrate Agent Data
              </h2>
              <p className="text-gray-600 mb-6">
                This will migrate {agentsToMigrate.length} agents to Firebase Firestore.
              </p>
              <button
                onClick={startMigration}
                className="px-6 py-3 bg-tropical-600 text-white font-medium rounded-lg hover:bg-tropical-700 transition-colors"
              >
                Start Migration
              </button>
            </div>
          )}

          {migrationStatus.inProgress && (
            <div className="text-center">
              <Loader size={48} className="text-tropical-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Migration in Progress...
              </h2>
              <p className="text-gray-600 mb-6">
                Currently migrating: <span className="font-medium">{migrationStatus.currentAgent}</span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-tropical-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(migrationStatus.results.length / agentsToMigrate.length) * 100}%` 
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {migrationStatus.results.length} / {agentsToMigrate.length} completed
              </p>
            </div>
          )}

          {migrationStatus.completed && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="text-center">
                {migrationStatus.errors.length === 0 ? (
                  <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                ) : (
                  <XCircle size={48} className="text-red-600 mx-auto mb-4" />
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Migration {migrationStatus.errors.length === 0 ? 'Completed' : 'Finished with Errors'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{migrationStatus.successCount}</div>
                    <div className="text-sm text-green-700">Successful</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">{migrationStatus.errors.length}</div>
                    <div className="text-sm text-red-700">Errors</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{agentsToMigrate.length}</div>
                    <div className="text-sm text-blue-700">Total</div>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Migration Results:</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {migrationStatus.results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        result.status === 'success' 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      {result.status === 'success' ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <XCircle size={16} className="text-red-600" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.name}</div>
                        <div className={`text-sm ${
                          result.status === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {result.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 bg-tropical-600 text-white rounded-lg hover:bg-tropical-700 transition-colors"
                >
                  Continue to Admin
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This migration will create agent documents in Firebase Firestore. 
            Once completed, the website will fetch agent data from Firebase instead of local files.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentDataMigration;
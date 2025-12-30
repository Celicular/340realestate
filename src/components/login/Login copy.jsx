// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../../firebase/auth';
// import { getUser, addUser } from '../../firebase/firestore';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log('🔐 Login attempt started');
//     console.log('📧 Email:', email);
//     console.log('🔑 Password length:', password.length);
    
//     // Basic validation
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       console.log('❌ Validation failed: Missing fields');
//       return;
//     }

//     try {
//       console.log('🔥 Authenticating with Firebase...');
      
//       // Step 1: Authenticate with Firebase Auth
//       const authResult = await loginUser(email, password);
      
//       if (!authResult.success) {
//         setError(authResult.error);
//         console.log('❌ Firebase Auth login failed:', authResult.error);
//         return;
//       }

//       console.log('✅ Firebase Auth successful:', authResult.user);

//       // Step 2: Get user data from Firestore
//       let firestoreResult = await getUser(authResult.user.uid);
      
//       if (!firestoreResult.success) {
//         console.log('⚠️ User not found in Firestore, creating profile...');
        
//         // Create user profile in Firestore if it doesn't exist
//         const userData = {
//           uid: authResult.user.uid,
//           email: authResult.user.email,
//           name: authResult.user.displayName || authResult.user.email.split('@')[0],
//           role: 'agent', // Default role
//           displayName: authResult.user.displayName || authResult.user.email.split('@')[0],
//           createdAt: new Date(),
//           updatedAt: new Date()
//         };
        
//         const createResult = await addUser(userData);
//         if (!createResult.success) {
//           setError('Failed to create user profile: ' + createResult.error);
//           console.log('❌ Failed to create user profile:', createResult.error);
//           return;
//         }
        
//         firestoreResult = { success: true, data: userData };
//         console.log('✅ User profile created in Firestore');
//       }

//       const userData = firestoreResult.data;
//       console.log('📝 User data from Firestore:', userData);

//       // Step 3: Set session data
//       localStorage.setItem('userToken', authResult.user.uid);
//       localStorage.setItem('userEmail', userData.email);
//       localStorage.setItem('userName', userData.name);
//       localStorage.setItem('userRole', userData.role);
//       localStorage.setItem('userId', authResult.user.uid);
      
//       console.log('🔑 Session data set in localStorage');
//       console.log('🔄 Redirecting to dashboard for role:', userData.role);
      
//       // Small delay to ensure localStorage is properly set
//       setTimeout(() => {
//         // Redirect based on role
//         if (userData.role === 'admin') {
//           console.log('🚀 Navigating to admin dashboard...');
//           navigate('/admin/admindashboard');
//         } else if (userData.role === 'agent') {
//           console.log('🚀 Navigating to agent dashboard...');
//           navigate('/agent/agentdashboard');
//         } else {
//           console.log('🚀 Navigating to user dashboard...');
//           navigate('/dashboard');
//         }
//       }, 100);

//     } catch (error) {
//       console.error('❌ Login error:', error);
//       setError('Login failed: ' + error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-brand-light to-tropical-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">
//           Login
//         </h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-3 border rounded-lg"
//             required
//           />
          
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-3 border rounded-lg"
//             required
//           />
          
//           {error && <p className="text-red-500 text-sm">{error}</p>}
          
//           <button
//             type="submit"
//             className="w-full bg-brand-dark text-white p-3 rounded-lg hover:bg-brand-dark/90"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-center mt-4 text-sm">
//           Don't have an account?{' '}
//           <Link to="/register" className="text-brand-dark hover:underline">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

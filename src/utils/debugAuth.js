// Debug utility for authentication system

export const debugRegistration = () => {
  console.log('=== REGISTRATION SYSTEM DEBUG ===');
  
  // Check localStorage users
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  console.log('📊 Total registered users:', users.length);
  console.log('👥 Users in localStorage:', users);
  
  // Check current session
  const currentUser = {
    token: localStorage.getItem('userToken'),
    email: localStorage.getItem('userEmail'),
    name: localStorage.getItem('userName'),
    role: localStorage.getItem('userRole'),
    id: localStorage.getItem('userId')
  };
  console.log('🔑 Current session:', currentUser);
  
  // Test password encoding
  const testPassword = 'test123';
  const encodedPassword = btoa(testPassword);
  const decodedPassword = atob(encodedPassword);
  console.log('🔐 Password encoding test:');
  console.log('  Original:', testPassword);
  console.log('  Encoded:', encodedPassword);
  console.log('  Decoded:', decodedPassword);
  
  return { users, currentUser };
};

export const clearAllUsers = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  console.log('🧹 All user data cleared from localStorage');
};

export const addTestUser = () => {
  const testUser = {
    id: Date.now().toString(),
    name: 'Test User',
    email: 'test@example.com',
    password: btoa('password123'),
    role: 'agent',
    createdAt: new Date().toISOString()
  };
  
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  existingUsers.push(testUser);
  localStorage.setItem('users', JSON.stringify(existingUsers));
  
  console.log('✅ Test user added:', testUser);
  return testUser;
};

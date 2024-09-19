// Mock decryption function (implement stronger encryption methods in real projects)
function decryptCredentials(encryptedConfig) {
    try {
      const decryptedConfig = JSON.parse(atob(encryptedConfig)); // Base64 decoding
      return decryptedConfig;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
  
  // Firebase initialization function
  function initializeFirebase() {
    const encryptedFirebaseConfig = 'eyJhcGlLZXkiOiJBSXphU3lBS05rYUh1cXlDR3NkT0pNUDBjelJ1N0VhQ0ZwZTZuNDAiLCJhdXRoRG9tYWluIjoibmlraXRtZWh0YS02MzMzMi5maXJlYmFzZWFwcC5jb20iLCJkYXRhYmFzZVVSTCI6Imh0dHBzOi8vbmlraXRtZWh0YS02MzMzMi1kZWZhdWx0LXJ0ZGIuYXNpYS1zb3V0aGVhc3QxLmZpcmViYXNlZGF0YWJhc2UuYXBwIiwicHJvamVjdElkIjoibmlraXRtZWh0YS02MzMzMiIsInN0b3JhZ2VCdWNrZXQiOiJuaWtpdG1laHRhLTYzMzMyLmFwcHNwb3QuY29tIiwibWVzc2FnaW5nU2VuZGVySWQiOiIzMDM5MTYyMTI0MDQiLCJhcHBJZCI6IjE6MzAzOTE2MjEyNDA0OndlYjo0YjVmMzM5ZjM4NDUyYTIyZmRmN2UxIiwibWVhc3VyZW1lbnRJZCI6IkctTjdLWjFZSkUzWCJ9'; // This should be a Base64 string of encrypted config
    
    // Decrypt the credentials
    const firebaseConfig = decryptCredentials(encryptedFirebaseConfig);
    
    if (!firebaseConfig) {
      console.error('Failed to decrypt Firebase configuration');
      return;
    }
  
    // Check if Firebase is already initialized
      try {
        firebase.initializeApp(firebaseConfig);
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
  }
  
  // Call the initialization function
  initializeFirebase();
  
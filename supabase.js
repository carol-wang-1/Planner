// Supabase Client Configuration
// This file initializes Supabase for your planner app

const SUPABASE_URL = 'https://proqzlrhzihqgkmgdaqi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb3F6bHJoemlocWdrbWdkYXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDIxMjksImV4cCI6MjA3OTgxODEyOX0.KlDYsckGn5R168_8VmAEzlEvITuOtgQgKrSHdTZTgv8';

// Create Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Current user (will be set after login)
let currentUser = null;

// Check if user is already logged in
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        currentUser = session.user;
        console.log('User logged in:', currentUser.email);
        
        // Hide auth page, show main app
        document.getElementById('authPage').classList.add('hidden');
        document.getElementById('mainApp').classList.add('visible');
        document.getElementById('mainAppContent').style.display = 'flex';
        
        // Show user email in sidebar
        const sidebarEmail = document.getElementById('sidebarUserEmail');
        if (sidebarEmail) {
            sidebarEmail.textContent = currentUser.email;
        }
        
        // Show user email in top right (if it exists)
        const userEmailDisplay = document.getElementById('userEmailDisplay');
        if (userEmailDisplay) {
            userEmailDisplay.textContent = currentUser.email;
        }
        
        // Load user data
        if (typeof loadData === 'function') {
            loadData();
        }
    } else {
        currentUser = null;
        console.log('User logged out');
        
        // Show auth page, hide main app
        document.getElementById('authPage').classList.remove('hidden');
        document.getElementById('mainApp').classList.remove('visible');
        document.getElementById('mainAppContent').style.display = 'none';
    }
});

// Export for use in other files
window.supabaseClient = supabase;
window.getCurrentUser = () => currentUser;

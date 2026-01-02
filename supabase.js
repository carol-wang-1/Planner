// Supabase Client Configuration

const SUPABASE_URL = 'https://proqzlrhzihqgkmgdaqi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb3F6bHJoemlocWdrbWdkYXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDIxMjksImV4cCI6MjA3OTgxODEyOX0.KlDYsckGn5R168_8VmAEzlEvITuOtgQgKrSHdTZTgv8';

// Create Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Current user
let currentUser = null;

// Export for use in other files - MOVED TO TOP
window.supabaseClient = supabaseClient;
window.getCurrentUser = () => currentUser;

// Check if user is already logged in on page load
(async function checkInitialAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (session) {
        // User is logged in - show app immediately
        currentUser = session.user;
        showMainApp();
    } else {
        // User is not logged in - show auth page
        showAuthPage();
    }
})();

// Listen for auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
        currentUser = session.user;
        showMainApp();
    } else {
        currentUser = null;
        showAuthPage();
    }
});

function showMainApp() {
    const authPage = document.getElementById('authPage');
    const mainApp = document.getElementById('mainApp');
    const mainAppContent = document.getElementById('mainAppContent');
    
    authPage.style.display = 'none';
    authPage.classList.add('hidden');
    
    mainApp.style.display = 'flex';
    mainApp.classList.add('visible');
    
    if (mainAppContent) {
        mainAppContent.style.display = 'flex';
    }
    
    // Show user email in sidebar
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    if (userEmailDisplay && currentUser) {
        userEmailDisplay.textContent = currentUser.email;
    }
    
    // Load user data
    if (typeof loadData === 'function') {
        loadData();
    }
}

function showAuthPage() {
    const authPage = document.getElementById('authPage');
    const mainApp = document.getElementById('mainApp');
    const mainAppContent = document.getElementById('mainAppContent');
    
    authPage.style.display = 'flex';
    authPage.classList.remove('hidden');
    
    mainApp.style.display = 'none';
    mainApp.classList.remove('visible');
    
    if (mainAppContent) {
        mainAppContent.style.display = 'none';
    }
}

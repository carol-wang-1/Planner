// Authentication Module

// Switch between login and signup forms
function switchAuthMode(mode) {
    const loginBtn = document.getElementById('authLoginBtn');
    const signupBtn = document.getElementById('authSignupBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (mode === 'login') {
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Sign up new user
async function signUp() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (!email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    // Disable button
    const signupBtn = document.querySelector('#signupForm button[type="submit"]');
    const originalText = signupBtn.textContent;
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating account...';
    
    try {
        const { data, error } = await window.supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: window.location.origin
            }
        });
        
        if (error) {
            console.error('Signup error:', error);
            alert(error.message);
            signupBtn.disabled = false;
            signupBtn.textContent = originalText;
            return;
        }
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
            alert('Please check your email to confirm your account before logging in.');
            signupBtn.disabled = false;
            signupBtn.textContent = originalText;
            
            // Clear form
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
            document.getElementById('signupConfirmPassword').value = '';
            
            // Switch to login form
            switchAuthMode('login');
            return;
        }
        
        // Success - user logged in automatically (no email confirmation required)
        if (data.user && data.session) {
            // Initialize user data
            await initializeUserData(data.user.id);
            
            console.log('Account created and logged in!');
            
            // Clear form
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
            document.getElementById('signupConfirmPassword').value = '';
            
            // The onAuthStateChange in supabase.js will handle showing the app
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred. Please try again.');
        signupBtn.disabled = false;
        signupBtn.textContent = originalText;
    }
}

// Log in existing user
async function logIn() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    // Disable button
    const loginBtn = document.querySelector('#loginForm button[type="submit"]');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            alert('Invalid email or password');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Log In';
            return;
        }
        
        // Success - clear form
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again.');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Log In';
    }
}

// Log out user
async function logOut() {
    if (confirm('Are you sure you want to log out?')) {
        await window.supabaseClient.auth.signOut();
        
        // Clear data
        data = {
            tasks: [],
            shopping: [],
            ideas: [],
            notes: [],
            calendar: [],
            events: [],
            habits: [],
            routines: [],
            customCategories: [],
            shoppingCategories: [],
            taskCategories: [],
            habitCategories: []
        };
        
        // Clear displays
        if (typeof renderAllSections === 'function') {
            renderAllSections();
        }
    }
}

// Enter key handlers for auth forms
document.addEventListener('DOMContentLoaded', () => {
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirm = document.getElementById('signupConfirmPassword');
    
    if (loginEmail) {
        loginEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginPassword.focus();
        });
    }
    
    if (loginPassword) {
        loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') logIn();
        });
    }
    
    if (signupEmail) {
        signupEmail.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') signupPassword.focus();
        });
    }
    
    if (signupPassword) {
        signupPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') signupConfirm.focus();
        });
    }
    
    if (signupConfirm) {
        signupConfirm.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') signUp();
        });
    }
});

// Make functions globally accessible
window.switchAuthMode = switchAuthMode;
window.signUp = signUp;
window.logIn = logIn;
window.logOut = logOut;

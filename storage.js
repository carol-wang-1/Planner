// Storage Module - Syncs with Supabase

let data = {
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

// Load data from Supabase
async function loadData() {
    if (!currentUser) {
        console.error('❌ No user logged in');
        return;
    }

    try {
        console.log('📥 Loading data for user:', currentUser.id);
        
        const { data: userData, error } = await supabaseClient
            .from('users_data')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No data found, initialize it
                console.log('⚠️ No data found, initializing...');
                await initializeUserData(currentUser.id);
                return;
            }
            console.error('❌ Error loading data:', error);
            throw error;
        }

        if (userData) {
            // Load all data from database
            data.tasks = userData.tasks || [];
            data.shopping = userData.shopping || [];
            data.ideas = userData.ideas || [];
            data.notes = userData.notes || [];
            data.calendar = userData.calendar || [];
            data.events = userData.events || [];
            data.habits = userData.habits || [];
            data.routines = userData.routines || [];
            // NOTE: Database columns are lowercase!
            data.customCategories = userData.customcategories || [];
            data.shoppingCategories = userData.shoppingcategories || [];
            data.taskCategories = userData.taskcategories || [];
            data.habitCategories = userData.habitcategories || [];
            
            console.log('✅ Data loaded successfully!');
            console.log('📊 Summary:', {
                tasks: data.tasks.length,
                shopping: data.shopping.length,
                ideas: data.ideas.length,
                notes: data.notes.length,
                events: data.events.length,
                habits: data.habits.length,
                routines: data.routines.length
            });
            
            // Render all sections after loading
            if (typeof renderAllSections === 'function') {
                renderAllSections();
            }
        }
    } catch (error) {
        console.error('❌ Fatal error loading data:', error);
        alert('Failed to load your data. Please refresh the page.');
    }
}

// Save data to Supabase
async function saveData() {
    if (!currentUser) {
        console.error('❌ Cannot save: No user logged in');
        return;
    }

    try {
        console.log('💾 Saving data...');
        
        const dataToSave = {
            tasks: data.tasks,
            shopping: data.shopping,
            ideas: data.ideas,
            notes: data.notes,
            calendar: data.calendar,
            events: data.events,
            habits: data.habits,
            routines: data.routines,
            // NOTE: Database columns are lowercase!
            customcategories: data.customCategories,
            shoppingcategories: data.shoppingCategories,
            taskcategories: data.taskCategories,
            habitcategories: data.habitCategories,
            updated_at: new Date().toISOString()
        };
        
        console.log('📊 Data being saved:', {
            tasks: dataToSave.tasks.length,
            shopping: dataToSave.shopping.length,
            events: dataToSave.events.length,
            habits: dataToSave.habits.length,
            routines: dataToSave.routines.length
        });

        const { data: result, error } = await supabaseClient
            .from('users_data')
            .update(dataToSave)
            .eq('user_id', currentUser.id)
            .select();

        if (error) {
            console.error('❌ Error saving data:', error);
            alert('Failed to save data: ' + error.message);
            return;
        }

        console.log('✅ Data saved successfully!');
        console.log('📝 Saved to database:', result);
        
    } catch (error) {
        console.error('❌ Fatal error saving data:', error);
        alert('Failed to save data. Please try again.');
    }
}

// Initialize user data (called on first signup or when no data exists)
async function initializeUserData(userId) {
    try {
        console.log('🔧 Initializing new user data for:', userId);
        
        const emptyData = {
            user_id: userId,
            tasks: [],
            shopping: [],
            ideas: [],
            notes: [],
            calendar: [],
            events: [],
            habits: [],
            routines: [],
            // NOTE: Database columns are lowercase!
            customcategories: [],
            shoppingcategories: [],
            taskcategories: [],
            habitcategories: []
        };

        const { data: result, error } = await supabaseClient
            .from('users_data')
            .insert([emptyData])
            .select();

        if (error) {
            // Check if user data already exists
            if (error.code === '23505') {
                console.log('ℹ️ User data already exists, loading...');
                await loadData();
                return;
            }
            console.error('❌ Error initializing user data:', error);
            throw error;
        }

        console.log('✅ User data initialized!', result);
        
        // Set local data to empty
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
        
        // Render all sections
        if (typeof renderAllSections === 'function') {
            renderAllSections();
        }
        
    } catch (error) {
        console.error('❌ Fatal error initializing user data:', error);
        alert('Failed to initialize your account. Please contact support.');
    }
}

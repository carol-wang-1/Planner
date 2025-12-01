
// Storage Module - Syncs with Supabase instead of localStorage

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
        console.error('No user logged in');
        return;
    }

    try {
        const { data: userData, error } = await supabaseClient
            .from('users_data')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No data found, initialize it
                await initializeUserData(currentUser.id);
                return;
            }
            console.error('Error loading data:', error);
            return;
        }

        if (userData) {
            // Load all data from database
            data = {
                tasks: userData.tasks || [],
                shopping: userData.shopping || [],
                ideas: userData.ideas || [],
                notes: userData.notes || [],
                calendar: userData.calendar || [],
                events: userData.events || [],
                habits: userData.habits || [],
                routines: userData.routines || [],
                customCategories: userData.customCategories || [],
                shoppingCategories: userData.shoppingCategories || [],
                taskCategories: userData.taskCategories || [],
                habitCategories: userData.habitCategories || []
            };
            
            console.log('Data loaded from Supabase');
            renderAllSections();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Save data to Supabase
async function saveData() {
    if (!currentUser) {
        console.error('No user logged in');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('users_data')
            .update({
                tasks: data.tasks,
                shopping: data.shopping,
                ideas: data.ideas,
                notes: data.notes,
                events: data.events,
                habits: data.habits,
                routines: data.routines,
                customCategories: data.customCategories,
                shoppingCategories: data.shoppingCategories,
                taskCategories: data.taskCategories,
                habitCategories: data.habitCategories,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', currentUser.id);

        if (error) {
            console.error('Error saving data:', error);
            return;
        }

        console.log('Data saved to Supabase');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Initialize user data on Supabase (called on first signup)
async function initializeUserData(userId) {
    try {
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
            customCategories: [],
            shoppingCategories: [],
            taskCategories: [],
            habitCategories: []
        };

        const { error } = await supabaseClient
            .from('users_data')
            .insert([emptyData]);

        if (error) {
            console.error('Error initializing user data:', error);
            return;
        }

        data = emptyData;
        console.log('User data initialized');
    } catch (error) {
        console.error('Error:', error);
    }
}
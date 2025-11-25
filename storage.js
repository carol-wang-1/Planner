// Storage Module - Handles data persistence
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

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('plannerData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            data = {
                tasks: parsed.tasks || [],
                shopping: parsed.shopping || [],
                ideas: parsed.ideas || [],
                notes: parsed.notes || [],
                calendar: parsed.calendar || [],
                events: parsed.events || [],
                habits: parsed.habits || [],
                routines: parsed.routines || [],
                customCategories: parsed.customCategories || [],
                shoppingCategories: parsed.shoppingCategories || [],
                taskCategories: parsed.taskCategories || [],
                habitCategories: parsed.habitCategories || []
            };
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('plannerData', JSON.stringify(data));
        console.log('Data saved successfully');
    } catch (e) {
        console.error('Error saving data:', e);
    }
}
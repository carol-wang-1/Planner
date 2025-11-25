// Initialization Module - Sets up the app

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            switchSection(section);
        });
    });
}

function switchSection(sectionName) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const navButton = document.querySelector(`[data-section="${sectionName}"]`);
    if (navButton) {
        navButton.classList.add('active');
    }
    
    // Update section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const sectionElement = document.getElementById(sectionName);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    // Save current section to localStorage
    localStorage.setItem('currentSection', sectionName);
    
    // Re-render the section to ensure data is displayed
    if (sectionName === 'ideas') {
        renderIdeas();
    } else if (sectionName === 'calendar') {
        renderCalendar();
    } else if (sectionName === 'events') {
        renderEvents();
    } else if (sectionName === 'notes') {
        renderNotes();
    } else if (sectionName === 'tasks') {
        renderTasks();
    } else if (sectionName === 'shopping') {
        renderShopping();
    } else if (sectionName === 'habits') {
        renderHabits();
    } else if (sectionName === 'routine') {
        renderRoutines();
    }
}

// Restore last viewed section
function restoreLastSection() {
    const lastSection = localStorage.getItem('currentSection');
    
    // If there's a saved section, switch to it
    if (lastSection) {
        switchSection(lastSection);
    } else {
        // Default to tasks if no saved section
        switchSection('tasks');
    }
}

// Apply hover colors to filter buttons
function applyFilterHoverColors() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-color]');
    filterButtons.forEach(btn => {
        const color = btn.getAttribute('data-color');
        if (color) {
            btn.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.setProperty('background-color', color, 'important');
                    this.style.setProperty('border-color', color, 'important');
                    this.style.setProperty('color', '#ffffff', 'important');
                }
            });
            btn.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.removeProperty('background-color');
                    this.style.removeProperty('border-color');
                    this.style.removeProperty('color');
                }
            });
        }
    });
}

// Observer to apply colors when filters are re-rendered
const filterObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            applyFilterHoverColors();
        }
    });
});

// Render all sections
function renderAllSections() {
    console.log('Rendering all sections...');
    try {
        renderTasks();
        renderShopping();
        renderIdeas();
        renderNotes();
        renderEvents();
        renderHabits();
        if (typeof renderRoutines === 'function') {
            renderRoutines();
        }
        console.log('All sections rendered successfully');
    } catch (error) {
        console.error('Error rendering sections:', error);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initializing...');
    
    try {
        // STEP 1: Load data first
        loadData();
        console.log('Data loaded:', data);
        
        // STEP 2: Setup navigation
        setupNavigation();
        
        // STEP 3: Update ALL category dropdowns
        if (typeof updateCategoryOptions === 'function') {
            updateCategoryOptions();
        }
        if (typeof updateShoppingCategoryOptions === 'function') {
            updateShoppingCategoryOptions();
        }
        if (typeof updateTaskCategoryOptions === 'function') {
            updateTaskCategoryOptions();
        }
        if (typeof updateHabitCategoryOptions === 'function') {
            updateHabitCategoryOptions();
        }
        
        // STEP 4: Render all sections
        renderAllSections();
        
        // STEP 5: Render calendar
        if (typeof renderCalendar === 'function') {
            renderCalendar();
        }
        
        // STEP 6: Restore last viewed section (MUST BE AFTER RENDERING)
        restoreLastSection();
        
        // STEP 7: Start observing filter containers
        const taskFilters = document.getElementById('taskFilters');
        const shoppingFilters = document.getElementById('shoppingFilters');
        const ideaFilters = document.getElementById('ideaFilters');
        
        if (taskFilters) {
            filterObserver.observe(taskFilters, { childList: true, subtree: true });
        }
        if (shoppingFilters) {
            filterObserver.observe(shoppingFilters, { childList: true, subtree: true });
        }
        if (ideaFilters) {
            filterObserver.observe(ideaFilters, { childList: true, subtree: true });
        }
        
        // STEP 8: Apply initial hover colors
        setTimeout(applyFilterHoverColors, 200);
        
        console.log('App initialized successfully');
        
        // Enter key handlers
        const taskInput = document.getElementById('taskInput');
        if (taskInput) {
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addTask();
                }
            });
        }
        
        const shoppingInput = document.getElementById('shoppingInput');
        if (shoppingInput) {
            shoppingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addShoppingItem();
                }
            });
        }
        
        const ideaTitleInput = document.getElementById('ideaTitleInput');
        if (ideaTitleInput) {
            ideaTitleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    document.getElementById('ideaRichEditor').focus();
                }
            });
        }
        
        const eventInput = document.getElementById('eventInput');
        if (eventInput) {
            eventInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addEvent();
                }
            });
        }

        const habitInput = document.getElementById('habitInput');
        if (habitInput) {
            habitInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addHabit();
                }
            });
        }
        
        const routineInput = document.getElementById('routineInput');
        if (routineInput) {
            routineInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addRoutine();
                }
            });
        }
        
        // Escape key handler for closing modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (typeof closeNoteModal === 'function') closeNoteModal();
                if (typeof closeDayEvents === 'function') closeDayEvents();
                if (typeof closeCategoryModal === 'function') closeCategoryModal();
                if (typeof closeShoppingCategoryModal === 'function') closeShoppingCategoryModal();
                if (typeof closeTaskCategoryModal === 'function') closeTaskCategoryModal();
                if (typeof closeHabitCategoryModal === 'function') closeHabitCategoryModal();
            }
        });
        
    } catch (error) {
        console.error('FATAL ERROR during initialization:', error);
        alert('Error loading app. Please check console for details.');
    }
});
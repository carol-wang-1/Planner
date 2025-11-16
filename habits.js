// Habits Module - Habit Tracker with Categories and Day Selection

let currentHabitFilter = 'all';
let editingHabitId = null;

// Default habit categories
const DEFAULT_HABIT_CATEGORIES = ['health', 'productivity', 'personal', 'learning', 'social'];

// ADDED: Toggle habit card open/closed
function toggleHabitCard(habitId) {
    const card = document.querySelector(`[data-habit-id="${habitId}"]`);
    
    if (card) {
        card.classList.toggle('collapsed');
    }
}

function addHabit() {
    const input = document.getElementById('habitInput');
    const categorySelect = document.getElementById('habitCategory');
    const frequencySelect = document.getElementById('habitFrequency');
    const subHabitsInput = document.getElementById('habitSubHabits');
    const text = input.value.trim();
    const category = categorySelect.value;
    const frequency = frequencySelect.value;
    
    if (!text) {
        alert('Please enter a habit name');
        return;
    }
    
    // Get selected days if daily habit
    let selectedDays = [];
    if (frequency === 'daily') {
        const dayCheckboxes = document.querySelectorAll('.day-checkbox:checked');
        selectedDays = Array.from(dayCheckboxes).map(cb => cb.value);
        
        if (selectedDays.length === 0) {
            alert('Please select at least one day for your daily habit');
            return;
        }
    }
    
    const subHabitsText = subHabitsInput.value.trim();
    const subHabits = subHabitsText ? subHabitsText.split('\n').filter(sh => sh.trim() !== '') : [];

    const newHabit = {
        id: Date.now().toString(),
        text: text,
        category: category,
        frequency: frequency,
        selectedDays: selectedDays,
        subHabits: subHabits,
        streak: 0,
        lastCompleted: null,
        completionDates: [],
        subHabitCompletions: {},
        createdAt: new Date().toISOString()
    };
    
    data.habits.unshift(newHabit);
    input.value = '';
    categorySelect.value = '';
    frequencySelect.value = 'daily';
    subHabitsInput.value = '';
    
    // Reset day checkboxes
    document.querySelectorAll('.day-checkbox').forEach(cb => cb.checked = false);
    updateDaySelectionVisibility();
    
    saveData();
    renderHabits();
    
    // Update calendar to show new habit
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }
}

function deleteHabit(id) {
    deleteItem(id, 'habits', 'habit', [renderHabits, renderCalendar]);
}

// ADDED: Edit habit function - opens modal
function editHabit(id) {
    const habit = data.habits.find(h => h.id === id);
    if (!habit) return;
    
    editingHabitId = id;
    
    // Populate edit modal
    document.getElementById('editHabitInput').value = habit.text;
    
    // Populate category dropdown
    const editCategorySelect = document.getElementById('editHabitCategory');
    editCategorySelect.innerHTML = '';
    
    const noCategory = document.createElement('option');
    noCategory.value = '';
    noCategory.textContent = 'No category';
    editCategorySelect.appendChild(noCategory);
    
    // Add custom categories
    data.habitCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        editCategorySelect.appendChild(option);
    });
    
    // Add default categories
    DEFAULT_HABIT_CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        editCategorySelect.appendChild(option);
    });
    
    editCategorySelect.value = habit.category || '';
    
    // Set frequency
    document.getElementById('editHabitFrequency').value = habit.frequency;
    
    // Set day checkboxes
    document.querySelectorAll('.edit-habit-day-checkbox').forEach(cb => {
        cb.checked = habit.selectedDays && habit.selectedDays.includes(cb.value);
    });
    
    updateEditHabitDaySelectionVisibility();
    
// Set sub-habits
    const subHabitsTextarea = document.getElementById('editHabitSubHabits');
    if (subHabitsTextarea) {
        subHabitsTextarea.value = habit.subHabits ? habit.subHabits.join('\n') : '';
    }

    // Open modal
    document.getElementById('habitEditModal').classList.add('active');
    document.getElementById('editHabitInput').focus();
}

// ADDED: Save habit edit
function saveHabitEdit() {
    if (!editingHabitId) return;
    
    const habit = data.habits.find(h => h.id === editingHabitId);
    if (!habit) return;
    
    const text = document.getElementById('editHabitInput').value.trim();
    const category = document.getElementById('editHabitCategory').value;
    const frequency = document.getElementById('editHabitFrequency').value;
    // Get sub-habits
    const subHabitsText = document.getElementById('editHabitSubHabits').value.trim();
    const subHabits = subHabitsText ? subHabitsText.split('\n').filter(sh => sh.trim() !== '') : [];
    
    if (!text) {
        alert('Please enter a habit name');
        return;
    }
    
    // Get selected days if daily habit
    let selectedDays = [];
    if (frequency === 'daily') {
        const dayCheckboxes = document.querySelectorAll('.edit-habit-day-checkbox:checked');
        selectedDays = Array.from(dayCheckboxes).map(cb => cb.value);
        
        if (selectedDays.length === 0) {
            alert('Please select at least one day for your daily habit');
            return;
        }
    }
    
    // Update habit
    habit.text = text;
    habit.category = category;
    habit.frequency = frequency;
    habit.selectedDays = selectedDays;
    habit.subHabits = subHabits;
    
    saveData();
    renderHabits();
    
    // Update calendar
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }
    
    closeHabitEditModal();
}

// Close habit edit modal
function closeHabitEditModal() {
    closeModal('habitEditModal');
    editingHabitId = null;
}

// Update day selector visibility in edit modal
function updateEditHabitDaySelectionVisibility() {
    const frequency = document.getElementById('editHabitFrequency').value;
    const daySelector = document.getElementById('editHabitDaySelector');
    
    if (daySelector) {
        daySelector.style.display = frequency === 'daily' ? 'block' : 'none';
    }
}

// Toggle all days in edit modal
function toggleAllEditHabitDays(checked) {
    document.querySelectorAll('.edit-habit-day-checkbox').forEach(cb => {
        cb.checked = checked;
    });
}

function toggleHabitToday(id) {
    const habit = data.habits.find(h => h.id === id);
    if (!habit) return;
    
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][today.getDay()];
    
    // Check if today is a valid day for this habit
    if (habit.frequency === 'daily' && habit.selectedDays.length > 0) {
        if (!habit.selectedDays.includes(dayOfWeek)) {
            alert('This habit is not scheduled for today!');
            return;
        }
    }
    
    const todayIndex = habit.completionDates.indexOf(todayStr);
    
    if (todayIndex > -1) {
        habit.completionDates.splice(todayIndex, 1);
        habit.streak = calculateStreak(habit);
    } else {
        habit.completionDates.push(todayStr);
        habit.completionDates.sort();
        habit.lastCompleted = todayStr;
        habit.streak = calculateStreak(habit);
    }
    
    saveData();
    updateHabitCard(id);  // Only update THIS card, not everything
    
    // Update calendar
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }
}

function toggleSubHabit(habitId, subHabitIndex) {
    const habit = data.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Initialize subHabitCompletions object if it doesn't exist
    if (!habit.subHabitCompletions) {
        habit.subHabitCompletions = {};
    }
    
    // Initialize today's sub-habit completions if not exists
    if (!habit.subHabitCompletions[today]) {
        habit.subHabitCompletions[today] = [];
    }
    
    const completions = habit.subHabitCompletions[today];
    const indexPosition = completions.indexOf(subHabitIndex);
    
    if (indexPosition > -1) {
        // Uncheck sub-habit
        completions.splice(indexPosition, 1);
    } else {
        // Check sub-habit
        completions.push(subHabitIndex);
    }
    
    // Auto-complete the habit if all sub-habits are done
    if (habit.subHabits && Array.isArray(habit.subHabits) && completions.length === habit.subHabits.length) {
        if (!habit.completionDates.includes(today)) {
            habit.completionDates.push(today);
            habit.completionDates.sort();
            habit.lastCompleted = today;
            habit.streak = calculateStreak(habit);
        }
    } else {
        // Unmark habit as complete if not all sub-habits are done
        const todayIndex = habit.completionDates.indexOf(today);
        if (todayIndex > -1) {
            habit.completionDates.splice(todayIndex, 1);
            habit.streak = calculateStreak(habit);
        }
    }
    
    saveData();
    updateHabitCard(habitId);
}


function updateHabitCard(id) {
    const habit = data.habits.find(h => h.id === id);
    if (!habit) return;
    
    const card = document.querySelector(`[data-habit-id="${id}"]`);
    if (!card) return;
    
    // Remember if card was open
    const wasOpen = !card.classList.contains('collapsed');
    
    const today = new Date().toISOString().split('T')[0];
    const todaySubHabits = (habit.subHabitCompletions && habit.subHabitCompletions[today]) ? habit.subHabitCompletions[today] : [];
    const completedToday = isCompletedToday(habit);
    const scheduledToday = isTodayScheduled(habit);
    
    // Update progress bar
    let progressPercentage = 0;
    if (habit.subHabits && Array.isArray(habit.subHabits) && habit.subHabits.length > 0) {
        progressPercentage = Math.round((todaySubHabits.length / habit.subHabits.length) * 100);
    } else {
        progressPercentage = completedToday ? 100 : 0;
    }
    
    const progressFill = card.querySelector('.progress-bar-fill');
    const progressText = card.querySelector('.progress-text');
    if (progressFill && progressText) {
        progressFill.style.width = `${progressPercentage}%`;
        progressFill.style.background = completedToday ? '#22c55e' : 'var(--accent-blue)';
        progressText.textContent = `${progressPercentage}%`;
    }
    
    // Update sub-habit checkboxes (only if they exist)
    if (habit.subHabits && Array.isArray(habit.subHabits) && habit.subHabits.length > 0) {
        habit.subHabits.forEach((_, index) => {
            const checkbox = card.querySelector(`#subhabit-${id}-${index}`);
            if (checkbox) {
                checkbox.checked = todaySubHabits.includes(index);
                checkbox.disabled = !scheduledToday;
            }
        });
    }
    
    // Update stats
    const streakValue = card.querySelector('.habit-stat-value');
    if (streakValue) streakValue.textContent = habit.streak;
    
    const completionRate = getCompletionRate(habit);
    const rateValues = card.querySelectorAll('.habit-stat-value');
    if (rateValues[1]) rateValues[1].textContent = `${completionRate}%`;
    if (rateValues[2]) rateValues[2].textContent = habit.completionDates.length;
    
    // Update last 7 days
    const last7Days = getLast7Days(habit);
    const dayDots = card.querySelectorAll('.habit-day');
    dayDots.forEach((dot, index) => {
        if (last7Days[index]) {
            dot.classList.toggle('completed', last7Days[index].isCompleted);
        }
    });
    
    // Update button
    const btn = card.querySelector('.habit-check-btn');
    if (btn) {
        btn.classList.toggle('completed', completedToday);
        btn.disabled = !scheduledToday;
        btn.textContent = !scheduledToday ? '⏸️ Not Scheduled Today' : 
                          completedToday ? '✓ Completed Today' : 'Mark as Done Today';
    }
    
    // Restore open state
    if (wasOpen) {
        card.classList.remove('collapsed');
    }
    
    // Update calendar
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }
}

function calculateStreak(habit) {
    if (habit.completionDates.length === 0) return 0;
    
    const sortedDates = [...habit.completionDates].sort().reverse();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let checkDate = new Date(today);
    
    for (const dateStr of sortedDates) {
        const completionDate = new Date(dateStr);
        completionDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((checkDate - completionDate) / (1000 * 60 * 60 * 24));
        
        if (habit.frequency === 'daily' && habit.selectedDays.length > 0) {
            if (daysDiff <= 7) {
                streak++;
                checkDate = new Date(completionDate);
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        } else {
            if (daysDiff === 0 || daysDiff === 1) {
                streak++;
                checkDate = new Date(completionDate);
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }
    
    return streak;
}

function isCompletedToday(habit) {
    const today = new Date().toISOString().split('T')[0];
    return habit.completionDates.includes(today);
}

function isTodayScheduled(habit) {
    if (habit.frequency !== 'daily' || habit.selectedDays.length === 0) {
        return true;
    }
    
    const today = new Date();
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][today.getDay()];
    return habit.selectedDays.includes(dayOfWeek);
}

function getCompletionRate(habit) {
    if (habit.completionDates.length === 0) return 0;
    
    const createdDate = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.ceil((today - createdDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation === 0) return 0;
    
    let expectedDays = daysSinceCreation;
    if (habit.frequency === 'daily' && habit.selectedDays.length > 0 && habit.selectedDays.length < 7) {
        const weeksElapsed = daysSinceCreation / 7;
        expectedDays = Math.floor(weeksElapsed * habit.selectedDays.length);
    }
    
    return Math.min(100, Math.round((habit.completionDates.length / expectedDays) * 100));
}

function getLast7Days(habit) {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
        const isCompleted = habit.completionDates.includes(dateStr);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const isScheduled = habit.frequency !== 'daily' || 
                          habit.selectedDays.length === 0 || 
                          habit.selectedDays.includes(dayOfWeek);
        
        days.push({
            date: dateStr,
            dayName: dayName,
            isCompleted: isCompleted,
            isScheduled: isScheduled
        });
    }
    
    return days;
}

function getHabitCategoryColor(categoryName) {
    const categoryData = data.habitCategories.find(c => c.name === categoryName);
    if (categoryData) return categoryData.color;
    
    const defaultColors = {
        'health': '#22c55e',
        'productivity': '#3b82f6',
        'personal': '#ec4899',
        'learning': '#8b5cf6',
        'social': '#f59e0b'
    };
    
    return defaultColors[categoryName] || '#6b7280';
}

function filterHabits(category) {
    currentHabitFilter = category;
    renderHabits();
}

// FIXED: Render filters with new categories showing immediately
function renderHabitFilters() {
    const container = document.getElementById('habitFilters');
    if (!container) return;
    
    const categories = new Set();
    categories.add('all');
    
    // FIXED: Add custom categories FIRST
    data.habitCategories.forEach(cat => categories.add(cat.name));
    
    // Then add default categories
    if (typeof DEFAULT_HABIT_CATEGORIES !== 'undefined') {
        DEFAULT_HABIT_CATEGORIES.forEach(cat => categories.add(cat));
    }
    
    // FIXED: Also add categories from existing habits
    data.habits.forEach(habit => {
        if (habit.category) {
            categories.add(habit.category);
        }
    });
    
    let html = '<div class="filter-buttons">';
    
    const categoriesArray = Array.from(categories);
    const sortedCategories = ['all', ...categoriesArray.filter(c => c !== 'all')];
    
    sortedCategories.forEach(cat => {
        let displayName = cat === 'all' ? 'All Habits' : cat.charAt(0).toUpperCase() + cat.slice(1);
        
        const isActive = currentHabitFilter === cat ? 'active' : '';
        const color = cat !== 'all' ? getHabitCategoryColor(cat) : '';
        const dataColor = color ? `data-color="${color}"` : '';
        
        let inlineStyle = '';
        if (isActive && color) {
            inlineStyle = `style="background: ${color}; border-color: ${color}; color: white;"`;
        }
        
        html += `<button class="filter-btn ${isActive}" onclick="filterHabits('${cat}')" ${dataColor} ${inlineStyle}>${displayName}</button>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    applyHabitFilterHoverColors();
}

// ADDED: Function to apply hover colors for habit filters
function applyHabitFilterHoverColors() {
    const filterButtons = document.querySelectorAll('#habitFilters .filter-btn[data-color]');
    filterButtons.forEach(btn => {
        const color = btn.getAttribute('data-color');
        if (color) {
            btn.onmouseenter = null;
            btn.onmouseleave = null;
            
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

function renderHabits() {
    renderHabitFilters();
    
    const container = document.getElementById('habitsList');
    
    let filteredHabits = data.habits;
    if (currentHabitFilter !== 'all') {
        filteredHabits = data.habits.filter(h => h.category === currentHabitFilter);
    }
    
    if (filteredHabits.length === 0) {
        container.innerHTML = '<div class="empty-state">No habits in this category. Start tracking one above!</div>';
        return;
    }
    
    const html = filteredHabits.map(habit => {
    const completedToday = isCompletedToday(habit);
    const scheduledToday = isTodayScheduled(habit);
    const completionRate = getCompletionRate(habit);
    const last7Days = getLast7Days(habit);
    const categoryColor = getHabitCategoryColor(habit.category);
    
    let daySchedule = '';
    if (habit.frequency === 'daily' && habit.selectedDays.length > 0 && habit.selectedDays.length < 7) {
        const dayNames = {
            'mon': 'Mon', 'tue': 'Tue', 'wed': 'Wed', 
            'thu': 'Thu', 'fri': 'Fri', 'sat': 'Sat', 'sun': 'Sun'
        };
        daySchedule = habit.selectedDays.map(d => dayNames[d]).join(', ');
    } else if (habit.frequency === 'daily') {
        daySchedule = 'Every day';
    } else {
        daySchedule = habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);
    }

    // Get today's sub-habit completions
    const today = new Date().toISOString().split('T')[0];
    const todaySubHabits = (habit.subHabitCompletions && habit.subHabitCompletions[today]) ? habit.subHabitCompletions[today] : [];

    // Calculate progress percentage
    let progressPercentage = 0;
    if (habit.subHabits && Array.isArray(habit.subHabits) && habit.subHabits.length > 0) {
        progressPercentage = Math.round((todaySubHabits.length / habit.subHabits.length) * 100);
    } else {
        progressPercentage = completedToday ? 100 : 0;
    }
    
    return `
        <div class="habit-card collapsed" data-habit-id="${habit.id}">
            <div class="habit-header" onclick="toggleHabitCard('${habit.id}')">
                <div class="habit-info">
                    <span class="habit-toggle-arrow">▶</span>
                    <div>
                        <h3 class="habit-name">${habit.text}</h3>
                        <div class="habit-meta">
                            <span class="habit-frequency">${daySchedule}</span>
                            ${habit.category ? `<span class="habit-category" style="background: ${categoryColor}20; color: ${categoryColor}; border: 1px solid ${categoryColor}40;">${habit.category}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="habit-actions" onclick="event.stopPropagation();">
                    <button class="habit-delete" onclick="event.stopPropagation(); editHabit('${habit.id}')" title="Edit habit">✏️</button>
                    <button class="habit-delete" onclick="event.stopPropagation(); deleteHabit('${habit.id}')" title="Delete habit">🗑️</button>
                </div>
            </div>
            
            <div class="habit-details">
                <div class="habit-stats" onclick="event.stopPropagation()">
                    <div class="habit-stat">
                        <div class="habit-stat-value">${habit.streak}</div>
                        <div class="habit-stat-label">Day Streak 🔥</div>
                    </div>
                    <div class="habit-stat">
                        <div class="habit-stat-value">${completionRate}%</div>
                        <div class="habit-stat-label">Success Rate</div>
                    </div>
                    <div class="habit-stat">
                        <div class="habit-stat-value">${habit.completionDates.length}</div>
                        <div class="habit-stat-label">Total Days</div>
                    </div>
                </div>

                <div class="progress-container" style="margin-bottom: 1.5rem;" onclick="event.stopPropagation()">
                    <div class="progress-bar-wrapper" style="position: relative; background: var(--border-color); border-radius: 8px; height: 30px; overflow: hidden;">
                        <span class="progress-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 600; font-size: 0.9rem; z-index: 2; color: var(--text-primary);">${progressPercentage}%</span>
                        <div class="progress-bar-fill" style="position: absolute; top: 0; left: 0; height: 100%; background: ${completedToday ? '#22c55e' : 'var(--accent-blue)'}; width: ${progressPercentage}%; transition: width 0.3s ease;"></div>
                    </div>
                </div>
                
                ${habit.subHabits && habit.subHabits.length > 0 ? `
                <div class="sub-habits-section" style="margin-bottom: 1.5rem;" onclick="event.stopPropagation()">
                    <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.75rem;">SUB-HABITS</h4>
                    <div class="sub-habits-checkboxes">
                        ${habit.subHabits.map((subHabit, index) => `
                            <div class="checkbox-wrapper" style="display: flex; align-items: center; padding: 0.75rem; background: var(--main-bg); border-radius: 8px; margin-bottom: 0.5rem;">
                                <input 
                                    type="checkbox" 
                                    id="subhabit-${habit.id}-${index}" 
                                    ${todaySubHabits.includes(index) ? 'checked' : ''}
                                    ${!scheduledToday ? 'disabled' : ''}
                                    onchange="toggleSubHabit('${habit.id}', ${index})"
                                    style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer;"
                                >
                                <label for="subhabit-${habit.id}-${index}" style="flex: 1; cursor: pointer; user-select: none;">${subHabit}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="habit-week" onclick="event.stopPropagation()">
                    ${last7Days.map(day => `
                        <div class="habit-day ${day.isCompleted ? 'completed' : ''} ${!day.isScheduled ? 'not-scheduled' : ''}" title="${day.date}">
                            <div class="habit-day-name">${day.dayName}</div>
                            <div class="habit-day-dot"></div>
                        </div>
                    `).join('')}
                </div>
                
                <button class="habit-check-btn ${completedToday ? 'completed' : ''} ${!scheduledToday ? 'disabled' : ''}" onclick="toggleHabitToday('${habit.id}')" ${!scheduledToday ? 'disabled' : ''}>${!scheduledToday ? '⏸️ Not Scheduled Today' : completedToday ? '✓ Completed Today' : 'Mark as Done Today'}</button>
            </div>
        </div>
    `;
}).join('');
    
    container.innerHTML = html;

// Add event listeners for toggling cards
container.querySelectorAll('.habit-info').forEach(info => {
    info.onclick = function() {
        const habitId = this.getAttribute('data-habit-id');
        toggleHabitCard(habitId);
    };
});
}

function updateDaySelectionVisibility() {
    const frequency = document.getElementById('habitFrequency').value;
    const daySelector = document.getElementById('daySelector');
    
    if (daySelector) {
        daySelector.style.display = frequency === 'daily' ? 'block' : 'none';
    }
}

function toggleAllDays(checked) {
    document.querySelectorAll('.day-checkbox').forEach(cb => {
        cb.checked = checked;
    });
}

// Make functions globally accessible
window.toggleHabitCard = toggleHabitCard;
window.editHabit = editHabit;
window.saveHabitEdit = saveHabitEdit;
window.closeHabitEditModal = closeHabitEditModal;
window.updateEditHabitDaySelectionVisibility = updateEditHabitDaySelectionVisibility;
window.toggleAllEditHabitDays = toggleAllEditHabitDays;
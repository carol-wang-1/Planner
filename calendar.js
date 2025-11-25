// Calendar Module

let currentMonth = new Date();
let selectedDate = null;
let calendarView = 'month'; // 'month', 'week', or 'day'
let currentWeekStart = null;
let currentDayView = new Date();

// Initialize week start
function initializeWeekStart() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday
    currentWeekStart = new Date(today.setDate(diff));
}

// Switch between views
function switchCalendarView(view) {
    calendarView = view;
    if (view === 'week' && !currentWeekStart) {
        initializeWeekStart();
    }
    if (view === 'day') {
        currentDayView = new Date();
    }
    renderCalendar();
}

// Navigation functions
function previousMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar();
}

function nextMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar();
}

function previousWeek() {
    if (!currentWeekStart) initializeWeekStart();
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderCalendar();
}

function nextWeek() {
    if (!currentWeekStart) initializeWeekStart();
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderCalendar();
}

function previousDay() {
    currentDayView.setDate(currentDayView.getDate() - 1);
    renderCalendar();
}

function nextDay() {
    currentDayView.setDate(currentDayView.getDate() + 1);
    renderCalendar();
}

function goToToday() {
    const today = new Date();
    currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    currentDayView = new Date();
    initializeWeekStart();
    renderCalendar();
}

// Helper function to format time (12-hour format with AM/PM)
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function renderCalendar() {
    if (calendarView === 'month') {
        renderMonthView();
    } else if (calendarView === 'week') {
        renderWeekView();
    } else if (calendarView === 'day') {
        renderDayView();
    }
}

// MONTH VIEW
function renderMonthView() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const container = document.getElementById('calendarContainer');
    
    let html = `
        <div class="calendar-view-switcher">
            <button class="view-btn active" onclick="switchCalendarView('month')">Month</button>
            <button class="view-btn" onclick="switchCalendarView('week')">Week</button>
            <button class="view-btn" onclick="switchCalendarView('day')">Day</button>
            <button class="today-btn" onclick="goToToday()">Current</button>
        </div>
        <div class="calendar-header">
            <button class="calendar-nav-btn" onclick="previousMonth()">‹</button>
            <h3 class="calendar-month">${monthNames[month]} ${year}</h3>
            <button class="calendar-nav-btn" onclick="nextMonth()">›</button>
        </div>
        <div class="calendar-grid" id="calendarGrid">
    `;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();
    
    // Day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Previous month days
    for (let i = firstDayOfWeek; i > 0; i--) {
        const day = prevLastDate - i + 1;
        const prevMonth = month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const actualMonth = month === 0 ? 11 : prevMonth;
        html += `<div class="calendar-day other-month" onclick="selectDay(${prevYear}, ${actualMonth}, ${day})">
            <span class="calendar-day-number">${day}</span>
        </div>`;
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= lastDate; day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const hasEvents = checkDayHasEvents(year, month, day);
        html += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}" onclick="selectDay(${year}, ${month}, ${day})">
            <span class="calendar-day-number">${day}</span>
        </div>`;
    }
    
    // Next month days
    const totalCells = firstDayOfWeek + lastDate;
    const remainingDays = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
    for (let day = 1; day <= remainingDays; day++) {
        const nextMonth = month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        const actualMonth = month === 11 ? 0 : nextMonth;
        html += `<div class="calendar-day other-month" onclick="selectDay(${nextYear}, ${actualMonth}, ${day})">
            <span class="calendar-day-number">${day}</span>
        </div>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Get item types for a specific day
function getDayItemTypes(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(year, month, day);
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
    
    const types = [];
    
    // Check for Events
    const hasEvents = data.events.some(event => event.date && event.date.startsWith(dateStr));
    if (hasEvents) {
        types.push({ icon: '🕐', label: 'Events', class: 'type-event' });
    }
    
    // Check for Tasks
    const hasTasks = data.tasks.some(task => task.date && task.date.startsWith(dateStr));
    if (hasTasks) {
        types.push({ icon: '✓', label: 'Tasks', class: 'type-task' });
    }
    
    // Check for Habits
    const hasHabits = data.habits && data.habits.some(habit => {
        const habitCreated = new Date(habit.createdAt);
        habitCreated.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        
        if (date < habitCreated) return false;
        
        if (habit.frequency === 'daily') {
            if (habit.selectedDays && habit.selectedDays.length > 0) {
                return habit.selectedDays.includes(dayOfWeek);
            }
            return true;
        } else if (habit.frequency === 'weekly') {
            const createdDayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][habitCreated.getDay()];
            return dayOfWeek === createdDayOfWeek;
        } else if (habit.frequency === 'monthly') {
            return date.getDate() === habitCreated.getDate();
        }
        return false;
    });
    if (hasHabits) {
        types.push({ icon: '⭐', label: 'Habits', class: 'type-habit' });
    }
    
    // Check for Routines
    const hasRoutines = data.routines && data.routines.some(routine => {
        return routine.selectedDays && routine.selectedDays.includes(dayOfWeek);
    });
    if (hasRoutines) {
        types.push({ icon: '🔄', label: 'Routines', class: 'type-routine' });
    }
    
    return types;
}

// WEEK VIEW
function renderWeekView() {
    if (!currentWeekStart) initializeWeekStart();
    
    const container = document.getElementById('calendarContainer');
    
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);
    
    const startMonth = currentWeekStart.toLocaleDateString('en-US', { month: 'long' });
    const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'long' });
    const startDay = currentWeekStart.getDate();
    const endDay = weekEnd.getDate();
    const year = currentWeekStart.getFullYear();
    
    const weekTitle = startMonth === endMonth 
        ? `${startMonth} ${startDay}-${endDay}, ${year}`
        : `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    
    let html = `
        <div class="calendar-view-switcher">
            <button class="view-btn" onclick="switchCalendarView('month')">Month</button>
            <button class="view-btn active" onclick="switchCalendarView('week')">Week</button>
            <button class="view-btn" onclick="switchCalendarView('day')">Day</button>
            <button class="today-btn" onclick="goToToday()">Current</button>
        </div>
        <div class="calendar-header">
            <button class="calendar-nav-btn" onclick="previousWeek()">‹</button>
            <h3 class="calendar-month">${weekTitle}</h3>
            <button class="calendar-nav-btn" onclick="nextWeek()">›</button>
        </div>
        <div class="week-view">
    `;
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        
        const isToday = date.toDateString() === today.toDateString();
        
        // Get what types of items exist for this day
        const itemTypes = getDayItemTypes(year, month, day);
        
        html += `
            <div class="week-day ${isToday ? 'today' : ''}" onclick="selectDay(${year}, ${month}, ${day})">
                <div class="week-day-header">
                    <div class="week-day-name">${dayNames[date.getDay()]}</div>
                    <div class="week-day-date">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
                <div class="week-day-content">
                    ${itemTypes.length > 0 ? itemTypes.map(type => `
                        <div class="week-item-type ${type.class}">
                            <span class="week-item-icon">${type.icon}</span>
                            <span class="week-item-label">${type.label}</span>
                        </div>
                    `).join('') : '<div class="no-events">No items</div>'}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// DAY VIEW
function renderDayView() {
    const container = document.getElementById('calendarContainer');
    
    const dateStr = currentDayView.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const year = currentDayView.getFullYear();
    const month = currentDayView.getMonth();
    const day = currentDayView.getDate();
    
    const today = new Date();
    const isToday = currentDayView.toDateString() === today.toDateString();
    
    let html = `
        <div class="calendar-view-switcher">
            <button class="view-btn" onclick="switchCalendarView('month')">Month</button>
            <button class="view-btn" onclick="switchCalendarView('week')">Week</button>
            <button class="view-btn active" onclick="switchCalendarView('day')">Day</button>
            <button class="today-btn" onclick="goToToday()">Current</button>
        </div>
        <div class="calendar-header">
            <button class="calendar-nav-btn" onclick="previousDay()">‹</button>
            <h3 class="calendar-month">${dateStr} ${isToday ? '<span class="today-badge">Today</span>' : ''}</h3>
            <button class="calendar-nav-btn" onclick="nextDay()">›</button>
        </div>
        <div class="day-view">
    `;
    
    const dateStrFormat = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][currentDayView.getDay()];
    
    // Get tasks for this day
    const dayTasks = data.tasks.filter(task => task.date && task.date.startsWith(dateStrFormat));
    
    // Get events for this day
    const dayEvents = data.events.filter(event => event.date && event.date.startsWith(dateStrFormat));
    
    // Get routines for this day
    const dayRoutines = data.routines ? data.routines.filter(routine => {
        return routine.selectedDays && routine.selectedDays.includes(dayOfWeek);
    }) : [];
    
    // Get habits for this day
    const dayHabits = data.habits ? data.habits.filter(habit => {
        const habitCreated = new Date(habit.createdAt);
        habitCreated.setHours(0, 0, 0, 0);
        const viewDate = new Date(currentDayView);
        viewDate.setHours(0, 0, 0, 0);
        
        if (viewDate < habitCreated) return false;
        
        if (habit.frequency === 'daily') {
            if (habit.selectedDays && habit.selectedDays.length > 0) {
                return habit.selectedDays.includes(dayOfWeek);
            }
            return true;
        } else if (habit.frequency === 'weekly') {
            const createdDayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][habitCreated.getDay()];
            return dayOfWeek === createdDayOfWeek;
        } else if (habit.frequency === 'monthly') {
            return viewDate.getDate() === habitCreated.getDate();
        }
        return false;
    }) : [];
    
    if (dayTasks.length === 0 && dayEvents.length === 0 && dayHabits.length === 0 && dayRoutines.length === 0) {
        html += '<div class="empty-state">No items scheduled for this day</div>';
    } else {
        // Show Events
        if (dayEvents.length > 0) {
            html += '<div class="day-section"><h4>Events</h4>';
            dayEvents.forEach(event => {
                html += `
                    <div class="day-item event-item">
                        <div class="day-item-title">${event.text}</div>
                        <div class="day-item-time">${formatDateTime(event.date)}</div>
                        ${event.location ? `<div class="day-item-meta">📍 ${event.location}</div>` : ''}
                        ${event.notes ? `<div class="day-item-meta">📝 ${event.notes}</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Show Tasks
        if (dayTasks.length > 0) {
            html += '<div class="day-section"><h4>Tasks</h4>';
            dayTasks.forEach(task => {
                html += `
                    <div class="day-item task-item ${task.completed ? 'completed' : ''}">
                        <div class="day-item-title">${task.text}</div>
                        ${task.date ? `<div class="day-item-time">${formatDateTime(task.date)}</div>` : ''}
                        ${task.category ? `<div class="day-item-meta">📁 ${task.category}</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Show Routines
        if (dayRoutines.length > 0) {
            // Sort routines by start time
            dayRoutines.sort((a, b) => a.startTime.localeCompare(b.startTime));
            
            html += '<div class="day-section"><h4>Routines</h4>';
            dayRoutines.forEach(routine => {
                html += `
                    <div class="day-item routine-item">
                        <div class="day-item-title">🔄 ${routine.text}</div>
                        <div class="day-item-time">${formatTime(routine.startTime)} - ${formatTime(routine.endTime)}</div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Show Habits
        if (dayHabits.length > 0) {
            html += '<div class="day-section"><h4>Habits</h4>';
            dayHabits.forEach(habit => {
                const isCompleted = habit.completionDates && habit.completionDates.includes(dateStrFormat);
                const statusEmoji = isCompleted ? '✅' : '⏰';
                
                html += `
                    <div class="day-item habit-item ${isCompleted ? 'completed' : ''}">
                        <div class="day-item-title">${statusEmoji} ${habit.text}</div>
                        <div class="day-item-meta">${habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)} Habit</div>
                        ${habit.category ? `<div class="day-item-meta">📌 ${habit.category}</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Check if a day has events, tasks, or habits
function checkDayHasEvents(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(year, month, day);
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
    
    // Check tasks with dates
    const hasTasks = data.tasks.some(task => task.date && task.date.startsWith(dateStr));
    
    // Check events
    const hasEvents = data.events.some(event => event.date && event.date.startsWith(dateStr));
    
    // Check habits
    const hasHabits = data.habits && data.habits.some(habit => {
        const habitCreated = new Date(habit.createdAt);
        habitCreated.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        
        if (date < habitCreated) {
            return false;
        }
        
        if (habit.frequency === 'daily') {
            if (habit.selectedDays && habit.selectedDays.length > 0) {
                return habit.selectedDays.includes(dayOfWeek);
            }
            return true;
        } else if (habit.frequency === 'weekly') {
            const createdDayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][habitCreated.getDay()];
            return dayOfWeek === createdDayOfWeek;
        } else if (habit.frequency === 'monthly') {
            return date.getDate() === habitCreated.getDate();
        }
        return false;
    });
    
    // Check routines
    const hasRoutines = data.routines && data.routines.some(routine => {
        return routine.selectedDays && routine.selectedDays.includes(dayOfWeek);
    });
    
    return hasTasks || hasEvents || hasHabits || hasRoutines;
}

function selectDay(year, month, day) {
    selectedDate = new Date(year, month, day);
    showDayEvents(year, month, day);
}

// Show day events modal
function showDayEvents(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const modalDate = new Date(year, month, day);
    const dateFormatted = modalDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][modalDate.getDay()];
    
    document.getElementById('dayEventsTitle').textContent = dateFormatted;
    
    const dayTasks = data.tasks.filter(task => task.date && task.date.startsWith(dateStr));
    const dayEvents = data.events.filter(event => event.date && event.date.startsWith(dateStr));
    
    // Get routines for this day of the week
    const dayRoutines = data.routines ? data.routines.filter(routine => {
        return routine.selectedDays && routine.selectedDays.includes(dayOfWeek);
    }) : [];
    
    const dayHabits = data.habits ? data.habits.filter(habit => {
        const habitCreated = new Date(habit.createdAt);
        habitCreated.setHours(0, 0, 0, 0);
        modalDate.setHours(0, 0, 0, 0);
        
        if (modalDate < habitCreated) {
            return false;
        }
        
        if (habit.frequency === 'daily') {
            if (habit.selectedDays && habit.selectedDays.length > 0) {
                return habit.selectedDays.includes(dayOfWeek);
            }
            return true;
        } else if (habit.frequency === 'weekly') {
            const createdDayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][habitCreated.getDay()];
            return dayOfWeek === createdDayOfWeek;
        } else if (habit.frequency === 'monthly') {
            return modalDate.getDate() === habitCreated.getDate();
        }
        return false;
    }) : [];
    
    let html = '';
    
    if (dayTasks.length === 0 && dayEvents.length === 0 && dayHabits.length === 0 && dayRoutines.length === 0) {
        html = '<div class="empty-state">No items scheduled for this day</div>';
    } else {
        // Show Events
        if (dayEvents.length > 0) {
            dayEvents.forEach(event => {
                html += `
                    <div class="day-event-item">
                        <div class="day-event-title">${event.text}</div>
                        <div class="day-event-time">${formatDateTime(event.date)}</div>
                        ${event.location ? `<div class="day-event-time">📍 ${event.location}</div>` : ''}
                        ${event.notes ? `<div class="day-event-time">📝 ${event.notes}</div>` : ''}
                        <span class="day-event-type">Event</span>
                    </div>
                `;
            });
        }
        
        // Show Tasks
        if (dayTasks.length > 0) {
            dayTasks.forEach(task => {
                html += `
                    <div class="day-event-item">
                        <div class="day-event-title">${task.text}</div>
                        ${task.date ? `<div class="day-event-time">${formatDateTime(task.date)}</div>` : ''}
                        <span class="day-event-type">Task - ${task.category}</span>
                    </div>
                `;
            });
        }
        
        // Show Routines (sorted by time)
        if (dayRoutines.length > 0) {
            // Sort routines by start time
            dayRoutines.sort((a, b) => a.startTime.localeCompare(b.startTime));
            
            dayRoutines.forEach(routine => {
                html += `
                    <div class="day-event-item" style="border-left-color: var(--sidebar-bg);">
                        <div class="day-event-title">🔄 ${routine.text}</div>
                        <div class="day-event-time">${formatTime(routine.startTime)} - ${formatTime(routine.endTime)}</div>
                        <span class="day-event-type">Routine</span>
                    </div>
                `;
            });
        }
        
        // Show Habits
        if (dayHabits.length > 0) {
            dayHabits.forEach(habit => {
                const isCompleted = habit.completionDates && habit.completionDates.includes(dateStr);
                const statusEmoji = isCompleted ? '✅' : '⏰';
                const statusText = isCompleted ? 'Completed' : 'Scheduled';
                
                html += `
                    <div class="day-event-item" style="border-left-color: ${isCompleted ? '#22c55e' : '#f59e0b'};">
                        <div class="day-event-title">${statusEmoji} ${habit.text}</div>
                        <div class="day-event-time">${habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)} Habit</div>
                        ${habit.category ? `<div class="day-event-time">📌 ${habit.category}</div>` : ''}
                        <span class="day-event-type">Habit - ${statusText}</span>
                    </div>
                `;
            });
        }
    }
    
    document.getElementById('dayEventsBody').innerHTML = html;
    document.getElementById('dayEventsModal').classList.add('active');
}

function closeDayEvents() {
    closeModal('dayEventsModal');
}
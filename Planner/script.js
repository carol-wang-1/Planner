// Data storage
let data = {
    tasks: [],
    shopping: [],
    ideas: [],
    notes: [],
    calendar: [],
    events: [],
    customCategories: [],
    shoppingCategories: [],
    taskCategories: []
};

let currentMonth = new Date();
let selectedDate = null;

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
                customCategories: parsed.customCategories || [],
                shoppingCategories: parsed.shoppingCategories || [],
                taskCategories: parsed.taskCategories || []
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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initializing...');
    loadData();
    console.log('Data loaded:', data);
    setupNavigation();
    updateCategoryOptions();
    updateShoppingCategoryOptions();
    updateTaskCategoryOptions();
    renderAllSections();
    renderCalendar();
    console.log('App initialized successfully');
    
    // Enter key handlers
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });
    document.getElementById('shoppingInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addShoppingItem();
        }
    });
    document.getElementById('ideaInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addIdea();
        }
    });
    document.getElementById('eventInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addEvent();
        }
    });
    
    // Make sure all functions are globally accessible
    window.addTask = addTask;
    window.addShoppingItem = addShoppingItem;
    window.addIdea = addIdea;
    window.addEvent = addEvent;
    window.saveCategory = saveCategory;
    window.saveNote = saveNote;
    window.openNoteModal = openNoteModal;
    window.closeNoteModal = closeNoteModal;
    window.openCategoryModal = openCategoryModal;
    window.closeCategoryModal = closeCategoryModal;
    window.openShoppingCategoryModal = openShoppingCategoryModal;
    window.closeShoppingCategoryModal = closeShoppingCategoryModal;
    window.saveShoppingCategory = saveShoppingCategory;
    window.openTaskCategoryModal = openTaskCategoryModal;
    window.closeTaskCategoryModal = closeTaskCategoryModal;
    window.saveTaskCategory = saveTaskCategory;
    window.deleteNote = deleteNote;
    window.editNote = editNote;
    window.handleSaveNote = handleSaveNote;
    window.editTask = editTask;
    window.editShoppingItem = editShoppingItem;
    window.editEvent = editEvent;
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
    window.toggleShopping = toggleShopping;
    window.deleteShopping = deleteShopping;
    window.deleteEvent = deleteEvent;
    window.deleteIdea = deleteIdea;
    window.previousMonth = previousMonth;
    window.nextMonth = nextMonth;
    window.selectDay = selectDay;
    window.closeDayEvents = closeDayEvents;
});

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
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
    
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
    }
}

// Tasks
function addTask() {
    const input = document.getElementById('taskInput');
    const dateInput = document.getElementById('taskDate');
    const category = document.getElementById('taskCategory');
    const text = input.value.trim();
    const date = dateInput.value;
    const editingId = input.dataset.editingId;
    
    
    if (!text) {
        alert('Please enter a task');
        return;
    }
    
    if (editingId) {
        // Update existing task
        const task = data.tasks.find(t => t.id === editingId);
        if (task) {
            task.text = text;
            task.date = date || null;
            task.category = category.value;
            console.log('Task updated:', task);
        }
        delete input.dataset.editingId;
    } else {
        // Create new task
        const newTask = {
            id: Date.now().toString(),
            text: text,
            date: date || null,
            category: category.value,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        console.log('Adding task:', newTask);
        data.tasks.push(newTask);
    }
    
    input.value = '';
    dateInput.value = '';
    category.value = '';
    saveData();
    renderTasks();
    if (date) renderCalendar(); // Update calendar with new task
    console.log('Task saved, total tasks:', data.tasks.length);
}

function toggleTask(id) {
    const task = data.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveData();
        renderTasks();
    }
}

function deleteTask(id) {
    data.tasks = data.tasks.filter(t => t.id !== id);
    saveData();
    renderTasks();
    renderCalendar(); // Update calendar
}

function renderTasks() {
    const container = document.getElementById('tasksList');
    
    console.log('Rendering tasks, count:', data.tasks.length);
    
    if (data.tasks.length === 0) {
        container.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        return;
    }
    
    const html = data.tasks.map(task => {
        const categoryData = data.taskCategories.find(c => c.name === task.category);
        const tagColor = categoryData ? categoryData.color : '';
        const tagStyle = tagColor ? `style="background: ${tagColor}20; color: ${tagColor};"` : '';
        const categoryDisplay = task.category || 'no category';
        
        return `
            <div class="item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="item-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <div class="item-content">
                    <div class="item-text">${task.text}</div>
                    ${task.date ? `<div class="item-date">${formatDateTime(task.date)}</div>` : ''}
                </div>
                ${task.category ? `<span class="item-tag tag-${task.category}" ${tagStyle}>${categoryDisplay}</span>` : ''}
                <button class="item-delete" onclick="editTask('${task.id}')" title="Edit task">✏️</button>
                <button class="item-delete" onclick="deleteTask('${task.id}')" title="Delete task">🗑️</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    console.log('Tasks rendered');
}

function editTask(id) {
    const task = data.tasks.find(t => t.id === id);
    if (!task) return;
    
    console.log('Editing task:', task);
    
    document.getElementById('taskInput').value = task.text;
    document.getElementById('taskDate').value = task.date || '';
    document.getElementById('taskCategory').value = task.category || '';
    
    // Store the task ID in a data attribute to update instead of delete
    document.getElementById('taskInput').dataset.editingId = id;
    
    document.getElementById('taskInput').focus();
    document.getElementById('taskInput').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Shopping
function addShoppingItem() {
    const input = document.getElementById('shoppingInput');
    const category = document.getElementById('shoppingCategory');
    const text = input.value.trim();
    
    console.log('Adding shopping item:', { text, category: category.value });
    
    if (!text) {
        alert('Please enter an item');
        return;
    }
    
    const newItem = {
        id: Date.now().toString(),
        text: text,
        category: category.value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    data.shopping.push(newItem);
    console.log('Shopping item added, total items:', data.shopping.length);
    
    input.value = '';
    saveData();
    renderShopping();
}

function toggleShopping(id) {
    const item = data.shopping.find(s => s.id === id);
    if (item) {
        item.completed = !item.completed;
        saveData();
        renderShopping();
    }
}

function deleteShopping(id) {
    if (confirm('Delete this item?')) {
        data.shopping = data.shopping.filter(s => s.id !== id);
        saveData();
        renderShopping();
    }
}

function renderShopping() {
    const container = document.getElementById('shoppingList');
    
    console.log('Rendering shopping items, count:', data.shopping.length);
    
    if (data.shopping.length === 0) {
        container.innerHTML = '<div class="empty-state">No items yet. Add one above!</div>';
        return;
    }
    
    const html = data.shopping.map(item => {
        const categoryData = data.shoppingCategories.find(c => c.name === item.category);
        const tagColor = categoryData ? categoryData.color : '';
        const tagStyle = tagColor ? `style="background: ${tagColor}20; color: ${tagColor};"` : '';
        
        return `
            <div class="item ${item.completed ? 'completed' : ''}">
                <input type="checkbox" class="item-checkbox" ${item.completed ? 'checked' : ''} onchange="toggleShopping('${item.id}')">
                <div class="item-content">
                    <div class="item-text">${item.text}</div>
                </div>
                <span class="item-tag tag-${item.category}" ${tagStyle}>${item.category}</span>
                <button class="item-delete" onclick="editShoppingItem('${item.id}')">✏️</button>
                <button class="item-delete" onclick="deleteShopping('${item.id}')">🗑️</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    console.log('Shopping items rendered');
}

function editShoppingItem(id) {
    const item = data.shopping.find(s => s.id === id);
    if (!item) return;
    
    document.getElementById('shoppingInput').value = item.text;
    document.getElementById('shoppingCategory').value = item.category;
    
    // Delete the old item when editing
    data.shopping = data.shopping.filter(s => s.id !== id);
    renderShopping();
    
    document.getElementById('shoppingInput').focus();
}

// Ideas
function addIdea() {
    const titleInput = document.getElementById('ideaTitleInput');
    const input = document.getElementById('ideaInput');
    const category = document.getElementById('ideaCategory');
    const title = titleInput.value.trim();
    const text = input.value.trim();
    
    console.log('Adding idea:', { title, text, category: category.value });
    
    if (!title || !text) {
        alert('Please enter both title and idea text');
        return;
    }
    
    const newIdea = {
        id: Date.now().toString(),
        title: title,
        text: text,
        category: category.value,
        createdAt: new Date().toISOString()
    };
    
    data.ideas.push(newIdea);
    console.log('Idea added, total ideas:', data.ideas.length);
    
    titleInput.value = '';
    input.value = '';
    saveData();
    renderIdeas();
}

function deleteIdea(id) {
    if (confirm('Delete this idea?')) {
        data.ideas = data.ideas.filter(i => i.id !== id);
        saveData();
        renderIdeas();
    }
}

function renderIdeas() {
    const container = document.getElementById('ideasGrid');
    
    console.log('Rendering ideas, count:', data.ideas.length);
    
    if (data.ideas.length === 0) {
        container.innerHTML = '<div class="empty-state">No ideas yet. Capture one above!</div>';
        return;
    }
    
    const html = data.ideas.map(idea => {
        const categoryData = data.customCategories.find(c => c.name === idea.category);
        const backgroundColor = categoryData ? categoryData.color : '';
        const styleAttr = backgroundColor ? `style="background: ${backgroundColor};"` : '';
        
        return `
            <div class="idea-card ${categoryData ? '' : idea.category}" ${styleAttr}>
                <div class="idea-category">${idea.category}</div>
                <div class="idea-title">${idea.title}</div>
                <div class="idea-text">${idea.text}</div>
                <button class="idea-delete" onclick="deleteIdea('${idea.id}')">🗑️</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    console.log('Ideas rendered');
}

// Calendar
function addCalendarEvent() {
    const input = document.getElementById('calendarInput');
    const dateInput = document.getElementById('calendarDate');
    const text = input.value.trim();
    const date = dateInput.value;
    
    if (!text || !date) return;
    
    data.calendar.push({
        id: Date.now().toString(),
        text: text,
        date: date,
        createdAt: new Date().toISOString()
    });
    
    input.value = '';
    dateInput.value = '';
    saveData();
    renderCalendar();
}

function deleteCalendar(id) {
    data.calendar = data.calendar.filter(c => c.id !== id);
    saveData();
    renderCalendar();
}

function renderCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();
    
    const grid = document.getElementById('calendarGrid');
    let html = '';
    
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
    
    grid.innerHTML = html;
}

function checkDayHasEvents(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check tasks with dates
    const hasTasks = data.tasks.some(task => task.date && task.date.startsWith(dateStr));
    
    // Check events
    const hasEvents = data.events.some(event => event.date && event.date.startsWith(dateStr));
    
    return hasTasks || hasEvents;
}

function previousMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar();
}

function nextMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar();
}

function selectDay(year, month, day) {
    selectedDate = new Date(year, month, day);
    showDayEvents(year, month, day);
}

function showDayEvents(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const modalDate = new Date(year, month, day);
    const dateFormatted = modalDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    
    document.getElementById('dayEventsTitle').textContent = dateFormatted;
    
    // Get all items for this day
    const dayTasks = data.tasks.filter(task => task.date && task.date.startsWith(dateStr));
    const dayEvents = data.events.filter(event => event.date && event.date.startsWith(dateStr));
    
    let html = '';
    
    if (dayTasks.length === 0 && dayEvents.length === 0) {
        html = '<div class="empty-state">No items scheduled for this day</div>';
    } else {
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
    }
    
    document.getElementById('dayEventsBody').innerHTML = html;
    document.getElementById('dayEventsModal').classList.add('active');
}

function closeDayEvents() {
    document.getElementById('dayEventsModal').classList.remove('active');
}

// Events
function addEvent() {
    const input = document.getElementById('eventInput');
    const dateInput = document.getElementById('eventDate');
    const locationInput = document.getElementById('eventLocation');
    const notesInput = document.getElementById('eventNotes');
    const text = input.value.trim();
    const date = dateInput.value;
    const location = locationInput.value.trim();
    const notes = notesInput.value.trim();
    
    console.log('Adding event:', { text, date, location, notes });
    
    if (!text || !date) {
        alert('Please enter event name and date');
        return;
    }
    
    const newEvent = {
        id: Date.now().toString(),
        text: text,
        date: date,
        location: location || null,
        notes: notes || null,
        createdAt: new Date().toISOString()
    };
    
    data.events.push(newEvent);
    console.log('Event added, total events:', data.events.length);
    
    input.value = '';
    dateInput.value = '';
    locationInput.value = '';
    notesInput.value = '';
    saveData();
    renderEvents();
    renderCalendar();
}

function deleteEvent(id) {
    if (confirm('Delete this event?')) {
        data.events = data.events.filter(e => e.id !== id);
        saveData();
        renderEvents();
        renderCalendar();
    }
}

function renderEvents() {
    const container = document.getElementById('eventsList');
    
    console.log('Rendering events, count:', data.events.length);
    
    if (data.events.length === 0) {
        container.innerHTML = '<div class="empty-state">No events yet. Add one above!</div>';
        return;
    }
    
    const sorted = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const html = sorted.map(event => `
        <div class="item">
            <div class="item-content">
                <div class="item-text">${event.text}</div>
                <div class="item-date">${formatDateTime(event.date)}</div>
                ${event.location ? `<div class="item-date">📍 ${event.location}</div>` : ''}
                ${event.notes ? `<div class="item-date">📝 ${event.notes}</div>` : ''}
            </div>
            <button class="item-delete" onclick="editEvent('${event.id}')">✏️</button>
            <button class="item-delete" onclick="deleteEvent('${event.id}')">🗑️</button>
        </div>
    `).join('');
    
    container.innerHTML = html;
    console.log('Events rendered');
}

function editEvent(id) {
    const event = data.events.find(e => e.id === id);
    if (!event) return;
    
    document.getElementById('eventInput').value = event.text;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventLocation').value = event.location || '';
    document.getElementById('eventNotes').value = event.notes || '';
    
    // Delete the old event when editing
    data.events = data.events.filter(e => e.id !== id);
    renderEvents();
    
    document.getElementById('eventInput').focus();
}

// Notes
function openNoteModal() {
    document.getElementById('noteModal').classList.add('active');
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteTitle').focus();
}

function closeNoteModal() {
    const modal = document.getElementById('noteModal');
    modal.classList.remove('active');
    modal.dataset.editId = '';
    document.getElementById('noteModalTitle').textContent = 'New Note';
}

function saveNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    console.log('Saving note:', { title, content });
    
    if (!title || !content) {
        alert('Please enter both title and content');
        return;
    }
    
    const newNote = {
        id: Date.now().toString(),
        title: title,
        content: content,
        createdAt: new Date().toISOString()
    };
    
    data.notes.push(newNote);
    console.log('Note added, total notes:', data.notes.length);
    
    titleInput.value = '';
    contentInput.value = '';
    
    saveData();
    renderNotes();
    closeNoteModal();
}

function deleteNote(id) {
    if (confirm('Delete this note?')) {
        data.notes = data.notes.filter(n => n.id !== id);
        saveData();
        renderNotes();
    }
}

function renderNotes() {
    const container = document.getElementById('notesList');
    
    console.log('Rendering notes, count:', data.notes.length);
    
    if (data.notes.length === 0) {
        container.innerHTML = '<div class="empty-state">No notes yet. Click "New Note" to create one!</div>';
        return;
    }
    
    const sorted = [...data.notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const html = sorted.map(note => {
        const preview = note.content ? note.content.substring(0, 150) : '';
        const showEllipsis = note.content && note.content.length > 150 ? '...' : '';
        
        return `
            <div class="note-card">
                <div class="note-header">
                    <h3 class="note-title">${note.title || 'Untitled'}</h3>
                    <div class="note-actions">
                        <button class="note-delete" onclick="editNote('${note.id}')">✏️</button>
                        <button class="note-delete" onclick="deleteNote('${note.id}')">🗑️</button>
                    </div>
                </div>
                <div class="note-date">${formatDate(note.createdAt)}</div>
                <div class="note-preview">${preview}${showEllipsis}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    console.log('Notes rendered');
}

function editNote(id) {
    const note = data.notes.find(n => n.id === id);
    if (!note) return;
    
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('noteModalTitle').textContent = 'Edit Note';
    document.getElementById('noteModal').classList.add('active');
    
    // Store the note ID for updating
    document.getElementById('noteModal').dataset.editId = id;
}

function updateNote(id, title, content) {
    const note = data.notes.find(n => n.id === id);
    if (note) {
        note.title = title;
        note.content = content;
        saveData();
        renderNotes();
    }
}

function handleSaveNote() {
    const modal = document.getElementById('noteModal');
    const editId = modal.dataset.editId;
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    console.log('handleSaveNote called:', { editId, title, content });
    
    if (!title || !content) {
        alert('Please enter both title and content');
        return;
    }
    
    if (editId) {
        // Update existing note
        console.log('Updating note:', editId);
        updateNote(editId, title, content);
        modal.dataset.editId = '';
    } else {
        // Create new note
        console.log('Creating new note');
        const newNote = {
            id: Date.now().toString(),
            title: title,
            content: content,
            createdAt: new Date().toISOString()
        };
        
        data.notes.push(newNote);
        console.log('Note added, total notes:', data.notes.length);
        
        saveData();
        renderNotes();
    }
    
    titleInput.value = '';
    contentInput.value = '';
    closeNoteModal();
}

// Utility functions
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

// Render all sections
function renderAllSections() {
    renderTasks();
    renderShopping();
    renderIdeas();
    renderNotes();
    renderEvents();
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeNoteModal();
        closeDayEvents();
        closeCategoryModal();
        closeShoppingCategoryModal();
    }
});

// Custom Categories
function updateCategoryOptions() {
    const select = document.getElementById('ideaCategory');
    const currentValue = select.value;
    
    // Clear existing options
    select.innerHTML = '';
    
    // Add default categories
    const defaultCategories = ['Personal', 'Work', 'Study', 'Relationships', 'Creative'];
    defaultCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.toLowerCase();
        option.textContent = cat;
        select.appendChild(option);
    });
    
    // Add custom categories
    data.customCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Restore previous value if it still exists
    if (currentValue) {
        select.value = currentValue;
    }
}

// Shopping Categories
function updateShoppingCategoryOptions() {
    const select = document.getElementById('shoppingCategory');
    const currentValue = select.value;
    
    // Clear existing options
    select.innerHTML = '';
    
    // Add default categories
    const defaultCategories = ['Groceries', 'Household', 'Electronics', 'Clothing', 'Books', 'Other'];
    defaultCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.toLowerCase();
        option.textContent = cat;
        select.appendChild(option);
    });
    
    // Add custom categories
    data.shoppingCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Restore previous value if it still exists
    if (currentValue) {
        select.value = currentValue;
    }
}

function openCategoryModal() {
    document.getElementById('categoryModal').classList.add('active');
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryColor').value = '#e9d5ff';
    document.getElementById('categoryName').focus();
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
}

function saveCategory() {
    const nameInput = document.getElementById('categoryName');
    const colorInput = document.getElementById('categoryColor');
    const name = nameInput.value.trim();
    const color = colorInput.value;
    
    console.log('Saving category:', { name, color });
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    // Check if category already exists
    const exists = data.customCategories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert('Category already exists!');
        return;
    }
    
    const newCategory = {
        name: name,
        color: color
    };
    
    data.customCategories.push(newCategory);
    console.log('Category added, total categories:', data.customCategories.length);
    
    saveData();
    updateCategoryOptions();
    closeCategoryModal();
    alert('Category "' + name + '" added successfully!');
}

function openShoppingCategoryModal() {
    document.getElementById('shoppingCategoryModal').classList.add('active');
    document.getElementById('shoppingCategoryName').value = '';
    document.getElementById('shoppingCategoryColor').value = '#3b82f6';
    document.getElementById('shoppingCategoryName').focus();
}

function closeShoppingCategoryModal() {
    document.getElementById('shoppingCategoryModal').classList.remove('active');
}

function saveShoppingCategory() {
    const nameInput = document.getElementById('shoppingCategoryName');
    const colorInput = document.getElementById('shoppingCategoryColor');
    const name = nameInput.value.trim();
    const color = colorInput.value;
    
    console.log('Saving shopping category:', { name, color });
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    // Check if category already exists
    const exists = data.shoppingCategories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert('Category already exists!');
        return;
    }
    
    const newCategory = {
        name: name,
        color: color
    };
    
    data.shoppingCategories.push(newCategory);
    console.log('Shopping category added, total categories:', data.shoppingCategories.length);
    
    saveData();
    updateShoppingCategoryOptions();
    closeShoppingCategoryModal();
    alert('Shopping category "' + name + '" added successfully!');
}

// Task Categories
function updateTaskCategoryOptions() {
    const select = document.getElementById('taskCategory');
    const currentValue = select.value;
    
    // Clear existing options
    select.innerHTML = '';
    
    // Add "No category" option first
    const noCategory = document.createElement('option');
    noCategory.value = '';
    noCategory.textContent = 'No category';
    select.appendChild(noCategory);
    
    // Add default categories
    const defaultCategories = ['Personal', 'Work', 'Health', 'Relationship', 'Family'];
    defaultCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.toLowerCase();
        option.textContent = cat;
        select.appendChild(option);
    });
    
    // Add custom categories
    data.taskCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Restore previous value if it still exists
    if (currentValue !== undefined) {
        select.value = currentValue;
    }
}

function openTaskCategoryModal() {
    document.getElementById('taskCategoryModal').classList.add('active');
    document.getElementById('taskCategoryName').value = '';
    document.getElementById('taskCategoryColor').value = '#3b82f6';
    document.getElementById('taskCategoryName').focus();
}

function closeTaskCategoryModal() {
    document.getElementById('taskCategoryModal').classList.remove('active');
}

function saveTaskCategory() {
    const nameInput = document.getElementById('taskCategoryName');
    const colorInput = document.getElementById('taskCategoryColor');
    const name = nameInput.value.trim();
    const color = colorInput.value;
    
    console.log('Saving task category:', { name, color });
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    // Check if category already exists
    const exists = data.taskCategories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert('Category already exists!');
        return;
    }
    
    const newCategory = {
        name: name,
        color: color
    };
    
    data.taskCategories.push(newCategory);
    console.log('Task category added, total categories:', data.taskCategories.length);
    
    saveData();
    updateTaskCategoryOptions();
    closeTaskCategoryModal();
    alert('Task category "' + name + '" added successfully!');
}
// Tasks Module

let currentTaskFilter = 'all';
let editingTaskId = null;

function addTask() {
    addItem({
        dataKey: 'tasks',
        inputId: 'taskInput',
        alertMessage: 'Please enter a task',
        extraFields: [
        { id: 'taskDate', key: 'date', transform: (val) => {
        if (!val) return null;
        // Fix timezone issue: add time to prevent date shifting
        return val + 'T12:00:00';
    }},
    { id: 'taskCategory', key: 'category' }
],
        defaultFields: { completed: false },
        renderFunctions: [renderTasks, renderCalendar]
    });
}

function toggleTask(id) {
    toggleItemComplete(id, 'tasks', renderTasks);
}

function deleteTask(id) {
    deleteItem(id, 'tasks', 'task', [renderTasks, renderCalendar]);
}

// UPDATED: Open edit modal instead of using main form
function editTask(id) {
    editingTaskId = id; 
    
    openEditModal({
        id: id,
        dataKey: 'tasks',
        modalId: 'taskEditModal',
        fields: [
        { editId: 'editTaskInput', dataKey: 'text' },
        { editId: 'editTaskDate', dataKey: 'date', default: '', transform: (val) => {
        if (!val) return '';
        // Extract just the date part (YYYY-MM-DD) for display
        return val.split('T')[0];
    }}
],
        categoryField: {
            editId: 'editTaskCategory',
            dataKey: 'category',
            customCategories: data.taskCategories,
            defaultCategories: DEFAULT_TASK_CATEGORIES,
            hasNoCategory: true
        },
        focusId: 'editTaskInput'
    });
}

// Save task edit from modal
function saveTaskEdit() {
    saveItemEdit({
        getId: () => editingTaskId,  // Pass a function that returns the ID
        dataKey: 'tasks',
        fields: [
            { editId: 'editTaskInput', dataKey: 'text', required: true, errorMsg: 'Please enter a task name' },
            { editId: 'editTaskDate', dataKey: 'date', transform: (val) => {
                if (!val) return null;
                return val + 'T12:00:00';
            }},
            { editId: 'editTaskCategory', dataKey: 'category' }
        ],
        renderFunctions: [renderTasks, renderCalendar],
        closeFunction: closeTaskEditModal
    });
}

//Close task edit modal
function closeTaskEditModal() {
    closeModal('taskEditModal');
    editingTaskId = null;
}

function filterTasks(category) {
    currentTaskFilter = category;
    renderTasks();
}

// Get category color with proper default colors
function getCategoryColor(categoryName) {
    const categoryData = data.taskCategories.find(c => c.name === categoryName);
    if (categoryData) return categoryData.color;
    
    const defaultColors = {
        'personal': '#ec4899',
        'work': '#3b82f6',
        'health': '#22c55e',
        'relationship': '#a855f7',
        'family': '#f97316'
    };
    
    return defaultColors[categoryName] || '#6b7280';
}

function renderTaskFilters() {
    const container = document.getElementById('taskFilters');
    if (!container) return;
    
    const categories = new Set();
    categories.add('all');
    categories.add('no-category');
    
    if (typeof DEFAULT_TASK_CATEGORIES !== 'undefined') {
        DEFAULT_TASK_CATEGORIES.forEach(cat => categories.add(cat));
    }
    
    data.taskCategories.forEach(cat => categories.add(cat.name));
    
    data.tasks.forEach(task => {
        if (task.category) {
            categories.add(task.category);
        }
    });
    
    let html = '<div class="filter-buttons">';
    
    const categoriesArray = Array.from(categories);
    const sortedCategories = [
        'all',
        'no-category',
        ...categoriesArray.filter(c => c !== 'all' && c !== 'no-category')
    ];
    
    sortedCategories.forEach(cat => {
        let displayName = cat;
        if (cat === 'all') displayName = 'All Tasks';
        else if (cat === 'no-category') displayName = 'No Category';
        else displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        
        const isActive = currentTaskFilter === cat ? 'active' : '';
        const color = (cat !== 'all' && cat !== 'no-category') ? getCategoryColor(cat) : '';
        const dataColor = color ? `data-color="${color}"` : '';
        
        let inlineStyle = '';
        if (isActive && color) {
            inlineStyle = `style="background: ${color}; border-color: ${color}; color: white;"`;
        }
        
        html += `<button class="filter-btn ${isActive}" onclick="filterTasks('${cat}')" ${dataColor} ${inlineStyle}>${displayName}</button>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    applyTaskFilterHoverColors();
}

function applyTaskFilterHoverColors() {
    const filterButtons = document.querySelectorAll('#taskFilters .filter-btn[data-color]');
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

function renderTasks() {
    renderTaskFilters();
    
    const container = document.getElementById('tasksList');
    
    let filteredTasks = data.tasks;
    if (currentTaskFilter !== 'all') {
        if (currentTaskFilter === 'no-category') {
            filteredTasks = data.tasks.filter(t => !t.category);
        } else {
            filteredTasks = data.tasks.filter(t => t.category === currentTaskFilter);
        }
    }
    
    if (filteredTasks.length === 0) {
        container.innerHTML = '<div class="empty-state">No tasks in this category.</div>';
        return;
    }
    
    const html = filteredTasks.map(task => {
        const tagColor = task.category ? getCategoryColor(task.category) : '';
        const tagStyle = tagColor ? `style="background: ${tagColor}20; color: ${tagColor}; border: 1px solid ${tagColor}40;"` : '';
        const categoryDisplay = task.category || 'no category';
        
        return `
            <div class="item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="item-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <div class="item-content">
                    <div class="item-text">${task.text}</div>
                    ${task.date ? `<div class="item-date">${formatDate(task.date)}</div>` : ''}
                </div>
                ${task.category ? `<span class="item-tag" ${tagStyle}>${categoryDisplay}</span>` : '<span class="item-tag" style="background: rgba(0,0,0,0.05); color: var(--text-secondary);">no category</span>'}
                <button class="item-delete" onclick="editTask('${task.id}')" title="Edit task">✏️</button>
                <button class="item-delete" onclick="deleteTask('${task.id}')" title="Delete task">🗑️</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}
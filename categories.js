// Categories Management Module

// ============================================
// IDEA CATEGORIES
// ============================================

let DEFAULT_IDEA_CATEGORIES = ['personal', 'work', 'study', 'relationships', 'creative'];

function updateCategoryOptions() {
    const select = document.getElementById('ideaCategory');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    // Add custom categories FIRST
    data.customCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Then add default categories
    DEFAULT_IDEA_CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(option);
    });
    
    if (currentValue) {
        select.value = currentValue;
    }
}

function openCategoryModal() {
    document.getElementById('categoryModal').classList.add('active');
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryColor').value = '#e9d5ff';
    document.getElementById('categoryName').focus();
    renderCategoryList();
}


function saveCategory() {
    const nameInput = document.getElementById('categoryName');
    const colorInput = document.getElementById('categoryColor');
    const name = nameInput.value.trim();
    const color = colorInput.value;
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    const exists = data.customCategories.some(c => c.name.toLowerCase() === name.toLowerCase());
    const existsInDefault = DEFAULT_IDEA_CATEGORIES.includes(name.toLowerCase());
    
    if (exists || existsInDefault) {
        alert('Category already exists!');
        return;
    }
    
    const newCategory = { name: name, color: color };
    data.customCategories.unshift(newCategory);
    
    nameInput.value = '';
    colorInput.value = '#e9d5ff';
    
    saveData();
    updateCategoryOptions();
    renderCategoryList();
}

function renderCategoryList() {
    const container = document.getElementById('categoryList');
    if (!container) return;
    
    let html = '';
    
    // Show custom categories FIRST
    data.customCategories.forEach(cat => {
        html += `
            <div class="category-item">
                <div class="category-color" style="background: ${cat.color};"></div>
                <span class="category-name">${cat.name}</span>
                <button class="category-delete-btn" onclick="deleteCategory('${cat.name}', false)">Delete</button>
            </div>
        `;
    });
    
    // Then show default categories
    DEFAULT_IDEA_CATEGORIES.forEach(cat => {
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        html += `
            <div class="category-item">
                <div class="category-color" style="background: var(--border-color);"></div>
                <span class="category-name">${displayName} <span style="color: var(--text-muted); font-size: 0.85em;">(default)</span></span>
                <button class="category-delete-btn" onclick="deleteCategory('${cat}', true)">Delete</button>
            </div>
        `;
    });
    
    if (DEFAULT_IDEA_CATEGORIES.length === 0 && data.customCategories.length === 0) {
        html = '<div style="text-align: center; color: var(--text-muted); padding: 1rem;">No categories</div>';
    }
    
    container.innerHTML = html;
}

function deleteCategory(name, isDefault) {
    const itemsWithCategory = data.ideas.filter(i => i.category === name).length;
    const message = itemsWithCategory > 0 
        ? `Delete category "${name}"? ${itemsWithCategory} idea(s) will keep this category tag.`
        : `Delete category "${name}"?`;
    
    if (confirm(message)) {
        if (isDefault) {
            DEFAULT_IDEA_CATEGORIES = DEFAULT_IDEA_CATEGORIES.filter(cat => cat !== name);
        } else {
            data.customCategories = data.customCategories.filter(c => c.name !== name);
        }
        saveData();
        updateCategoryOptions();
        renderCategoryList();
        if (typeof renderIdeas === 'function') renderIdeas();
    }
}

// ============================================
// TASK CATEGORIES
// ============================================

let DEFAULT_TASK_CATEGORIES = ['personal', 'work', 'health', 'relationship', 'family'];

function updateTaskCategoryOptions() {
    const select = document.getElementById('taskCategory');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    const noCategory = document.createElement('option');
    noCategory.value = '';
    noCategory.textContent = 'No category';
    select.appendChild(noCategory);
    
    // Add custom categories FIRST
    data.taskCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Then add default categories
    DEFAULT_TASK_CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(option);
    });
    
    if (currentValue !== undefined) {
        select.value = currentValue;
    }
}

function renderTaskCategoryList() {
    const container = document.getElementById('taskCategoryList');
    if (!container) return;
    
    let html = '';
    
    // Show custom categories FIRST
    data.taskCategories.forEach(cat => {
        html += `
            <div class="category-item">
                <div class="category-color" style="background: ${cat.color};"></div>
                <span class="category-name">${cat.name}</span>
                <button class="category-delete-btn" onclick="deleteTaskCategory('${cat.name}', false)">Delete</button>
            </div>
        `;
    });
    
    // Then show default categories
    DEFAULT_TASK_CATEGORIES.forEach(cat => {
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        html += `
            <div class="category-item">
                <div class="category-color" style="background: var(--border-color);"></div>
                <span class="category-name">${displayName} <span style="color: var(--text-muted); font-size: 0.85em;">(default)</span></span>
                <button class="category-delete-btn" onclick="deleteTaskCategory('${cat}', true)">Delete</button>
            </div>
        `;
    });
    
    if (DEFAULT_TASK_CATEGORIES.length === 0 && data.taskCategories.length === 0) {
        html = '<div style="text-align: center; color: var(--text-muted); padding: 1rem;">No categories</div>';
    }
    
    container.innerHTML = html;
}

function deleteTaskCategory(name, isDefault) {
    const itemsWithCategory = data.tasks.filter(t => t.category === name).length;
    const message = itemsWithCategory > 0 
        ? `Delete category "${name}"? ${itemsWithCategory} task(s) will keep this category tag.`
        : `Delete category "${name}"?`;
    
    if (confirm(message)) {
        if (isDefault) {
            DEFAULT_TASK_CATEGORIES = DEFAULT_TASK_CATEGORIES.filter(cat => cat !== name);
        } else {
            data.taskCategories = data.taskCategories.filter(c => c.name !== name);
        }
        saveData();
        updateTaskCategoryOptions();
        renderTaskCategoryList();
        if (typeof renderTasks === 'function') renderTasks();
    }
}

function openTaskCategoryModal() {
    document.getElementById('taskCategoryModal').classList.add('active');
    document.getElementById('taskCategoryName').value = '';
    document.getElementById('taskCategoryColor').value = '#3b82f6';
    document.getElementById('taskCategoryName').focus();
    renderTaskCategoryList();
}


function saveTaskCategory() {
    const nameInput = document.getElementById('taskCategoryName');
    const colorInput = document.getElementById('taskCategoryColor');
    const name = nameInput.value.trim();
    const color = colorInput.value;
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    const exists = data.taskCategories.some(c => c.name.toLowerCase() === name.toLowerCase());
    const existsInDefault = DEFAULT_TASK_CATEGORIES.includes(name.toLowerCase());
    
    if (exists || existsInDefault) {
        alert('Category already exists!');
        return;
    }
    
    const newCategory = { name: name, color: color };
    data.taskCategories.unshift(newCategory);
    
    nameInput.value = '';
    colorInput.value = '#3b82f6';
    
    saveData();
    updateTaskCategoryOptions();
    renderTaskCategoryList();
}

// ============================================
// SHOPPING CATEGORIES
// ============================================

// UPDATED: Removed 'other' from default categories
let DEFAULT_SHOPPING_CATEGORIES = ['groceries', 'household', 'electronics', 'clothing', 'books'];

function updateShoppingCategoryOptions() {
    const select = document.getElementById('shoppingCategory');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    // ADDED: "No Category" option first
    const noCategory = document.createElement('option');
    noCategory.value = '';
    noCategory.textContent = 'No Category';
    select.appendChild(noCategory);
    
    // Add custom categories
    data.shoppingCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Then add default categories
    DEFAULT_SHOPPING_CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(option);
    });
    
    if (currentValue !== undefined) {
        select.value = currentValue;
    }
}

function renderShoppingCategoryList() {
    const container = document.getElementById('shoppingCategoryList');
    if (!container) return;
    
    let html = '';
    
    // Show custom categories FIRST
    data.shoppingCategories.forEach(cat => {
        html += `
            <div class="category-item">
                <div class="category-color" style="background: ${cat.color};"></div>
                <span class="category-name">${cat.name}</span>
                <button class="category-delete-btn" onclick="deleteShoppingCategory('${cat.name}', false)">Delete</button>
            </div>
        `;
    });
    
    // Then show default categories
    DEFAULT_SHOPPING_CATEGORIES.forEach(cat => {
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        html += `
            <div class="category-item">
                <div class="category-color" style="background: var(--border-color);"></div>
                <span class="category-name">${displayName} <span style="color: var(--text-muted); font-size: 0.85em;">(default)</span></span>
                <button class="category-delete-btn" onclick="deleteShoppingCategory('${cat}', true)">Delete</button>
            </div>
        `;
    });
    
    if (DEFAULT_SHOPPING_CATEGORIES.length === 0 && data.shoppingCategories.length === 0) {
        html = '<div style="text-align: center; color: var(--text-muted); padding: 1rem;">No categories</div>';
    }
    
    container.innerHTML = html;
}

function deleteShoppingCategory(name, isDefault) {
    const itemsWithCategory = data.shopping.filter(s => s.category === name).length;
    const message = itemsWithCategory > 0 
        ? `Delete category "${name}"? ${itemsWithCategory} item(s) will keep this category tag.`
        : `Delete category "${name}"?`;
    
    if (confirm(message)) {
        if (isDefault) {
            DEFAULT_SHOPPING_CATEGORIES = DEFAULT_SHOPPING_CATEGORIES.filter(cat => cat !== name);
        } else {
            data.shoppingCategories = data.shoppingCategories.filter(c => c.name !== name);
        }
        saveData();
        updateShoppingCategoryOptions();
        renderShoppingCategoryList();
        if (typeof renderShopping === 'function') renderShopping();
    }
}

function openShoppingCategoryModal() {
    document.getElementById('shoppingCategoryModal').classList.add('active');
    document.getElementById('shoppingCategoryName').value = '';
    document.getElementById('shoppingCategoryColor').value = '#3b82f6';
    document.getElementById('shoppingCategoryName').focus();
    renderShoppingCategoryList();
}

function saveShoppingCategory() {
    const nameInput = document.getElementById('shoppingCategoryName');
    const colorInput = document.getElementById('shoppingCategoryColor');
    const name = nameInput.value.trim();
    const color = colorInput.value;
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    const exists = data.shoppingCategories.some(c => c.name.toLowerCase() === name.toLowerCase());
    const existsInDefault = DEFAULT_SHOPPING_CATEGORIES.includes(name.toLowerCase());
    
    if (exists || existsInDefault) {
        alert('Category already exists!');
        return;
    }
    
    const newCategory = { name: name, color: color };
    data.shoppingCategories.unshift(newCategory);
    
    nameInput.value = '';
    colorInput.value = '#3b82f6';
    
    saveData();
    updateShoppingCategoryOptions();
    renderShoppingCategoryList();
}

// ============================================
// HABIT CATEGORIES
// ============================================

function updateHabitCategoryOptions() {
    const select = document.getElementById('habitCategory');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    const noCategory = document.createElement('option');
    noCategory.value = '';
    noCategory.textContent = 'No category';
    select.appendChild(noCategory);
    
    const defaultCategories = ['Health', 'Productivity', 'Personal', 'Learning', 'Social'];
    defaultCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.toLowerCase();
        option.textContent = cat;
        select.appendChild(option);
    });
    
    data.habitCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    if (currentValue !== undefined) {
        select.value = currentValue;
    }
}

function renderHabitCategoryList() {
    const container = document.getElementById('habitCategoryList');
    if (!container) return;
    
    let html = '';
    
    const DEFAULT_HABIT_CATEGORIES = ['health', 'productivity', 'personal', 'learning', 'social'];
    
    // FIXED: Show custom categories FIRST (at the top)
    data.habitCategories.forEach(cat => {
        html += `
            <div class="category-item">
                <div class="category-color" style="background: ${cat.color};"></div>
                <span class="category-name">${cat.name}</span>
                <button class="category-delete-btn" onclick="deleteHabitCategory('${cat.name}', false)">Delete</button>
            </div>
        `;
    });
    
    // Then show default categories
    DEFAULT_HABIT_CATEGORIES.forEach(cat => {
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        html += `
            <div class="category-item">
                <div class="category-color" style="background: var(--border-color);"></div>
                <span class="category-name">${displayName} <span style="color: var(--text-muted); font-size: 0.85em;">(default)</span></span>
                <button class="category-delete-btn" onclick="deleteHabitCategory('${cat}', true)">Delete</button>
            </div>
        `;
    });
    
    if (DEFAULT_HABIT_CATEGORIES.length === 0 && data.habitCategories.length === 0) {
        html = '<div style="text-align: center; color: var(--text-muted); padding: 1rem;">No categories</div>';
    }
    
    container.innerHTML = html;
}

function deleteHabitCategory(name, isDefault) {
    const itemsWithCategory = data.habits.filter(h => h.category === name).length;
    const message = itemsWithCategory > 0 
        ? `Delete category "${name}"? ${itemsWithCategory} habit(s) will keep this category tag.`
        : `Delete category "${name}"?`;
    
    if (confirm(message)) {
        if (!isDefault) {
            data.habitCategories = data.habitCategories.filter(c => c.name !== name);
        }
        saveData();
        updateHabitCategoryOptions();
        renderHabitCategoryList();
        if (typeof renderHabits === 'function') renderHabits();
    }
}

function openHabitCategoryModal() {
    document.getElementById('habitCategoryModal').classList.add('active');
    document.getElementById('habitCategoryName').value = '';
    document.getElementById('habitCategoryColor').value = '#22c55e';
    document.getElementById('habitCategoryName').focus();
    renderHabitCategoryList();
}


function saveHabitCategory() {
    const nameInput = document.getElementById('habitCategoryName');
    const colorInput = document.getElementById('habitCategoryColor');
    const name = nameInput.value.trim();
    const color = colorInput.value;
    
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    const DEFAULT_HABIT_CATEGORIES = ['health', 'productivity', 'personal', 'learning', 'social'];
    const exists = data.habitCategories.some(c => c.name.toLowerCase() === name.toLowerCase());
    const existsInDefault = DEFAULT_HABIT_CATEGORIES.includes(name.toLowerCase());
    
    if (exists || existsInDefault) {
        alert('Category already exists!');
        return;
    }
    
    const newCategory = { name: name, color: color };
    data.habitCategories.unshift(newCategory);
    
    nameInput.value = '';
    colorInput.value = '#22c55e';
    
    saveData();
    updateHabitCategoryOptions();
    renderHabitCategoryList();
    // ADDED: Re-render habits to update filters with new category
    if (typeof renderHabits === 'function') {
        renderHabits();
    }
}

function closeCategoryModal() {
    closeModal('categoryModal');
}

function closeTaskCategoryModal() {
    closeModal('taskCategoryModal');
}

function closeShoppingCategoryModal() {
    closeModal('shoppingCategoryModal');
}

function closeHabitCategoryModal() {
    closeModal('habitCategoryModal');
}
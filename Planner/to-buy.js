// Shopping/To-Buy Module

let currentShoppingFilter = 'all';
let editingShoppingId = null;

function addShoppingItem() {
    addItem({
        dataKey: 'shopping',
        inputId: 'shoppingInput',
        alertMessage: 'Please enter an item',
        extraFields: [
            { id: 'shoppingCategory', key: 'category' }
        ],
        defaultFields: { completed: false },
        renderFunctions: [renderShopping]
    });
}

function toggleShopping(id) {
    toggleItemComplete(id, 'shopping', renderShopping);
}

function deleteShopping(id) {
    deleteItem(id, 'shopping', 'item', [renderShopping]);
}

// UPDATED: Open edit modal instead of using main form
function editShoppingItem(id) {
    editingShoppingId = id;  // ADD THIS LINE!
    
    openEditModal({
        id: id,
        dataKey: 'shopping',
        modalId: 'shoppingEditModal',
        fields: [
            { editId: 'editShoppingInput', dataKey: 'text' }
        ],
        categoryField: {
            editId: 'editShoppingCategory',
            dataKey: 'category',
            customCategories: data.shoppingCategories,
            defaultCategories: DEFAULT_SHOPPING_CATEGORIES
        },
        focusId: 'editShoppingInput'
    });
}

// ADDED: Save shopping edit from modal
function saveShoppingEdit() {
    saveItemEdit({
        getId: () => editingShoppingId,  // Pass a function that returns the ID
        dataKey: 'shopping',
        fields: [
            { editId: 'editShoppingInput', dataKey: 'text', required: true, errorMsg: 'Please enter an item name' },
            { editId: 'editShoppingCategory', dataKey: 'category' }
        ],
        renderFunctions: [renderShopping],
        closeFunction: closeShoppingEditModal
    });
}

// ADDED: Close shopping edit modal
function closeShoppingEditModal() {
    closeModal('shoppingEditModal');
    editingShoppingId = null;
}

function filterShopping(category) {
    currentShoppingFilter = category;
    renderShopping();
}

function getShoppingCategoryColor(categoryName) {
    const categoryData = data.shoppingCategories.find(c => c.name === categoryName);
    if (categoryData) return categoryData.color;
    
    const defaultColors = {
        'groceries': '#22c55e',
        'household': '#6b7280',
        'electronics': '#3b82f6',
        'clothing': '#ec4899',
        'books': '#8b5cf6',
        'other': '#6b7280'
    };
    
    return defaultColors[categoryName] || '#6b7280';
}

function renderShoppingFilters() {
    const container = document.getElementById('shoppingFilters');
    if (!container) return;
    
    const categories = new Set();
    categories.add('all');
    categories.add('no-category');
    
    if (typeof DEFAULT_SHOPPING_CATEGORIES !== 'undefined') {
        DEFAULT_SHOPPING_CATEGORIES.forEach(cat => {
            if (cat !== 'other') { // Skip 'other' as it's replaced with 'no-category'
                categories.add(cat);
            }
        });
    }
    
    data.shoppingCategories.forEach(cat => categories.add(cat.name));
    
    data.shopping.forEach(item => {
        if (item.category && item.category !== 'other') {
            categories.add(item.category);
        }
    });
    
    let html = '<div class="filter-buttons">';
    
    // UPDATED: Keep order - 'all' first, 'no-category' second, then the rest
    const categoriesArray = Array.from(categories);
    const sortedCategories = [
        'all',
        'no-category',
        ...categoriesArray.filter(c => c !== 'all' && c !== 'no-category').sort()
    ];
    
    sortedCategories.forEach(cat => {
        let displayName = cat;
        if (cat === 'all') displayName = 'All Items';
        else if (cat === 'no-category') displayName = 'No Category';
        else displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        
        const isActive = currentShoppingFilter === cat ? 'active' : '';
        const color = (cat !== 'all' && cat !== 'no-category') ? getShoppingCategoryColor(cat) : '';
        const dataColor = color ? `data-color="${color}"` : '';
        
        let inlineStyle = '';
        if (isActive && color) {
            inlineStyle = `style="background: ${color}; border-color: ${color}; color: white;"`;
        }
        
        html += `<button class="filter-btn ${isActive}" onclick="filterShopping('${cat}')" ${dataColor} ${inlineStyle}>${displayName}</button>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    applyShoppingFilterHoverColors();
}

function applyShoppingFilterHoverColors() {
    const filterButtons = document.querySelectorAll('#shoppingFilters .filter-btn[data-color]');
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

function renderShopping() {
    renderShoppingFilters();
    
    const container = document.getElementById('shoppingList');
    
    let filteredItems = data.shopping;
    if (currentShoppingFilter !== 'all') {
        if (currentShoppingFilter === 'no-category') {
            filteredItems = data.shopping.filter(s => !s.category || s.category === '');
        } else {
            filteredItems = data.shopping.filter(s => s.category === currentShoppingFilter);
        }
    }
    
    if (filteredItems.length === 0) {
        container.innerHTML = '<div class="empty-state">No items in this category.</div>';
        return;
    }
    
    const html = filteredItems.map(item => {
        const categoryDisplay = item.category || 'no category';
        const tagColor = item.category ? getShoppingCategoryColor(item.category) : '#6b7280';
        const tagStyle = `style="background: ${tagColor}20; color: ${tagColor}; border: 1px solid ${tagColor}40;"`;
        
        return `
            <div class="item ${item.completed ? 'completed' : ''}">
                <input type="checkbox" class="item-checkbox" ${item.completed ? 'checked' : ''} onchange="toggleShopping('${item.id}')">
                <div class="item-content">
                    <div class="item-text">${item.text}</div>
                </div>
                <span class="item-tag" ${tagStyle}>${categoryDisplay}</span>
                <button class="item-delete" onclick="editShoppingItem('${item.id}')">✏️</button>
                <button class="item-delete" onclick="deleteShopping('${item.id}')">🗑️</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Make functions globally accessible
window.editShoppingItem = editShoppingItem;
window.closeShoppingEditModal = closeShoppingEditModal;
window.saveShoppingEdit = saveShoppingEdit;
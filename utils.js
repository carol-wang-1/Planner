// Utility Functions - Shared helper functions

// ==========================================
// DATE FORMATTING
// ==========================================

// Format date and time
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

// Format date only
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

// ==========================================
// DELETE FUNCTIONS
// ==========================================

// Generic delete function
function deleteItem(id, dataKey, itemName, renderFunctions) {
    if (confirm(`Delete this ${itemName}?`)) {
        data[dataKey] = data[dataKey].filter(item => item.id !== id);
        saveData();
        renderFunctions.forEach(fn => fn());
        return true;
    }
    return false;
}

// ==========================================
// TOGGLE COMPLETE FUNCTIONS
// ==========================================

// Generic toggle complete function
function toggleItemComplete(id, dataKey, renderFunction) {
    const item = data[dataKey].find(item => item.id === id);
    if (item) {
        item.completed = !item.completed;
        saveData();
        renderFunction();
    }
}

// ==========================================
// ADD FUNCTIONS
// ==========================================

// Generic add item function
function addItem(config) {
    const {
        dataKey,           // e.g., 'tasks', 'shopping'
        inputId,           // Main text input ID
        alertMessage,      // Error message if empty
        extraFields = [],  // Additional fields: [{ id: 'taskDate', key: 'date' }]
        defaultFields = {},// Default fields like { completed: false }
        renderFunctions = [], // Functions to call after adding
        insertMethod = 'unshift' // 'unshift' (top) or 'push' (bottom)
    } = config;
    
    const input = document.getElementById(inputId);
    const text = input.value.trim();
    
    if (!text) {
        alert(alertMessage);
        return;
    }
    
    // Build the new item
    const newItem = {
        id: Date.now().toString(),
        text: text,
        ...defaultFields,
        createdAt: new Date().toISOString()
    };
    
    // Add extra fields
    extraFields.forEach(field => {
        const element = document.getElementById(field.id);
        let value = element.value;
        
        // Apply transformation if provided
        if (field.transform) {
            value = field.transform(value);
        }
        
        newItem[field.key] = value;
    });
    
    // Add to data array
    data[dataKey][insertMethod](newItem);
    
    // Clear inputs
    input.value = '';
    extraFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element.type === 'checkbox') {
            element.checked = false;
        } else {
            element.value = '';
        }
    });
    
    // Save and render
    saveData();
    renderFunctions.forEach(fn => fn());
}

// ==========================================
// EDIT MODAL FUNCTIONS
// ==========================================

// Generic function to open edit modals
function openEditModal(config) {
    const {
        id,
        dataKey,           // e.g., 'tasks', 'shopping'
        modalId,           // Modal element ID
        fields = [],       // Fields to populate: [{ editId: 'editTaskInput', dataKey: 'text' }]
        categoryField,     // Category dropdown config (optional)
        focusId,           // Element to focus after opening
        skipDataLoad = false // For complex cases like ideas with rich text
    } = config;
    
    const item = data[dataKey].find(item => item.id === id);
    if (!item) return;

    // Populate fields
    if (!skipDataLoad) {
        fields.forEach(field => {
            const element = document.getElementById(field.editId);
            let value = item[field.dataKey];
            
            // Apply field-specific transform if provided
            if (field.transform && value) {
                value = field.transform(value);
            }
            
            element.value = value !== null && value !== undefined ? value : (field.default || '');
        });
    }
    
    // Handle category dropdown if provided
    if (categoryField) {
        const select = document.getElementById(categoryField.editId);
        select.innerHTML = '';
        
        // Add "No category" option if specified
        if (categoryField.hasNoCategory) {
            const noCategory = document.createElement('option');
            noCategory.value = '';
            noCategory.textContent = 'No category';
            select.appendChild(noCategory);
        }
        
        // Add custom categories
        if (categoryField.customCategories) {
            categoryField.customCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.name;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        }
        
        // Add default categories
        if (categoryField.defaultCategories) {
            categoryField.defaultCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                select.appendChild(option);
            });
        }
        
        // Set current value
        const currentValue = item[categoryField.dataKey];
        select.value = currentValue !== null && currentValue !== undefined ? currentValue : '';
    }
    
    // Open modal
    document.getElementById(modalId).classList.add('active');
    
    // Focus on specified element
    if (focusId) {
        document.getElementById(focusId).focus();
    }
}

// ==========================================
// SAVE EDIT FUNCTIONS
// ==========================================

// Generic save edit function
// Generic save edit function
/*function saveItemEdit(config) {
    const {
        getId,             // FUNCTION that returns the editing ID
        dataKey,           // e.g., 'tasks', 'shopping'
        fields = [],       
        renderFunctions = [], 
        closeFunction      
    } = config;
    
    const editingId = getId(); // Call the function to get the ID
    if (!editingId) return;
    
    const item = data[dataKey].find(item => item.id === editingId);
    if (!item) return;
    
    // Validate and update fields
    for (let field of fields) {
        const element = document.getElementById(field.editId);
        let value = element.value.trim();
        
        // Check required fields
        if (field.required && !value) {
            alert(field.errorMsg || 'Please fill in all required fields');
            return;
        }
        
        // Apply transformation if provided
        if (field.transform) {
            value = field.transform(value);
        }
        
        item[field.dataKey] = value;
    }
    
    // Save and render
    saveData();
    renderFunctions.forEach(fn => fn());
    
    // Close modal
    if (closeFunction) {
        closeFunction();
    }

}*/

// Generic save edit function
// Generic save edit function
function saveItemEdit(config) {
    const {
        getId,             
        dataKey,           
        fields = [],       
        renderFunctions = [], 
        closeFunction      
    } = config;
    
    const editingId = getId();
    if (!editingId) return;
    
    const item = data[dataKey].find(item => item.id === editingId);
    if (!item) return;
    
    // Validate and update fields
    for (let field of fields) {
        const element = document.getElementById(field.editId);
        let value = element.value.trim();
        
        // Check required fields
        if (field.required && !value) {
            alert(field.errorMsg || 'Please fill in all required fields');
            return;
        }
        
        // Apply transformation if provided
        if (field.transform) {
            value = field.transform(value);
        }
        
        item[field.dataKey] = value;
    }
    
    // Save and render
    saveData();
    renderFunctions.forEach(fn => fn());
    
    // Close modal
    if (closeFunction) {
        closeFunction();
    }
}

// ==========================================
// CLOSE MODAL FUNCTIONS
// ==========================================

// Generic close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}
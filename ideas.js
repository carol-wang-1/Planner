// Ideas Module

let currentIdeaFilter = 'all';
let editingIdeaId = null;

function addIdea() {
    const titleInput = document.getElementById('ideaTitleInput');
    const title = titleInput.value.trim();
    const text = getRichEditorContent();
    const textOnly = text.replace(/<[^>]*>/g, '').trim();
    
    if (!title || !textOnly) {
        alert('Please enter both title and idea text');
        return;
    }
    
    const category = document.getElementById('ideaCategory');
    
    const newIdea = {
        id: Date.now().toString(),
        title: title,
        text: text,
        category: category.value,
        createdAt: new Date().toISOString()
    };
    
    data.ideas.unshift(newIdea);
    
    titleInput.value = '';
    clearRichEditor();
    category.value = '';
    
    saveData();
    renderIdeas();
}

function deleteIdea(id) {
    deleteItem(id, 'ideas', 'idea', [renderIdeas]);
}

// UPDATED: Open edit modal instead of using main form
function editIdea(id) {
    const idea = data.ideas.find(i => i.id === id);
    if (!idea) return;

    editingIdeaId = id;
    
    document.getElementById('editIdeaTitleInput').value = idea.title;
    
    setTimeout(() => {
        setEditRichEditorContent(idea.text);
    }, 100);
    
    openEditModal({
        id: id,
        dataKey: 'ideas',
        modalId: 'ideaEditModal',
        skipDataLoad: true, // We already loaded the data above
        categoryField: {
            editId: 'editIdeaCategory',
            dataKey: 'category',
            customCategories: data.customCategories,
            defaultCategories: DEFAULT_IDEA_CATEGORIES
        },
        focusId: 'editIdeaTitleInput'
    });
}

// ADDED: Save idea edit from modal
function saveIdeaEdit() {
    if (!editingIdeaId) return;
    
    const idea = data.ideas.find(i => i.id === editingIdeaId);
    if (!idea) return;
    
    const title = document.getElementById('editIdeaTitleInput').value.trim();
    const text = getEditRichEditorContent();
    const category = document.getElementById('editIdeaCategory').value;
    
    const textOnly = text.replace(/<[^>]*>/g, '').trim();
    
    if (!title || !textOnly) {
        alert('Please enter both title and idea text');
        return;
    }
    
    idea.title = title;
    idea.text = text;
    idea.category = category;
    
    saveData();
    renderIdeas();
    closeIdeaEditModal();
}

// Close idea edit modal
function closeIdeaEditModal() {
    closeModal('ideaEditModal');
    editingIdeaId = null;
}

function filterIdeas(category) {
    currentIdeaFilter = category;
    renderIdeas();
}

function getIdeaCategoryColor(categoryName) {
    const categoryData = data.customCategories.find(c => c.name === categoryName);
    if (categoryData) return categoryData.color;
    
    const defaultColors = {
        'personal': '#fce7f3',
        'work': '#dbeafe',
        'study': '#e0e7ff',
        'relationships': '#fce7f3',
        'creative': '#fef3c7'
    };
    
    return defaultColors[categoryName] || '#f3f4f6';
}

function getIdeaFilterColor(categoryName) {
    const categoryData = data.customCategories.find(c => c.name === categoryName);
    if (categoryData) return categoryData.color;
    
    const filterColors = {
        'personal': '#ec4899',
        'work': '#3b82f6',
        'study': '#6366f1',
        'relationships': '#ec4899',
        'creative': '#f59e0b'
    };
    
    return filterColors[categoryName] || '#6b7280';
}

function renderIdeaFilters() {
    const container = document.getElementById('ideaFilters');
    if (!container) return;
    
    const categories = new Set();
    categories.add('all');
    categories.add('no-category');
    
    if (typeof DEFAULT_IDEA_CATEGORIES !== 'undefined') {
        DEFAULT_IDEA_CATEGORIES.forEach(cat => categories.add(cat));
    }
    
    data.customCategories.forEach(cat => categories.add(cat.name));
    
    data.ideas.forEach(idea => {
        if (idea.category) {
            categories.add(idea.category);
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
        if (cat === 'all') displayName = 'All Ideas';
        else if (cat === 'no-category') displayName = 'No Category';
        else displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        
        const isActive = currentIdeaFilter === cat ? 'active' : '';
        const color = (cat !== 'all' && cat !== 'no-category') ? getIdeaFilterColor(cat) : '';
        const dataColor = color ? `data-color="${color}"` : '';
        
        let inlineStyle = '';
        if (isActive && color) {
            inlineStyle = `style="background: ${color}; border-color: ${color}; color: white;"`;
        }
        
        html += `<button class="filter-btn ${isActive}" onclick="filterIdeas('${cat}')" ${dataColor} ${inlineStyle}>${displayName}</button>`;
    });
    
    html += '</div>';
    container.innerHTML = html;

    applyIdeaFilterHoverColors();
}

function applyIdeaFilterHoverColors() {
    const filterButtons = document.querySelectorAll('#ideaFilters .filter-btn[data-color]');
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

function renderIdeas() {
    renderIdeaFilters();
    
    const container = document.getElementById('ideasGrid');
    
    let filteredIdeas = data.ideas;
    if (currentIdeaFilter !== 'all') {
        if (currentIdeaFilter === 'no-category') {
            filteredIdeas = data.ideas.filter(i => !i.category || i.category === '');
        } else {
            filteredIdeas = data.ideas.filter(i => i.category === currentIdeaFilter);
        }
    }
    
    if (filteredIdeas.length === 0) {
        container.innerHTML = '<div class="empty-state empty-state-grid">No ideas in this category.</div>';
        return;
    }
    
    const html = filteredIdeas.map(idea => {
        const backgroundColor = idea.category ? getIdeaCategoryColor(idea.category) : '#f3f4f6';
        const styleAttr = `style="background: ${backgroundColor};"`;
        const categoryDisplay = idea.category || 'no category';
        
        return `
            <div class="idea-card" ${styleAttr}>
                <div class="idea-category">${categoryDisplay}</div>
                <div class="idea-title">${idea.title}</div>
                <div class="idea-text">${idea.text}</div>
                <button class="idea-delete" onclick="editIdea('${idea.id}')" title="Edit idea">✏️</button>
                <button class="idea-delete" onclick="deleteIdea('${idea.id}')" title="Delete idea">🗑️</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Make functions globally accessible
window.editIdea = editIdea;
window.closeIdeaEditModal = closeIdeaEditModal;
window.saveIdeaEdit = saveIdeaEdit;
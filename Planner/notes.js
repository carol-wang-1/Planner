// Notes Module

function openNoteModal() {
    document.getElementById('noteModal').classList.add('active');
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteTitle').focus();
}

function closeNoteModal() {
    closeModal('noteModal');
    const modal = document.getElementById('noteModal');
    modal.dataset.editId = '';
    document.getElementById('noteModalTitle').textContent = 'New Note';
}

function saveNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
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
    titleInput.value = '';
    contentInput.value = '';
    saveData();
    renderNotes();
    closeNoteModal();
}

function deleteNote(id) {
    deleteItem(id, 'notes', 'note', [renderNotes]);
}

function editNote(id) {
    const note = data.notes.find(n => n.id === id);
    if (!note) return;
    
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('noteModalTitle').textContent = 'Edit Note';
    document.getElementById('noteModal').classList.add('active');
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
    
    if (!title || !content) {
        alert('Please enter both title and content');
        return;
    }
    
    if (editId) {
        updateNote(editId, title, content);
        modal.dataset.editId = '';
    } else {
        const newNote = {
            id: Date.now().toString(),
            title: title,
            content: content,
            createdAt: new Date().toISOString()
        };
        data.notes.push(newNote);
        saveData();
        renderNotes();
    }
    
    titleInput.value = '';
    contentInput.value = '';
    closeNoteModal();
}

function renderNotes() {
    const container = document.getElementById('notesList');
    
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
}
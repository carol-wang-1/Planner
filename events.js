// Events Module

let editingEventId = null;

function addEvent() {
    const dateInput = document.getElementById('eventDate');
    if (!dateInput.value) {
        alert('Please enter event name and date');
        return;
    }
    
    addItem({
        dataKey: 'events',
        inputId: 'eventInput',
        alertMessage: 'Please enter event name and date',
        extraFields: [
            { id: 'eventDate', key: 'date', required: true },
            { id: 'eventLocation', key: 'location', transform: (val) => val || null },
            { id: 'eventNotes', key: 'notes', transform: (val) => val || null }
        ],
        renderFunctions: [renderEvents, renderCalendar],
        insertMethod: 'push'
    });
}

function deleteEvent(id) {
    deleteItem(id, 'events', 'event', [renderEvents, renderCalendar]);
}

// UPDATED: Open edit modal instead of using main form
function editEvent(id) {
    editingEventId = id;  // ADD THIS LINE!
    
    openEditModal({
        id: id,
        dataKey: 'events',
        modalId: 'eventEditModal',
        fields: [
            { editId: 'editEventInput', dataKey: 'text' },
            { editId: 'editEventDate', dataKey: 'date' },
            { editId: 'editEventLocation', dataKey: 'location', default: '' },
            { editId: 'editEventNotes', dataKey: 'notes', default: '' }
        ],
        focusId: 'editEventInput'
    });
}

// Close event edit modal
function closeEventEditModal() {
    closeModal('eventEditModal');
    editingEventId = null;
}

function saveEventEdit() {
    const date = document.getElementById('editEventDate').value;
    if (!date) {
        alert('Please enter event name and date');
        return;
    }
    
    saveItemEdit({
        getId: () => editingEventId,  // Pass a function that returns the ID
        dataKey: 'events',
        fields: [
            { editId: 'editEventInput', dataKey: 'text', required: true, errorMsg: 'Please enter event name and date' },
            { editId: 'editEventDate', dataKey: 'date' },
            { editId: 'editEventLocation', dataKey: 'location', transform: (val) => val || null },
            { editId: 'editEventNotes', dataKey: 'notes', transform: (val) => val || null }
        ],
        renderFunctions: [renderEvents, renderCalendar],
        closeFunction: closeEventEditModal
    });

    
    saveItemEdit({
        editingIdVar: editingEventId,
        dataKey: 'events',
        fields: [
            { editId: 'editEventInput', dataKey: 'text', required: true, errorMsg: 'Please enter event name and date' },
            { editId: 'editEventDate', dataKey: 'date' },
            { editId: 'editEventLocation', dataKey: 'location', transform: (val) => val || null },
            { editId: 'editEventNotes', dataKey: 'notes', transform: (val) => val || null }
        ],
        renderFunctions: [renderEvents, renderCalendar],
        closeFunction: closeEventEditModal
    });
}

function renderEvents() {
    const container = document.getElementById('eventsList');
    
    if (data.events.length === 0) {
        container.innerHTML = '<div class="empty-state">No events yet. Add one above!</div>';
        return;
    }
    
    const sorted = [...data.events].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; 
    });
    
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

}

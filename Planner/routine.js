// Routine Module - For recurring activities like work, classes, etc.

let editingRoutineId = null;
let editingRoutineDay = null; // Track which specific day is being edited

function addRoutine() {
    const input = document.getElementById('routineInput');
    const startTimeInput = document.getElementById('routineStartTime');
    const endTimeInput = document.getElementById('routineEndTime');
    const frequencySelect = document.getElementById('routineFrequency');
    const text = input.value.trim();
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const frequency = frequencySelect.value;
    
    console.log('Adding routine:', { text, startTime, endTime, frequency });
    
    if (!text) {
        alert('Please enter an activity name');
        return;
    }
    
    if (!startTime || !endTime) {
        alert('Please enter start and end times');
        return;
    }
    
    // Get selected days if specific days
    let selectedDays = [];
    if (frequency === 'specific') {
        const dayCheckboxes = document.querySelectorAll('.routine-day-checkbox:checked');
        selectedDays = Array.from(dayCheckboxes).map(cb => cb.value);
        
        if (selectedDays.length === 0) {
            alert('Please select at least one day for your routine');
            return;
        }
    } else if (frequency === 'everyday') {
        selectedDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    } else if (frequency === 'weekdays') {
        selectedDays = ['mon', 'tue', 'wed', 'thu', 'fri'];
    } else if (frequency === 'weekends') {
        selectedDays = ['sat', 'sun'];
    }
    
    // FIXED: Ensure data.routines exists
    if (!data.routines) {
        data.routines = [];
    }
    
    const newRoutine = {
        id: Date.now().toString(),
        text: text,
        startTime: startTime,
        endTime: endTime,
        frequency: frequency,
        selectedDays: selectedDays,
        createdAt: new Date().toISOString()
    };
    
    console.log('New routine created:', newRoutine);
    
    data.routines.unshift(newRoutine);
    input.value = '';
    startTimeInput.value = '';
    endTimeInput.value = '';
    frequencySelect.value = 'specific';
    
    // Reset day checkboxes
    document.querySelectorAll('.routine-day-checkbox').forEach(cb => cb.checked = false);
    updateRoutineDaySelectionVisibility();
    
    saveData();
    renderRoutines();
    
    console.log('Routine added successfully. Total routines:', data.routines.length);
}

// CORRECT editRoutine function - opens modal
function editRoutine(id, day) {
    console.log('Edit routine called with id:', id, 'day:', day);
    
    // FIXED: Ensure data.routines exists
    if (!data.routines) {
        data.routines = [];
        return;
    }
    
    const routine = data.routines.find(r => r.id === id);
    if (!routine) {
        console.error('Routine not found:', id);
        return;
    }
    
    console.log('Found routine:', routine);
    
    editingRoutineId = id;
    editingRoutineDay = day; // Store which day was clicked
    
    // Populate edit modal
    document.getElementById('editRoutineInput').value = routine.text;
    document.getElementById('editRoutineStartTime').value = routine.startTime;
    document.getElementById('editRoutineEndTime').value = routine.endTime;
    document.getElementById('editRoutineFrequency').value = routine.frequency;
    
    // Set checkboxes
    document.querySelectorAll('.edit-routine-day-checkbox').forEach(cb => {
        cb.checked = routine.selectedDays.includes(cb.value);
    });
    
    updateEditRoutineDaySelectionVisibility();
    
    // Open modal
    const modal = document.getElementById('routineEditModal');
    if (modal) {
        console.log('Opening edit modal');
        modal.classList.add('active');
        document.getElementById('editRoutineInput').focus();
    } else {
        console.error('Edit modal not found!');
    }
}

function saveRoutineEdit() {
    if (!editingRoutineId) return;
    
    const routine = data.routines.find(r => r.id === editingRoutineId);
    if (!routine) return;
    
    const text = document.getElementById('editRoutineInput').value.trim();
    const startTime = document.getElementById('editRoutineStartTime').value;
    const endTime = document.getElementById('editRoutineEndTime').value;
    const frequency = document.getElementById('editRoutineFrequency').value;
    
    if (!text) {
        alert('Please enter an activity name');
        return;
    }
    
    if (!startTime || !endTime) {
        alert('Please enter start and end times');
        return;
    }
    
    // Get selected days
    let selectedDays = [];
    if (frequency === 'specific') {
        const dayCheckboxes = document.querySelectorAll('.edit-routine-day-checkbox:checked');
        selectedDays = Array.from(dayCheckboxes).map(cb => cb.value);
        
        if (selectedDays.length === 0) {
            alert('Please select at least one day for your routine');
            return;
        }
    } else if (frequency === 'everyday') {
        selectedDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    } else if (frequency === 'weekdays') {
        selectedDays = ['mon', 'tue', 'wed', 'thu', 'fri'];
    } else if (frequency === 'weekends') {
        selectedDays = ['sat', 'sun'];
    }
    
    // Update routine
    routine.text = text;
    routine.startTime = startTime;
    routine.endTime = endTime;
    routine.frequency = frequency;
    routine.selectedDays = selectedDays;
    
    saveData();
    renderRoutines();
    closeRoutineEditModal();
}

function closeRoutineEditModal() {
    closeModal('routineEditModal');
    editingRoutineId = null;
    editingRoutineDay = null;
}

function deleteRoutine(id) {
    if (confirm('Delete this routine activity?')) {
        if (!data.routines) {
            data.routines = [];
        }
        data.routines = data.routines.filter(r => r.id !== id);
        saveData();
        renderRoutines();
    }
}

// Smart delete with options
function deleteRoutineWithOptions(id, day) {
    if (!data.routines) {
        data.routines = [];
        return;
    }
    
    const routine = data.routines.find(r => r.id === id);
    if (!routine) return;
    
    // Create custom confirmation dialog
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-box" style="max-width: 400px;">
            <div class="modal-header">
                <h3>Delete Routine</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem; color: var(--text-primary);">Do you want to delete only this one or all of them?</p>
            </div>
            <div class="modal-footer" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
                <button class="btn-cancel" onclick="deleteRoutineThisOne('${id}', '${day}'); this.closest('.modal').remove();">This One</button>
                <button class="btn-save" style="background: var(--priority-high);" onclick="deleteRoutineAll('${id}'); this.closest('.modal').remove();">All</button>
                <button class="btn-cancel" onclick="this.closest('.modal').remove();">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Delete only this specific day
function deleteRoutineThisOne(id, day) {
    if (!data.routines) return;
    
    const routine = data.routines.find(r => r.id === id);
    if (!routine) return;
    
    console.log('Deleting this one:', day, 'from', routine.selectedDays);
    
    // Remove the specific day from selectedDays
    routine.selectedDays = routine.selectedDays.filter(d => d !== day);
    
    console.log('Remaining days:', routine.selectedDays);
    
    // If no days left, delete the entire routine
    if (routine.selectedDays.length === 0) {
        data.routines = data.routines.filter(r => r.id !== id);
    }
    
    saveData();
    renderRoutines();
}

// Delete all occurrences (entire routine)
function deleteRoutineAll(id) {
    if (!data.routines) return;
    
    console.log('Deleting all for routine:', id);
    
    data.routines = data.routines.filter(r => r.id !== id);
    saveData();
    renderRoutines();
}

function updateEditRoutineDaySelectionVisibility() {
    const frequency = document.getElementById('editRoutineFrequency').value;
    const daySelector = document.getElementById('editRoutineDaySelector');
    
    if (daySelector) {
        daySelector.style.display = frequency === 'specific' ? 'block' : 'none';
    }
}

function toggleAllEditRoutineDays(checked) {
    document.querySelectorAll('.edit-routine-day-checkbox').forEach(cb => {
        cb.checked = checked;
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getDayNames(selectedDays) {
    const dayNames = {
        'sun': 'Sun', 'mon': 'Mon', 'tue': 'Tue', 
        'wed': 'Wed', 'thu': 'Thu', 'fri': 'Fri', 'sat': 'Sat'
    };
    return selectedDays.map(d => dayNames[d]).join(', ');
}

function renderRoutines() {
    const container = document.getElementById('routineList');
    
    if (!container) {
        console.error('Routine list container not found!');
        return;
    }
    
    if (!data.routines || !Array.isArray(data.routines)) {
        data.routines = [];
    }
    
    console.log('Rendering routines. Count:', data.routines.length);
    
    if (data.routines.length === 0) {
        container.innerHTML = '<div class="empty-state">No routine activities yet. Add your regular schedule above!</div>';
        return;
    }
    
    // Group by days for better organization
    const routinesByDay = {};
    const dayOrder = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayNamesFull = {
        'sun': 'Sunday', 'mon': 'Monday', 'tue': 'Tuesday', 
        'wed': 'Wednesday', 'thu': 'Thursday', 'fri': 'Friday', 'sat': 'Saturday'
    };
    
    // Initialize all days
    dayOrder.forEach(day => {
        routinesByDay[day] = [];
    });
    
    // Group routines by day
    data.routines.forEach(routine => {
        routine.selectedDays.forEach(day => {
            routinesByDay[day].push(routine);
        });
    });
    
    let html = '<div class="routine-week-view">';
    
    dayOrder.forEach(day => {
        const dayRoutines = routinesByDay[day];
        
        if (dayRoutines.length > 0) {
            // Sort by start time
            dayRoutines.sort((a, b) => a.startTime.localeCompare(b.startTime));
            
            html += `
                <div class="routine-day-section">
                    <h3 class="routine-day-header">${dayNamesFull[day]}</h3>
                    <div class="routine-items">
            `;
            
            dayRoutines.forEach(routine => {
                const frequencyDisplay = routine.frequency === 'specific' 
                    ? getDayNames(routine.selectedDays)
                    : routine.frequency === 'everyday' 
                    ? 'Every Day'
                    : routine.frequency === 'weekdays'
                    ? 'Weekdays'
                    : 'Weekends';
                
                html += `
                    <div class="routine-item">
                        <div class="routine-time">${formatTime(routine.startTime)} - ${formatTime(routine.endTime)}</div>
                        <div class="routine-text">${routine.text}</div>
                        <div class="routine-frequency">${frequencyDisplay}</div>
                        <div class="routine-actions">
                            <button class="item-delete" onclick="event.stopPropagation(); editRoutine('${routine.id}', '${day}')" title="Edit routine">✏️</button>
                            <button class="item-delete" onclick="event.stopPropagation(); deleteRoutineWithOptions('${routine.id}', '${day}')" title="Delete routine">🗑️</button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    
    container.innerHTML = html;
}

function updateRoutineDaySelectionVisibility() {
    const frequency = document.getElementById('routineFrequency').value;
    const daySelector = document.getElementById('routineDaySelector');
    
    if (daySelector) {
        daySelector.style.display = frequency === 'specific' ? 'block' : 'none';
    }
}

function toggleAllRoutineDays(checked) {
    document.querySelectorAll('.routine-day-checkbox').forEach(cb => {
        cb.checked = checked;
    });
}

// Make functions globally accessible
window.addRoutine = addRoutine;
window.deleteRoutine = deleteRoutine;
window.deleteRoutineWithOptions = deleteRoutineWithOptions;
window.deleteRoutineThisOne = deleteRoutineThisOne;
window.deleteRoutineAll = deleteRoutineAll;
window.editRoutine = editRoutine;
window.saveRoutineEdit = saveRoutineEdit;
window.closeRoutineEditModal = closeRoutineEditModal;
window.updateRoutineDaySelectionVisibility = updateRoutineDaySelectionVisibility;
window.updateEditRoutineDaySelectionVisibility = updateEditRoutineDaySelectionVisibility;
window.toggleAllRoutineDays = toggleAllRoutineDays;
window.toggleAllEditRoutineDays = toggleAllEditRoutineDays;
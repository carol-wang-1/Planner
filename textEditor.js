// Rich Text Editor Module

// Update button states based on current selection
function updateButtonStates(editorId, toolbarId) {
    const editor = document.getElementById(editorId);
    if (!editor) return;
    
    // Get all toolbar buttons
    const toolbar = editor.previousElementSibling;
    if (!toolbar || !toolbar.classList.contains('editor-toolbar')) return;
    
    const buttons = toolbar.querySelectorAll('.editor-btn');
    
    buttons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (!onclick) return;
        
        // Check which command this button executes
        let isActive = false;
        
        if (onclick.includes("'bold'")) {
            isActive = document.queryCommandState('bold');
        } else if (onclick.includes("'italic'")) {
            isActive = document.queryCommandState('italic');
        } else if (onclick.includes("'underline'")) {
            isActive = document.queryCommandState('underline');
        } else if (onclick.includes("'insertUnorderedList'")) {
            isActive = document.queryCommandState('insertUnorderedList');
        } else if (onclick.includes("'insertOrderedList'")) {
            isActive = document.queryCommandState('insertOrderedList');
        } else if (onclick.includes("'h1'")) {
            isActive = document.queryCommandValue('formatBlock').toLowerCase() === 'h1';
        } else if (onclick.includes("'h2'")) {
            isActive = document.queryCommandValue('formatBlock').toLowerCase() === 'h2';
        }
        
        // Toggle active class
        if (isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Format text with rich formatting (for main editor)
function formatText(command) {
    document.execCommand(command, false, null);
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        editor.focus();
        // Update button states after formatting
        setTimeout(() => updateButtonStates('ideaRichEditor'), 10);
    }
}

// Format as heading (for main editor)
function formatHeading(tag) {
    // Check if already in this heading format
    const currentFormat = document.queryCommandValue('formatBlock').toLowerCase();
    
    if (currentFormat === tag) {
        // If already this heading, toggle it off to paragraph
        document.execCommand('formatBlock', false, 'p');
    } else {
        // Apply the heading
        document.execCommand('formatBlock', false, tag);
    }
    
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        editor.focus();
        // Update button states after formatting
        setTimeout(() => updateButtonStates('ideaRichEditor'), 10);
    }
}

// Clear all formatting (for main editor)
function clearFormatting() {
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        // Completely clear the editor content
        editor.innerHTML = '';
        editor.focus();
        // Update button states after clearing
        setTimeout(() => updateButtonStates('ideaRichEditor'), 10);
    }
}

// Get HTML content from rich editor (main)
function getRichEditorContent() {
    const editor = document.getElementById('ideaRichEditor');
    return editor ? editor.innerHTML : '';
}

// Set HTML content in rich editor (main)
function setRichEditorContent(htmlContent) {
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        editor.innerHTML = htmlContent || '';
    }
}

// Clear rich editor (main)
function clearRichEditor() {
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        editor.innerHTML = '';
    }
    // Clear all button states
    updateButtonStates('ideaRichEditor');
}

// Format text with rich formatting (for EDIT modal)
function formatEditText(command) {
    document.execCommand(command, false, null);
    const editor = document.getElementById('editIdeaRichEditor');
    if (editor) {
        editor.focus();
        // Update button states after formatting
        setTimeout(() => updateButtonStates('editIdeaRichEditor'), 10);
    }
}

// Format as heading (for EDIT modal)
function formatEditHeading(tag) {
    // Check if already in this heading format
    const currentFormat = document.queryCommandValue('formatBlock').toLowerCase();
    
    if (currentFormat === tag) {
        // If already this heading, toggle it off to paragraph
        document.execCommand('formatBlock', false, 'p');
    } else {
        // Apply the heading
        document.execCommand('formatBlock', false, tag);
    }
    
    const editor = document.getElementById('editIdeaRichEditor');
    if (editor) {
        editor.focus();
        // Update button states after formatting
        setTimeout(() => updateButtonStates('editIdeaRichEditor'), 10);
    }
}

// Clear all formatting (for EDIT modal)
function clearEditFormatting() {
    const editor = document.getElementById('editIdeaRichEditor');
    if (editor) {
        // Completely clear the editor content
        editor.innerHTML = '';
        editor.focus();
        // Update button states after clearing
        setTimeout(() => updateButtonStates('editIdeaRichEditor'), 10);
    }
}

// Get HTML content from edit rich editor
function getEditRichEditorContent() {
    const editor = document.getElementById('editIdeaRichEditor');
    return editor ? editor.innerHTML : '';
}

// Set HTML content in edit rich editor
function setEditRichEditorContent(htmlContent) {
    const editor = document.getElementById('editIdeaRichEditor');
    if (editor) {
        editor.innerHTML = htmlContent || '';
    }
}

// Initialize rich editor with keyboard shortcuts and event listeners
function initializeRichEditor() {
    // Main editor
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        // Keyboard shortcuts
        editor.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        formatText('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        formatText('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        formatText('underline');
                        break;
                }
            }
        });
        
        editor.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.stopPropagation();
            }
        });
        
        // Update button states when selection changes (desktop)
        editor.addEventListener('mouseup', function() {
            updateButtonStates('ideaRichEditor');
        });
        
        editor.addEventListener('keyup', function() {
            updateButtonStates('ideaRichEditor');
        });
        
        // Update button states when editor gains focus
        editor.addEventListener('focus', function() {
            updateButtonStates('ideaRichEditor');
        });
        
        // For mobile: update states after touch events
        editor.addEventListener('touchend', function() {
            setTimeout(() => updateButtonStates('ideaRichEditor'), 100);
        });
    }
    
    // Edit modal editor
    const editEditor = document.getElementById('editIdeaRichEditor');
    if (editEditor) {
        // Keyboard shortcuts
        editEditor.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        formatEditText('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        formatEditText('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        formatEditText('underline');
                        break;
                }
            }
        });
        
        editEditor.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.stopPropagation();
            }
        });
        
        // Update button states when selection changes (desktop)
        editEditor.addEventListener('mouseup', function() {
            updateButtonStates('editIdeaRichEditor');
        });
        
        editEditor.addEventListener('keyup', function() {
            updateButtonStates('editIdeaRichEditor');
        });
        
        // Update button states when editor gains focus
        editEditor.addEventListener('focus', function() {
            updateButtonStates('editIdeaRichEditor');
        });
        
        // For mobile: update states after touch events
        editEditor.addEventListener('touchend', function() {
            setTimeout(() => updateButtonStates('editIdeaRichEditor'), 100);
        });
    }
}

// Re-initialize when modals open (for edit modal)
function reinitializeEditEditor() {
    const editEditor = document.getElementById('editIdeaRichEditor');
    if (editEditor) {
        // Remove existing listeners to avoid duplicates
        const newEditor = editEditor.cloneNode(true);
        editEditor.parentNode.replaceChild(newEditor, editEditor);
        
        // Re-run initialization
        initializeRichEditor();
        
        // Update button states immediately
        setTimeout(() => updateButtonStates('editIdeaRichEditor'), 50);
    }
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRichEditor);
} else {
    initializeRichEditor();
}

// Make functions globally accessible
window.formatText = formatText;
window.formatHeading = formatHeading;
window.clearFormatting = clearFormatting;
window.formatEditText = formatEditText;
window.formatEditHeading = formatEditHeading;
window.clearEditFormatting = clearEditFormatting;
window.updateButtonStates = updateButtonStates;
window.reinitializeEditEditor = reinitializeEditEditor;
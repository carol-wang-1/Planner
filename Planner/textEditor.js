// Rich Text Editor Module

// Format text with rich formatting (for main editor)
function formatText(command) {
    document.execCommand(command, false, null);
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        editor.focus();
    }
}

// Format as heading (for main editor)
function formatHeading(tag) {
    document.execCommand('formatBlock', false, tag);
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        editor.focus();
    }
}

// Clear all formatting (for main editor)
function clearFormatting() {
    document.execCommand('removeFormat', false, null);
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
        editor.focus();
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
}

// ADDED: Format text with rich formatting (for EDIT modal)
function formatEditText(command) {
    document.execCommand(command, false, null);
    const editor = document.getElementById('editIdeaRichEditor');
    if (editor) {
        editor.focus();
    }
}

// ADDED: Format as heading (for EDIT modal)
function formatEditHeading(tag) {
    document.execCommand('formatBlock', false, tag);
    const editor = document.getElementById('editIdeaRichEditor');
    if (editor) {
        editor.focus();
    }
}

// ADDED: Clear all formatting (for EDIT modal)
function clearEditFormatting() {
    document.execCommand('removeFormat', false, null);
    const editor = document.getElementById('editIdeaRichEditor');
    if (editor) {
        editor.focus();
    }
}

// ADDED: Get HTML content from edit rich editor
function getEditRichEditorContent() {
    const editor = document.getElementById('editIdeaRichEditor');
    return editor ? editor.innerHTML : '';
}

// ADDED: Set HTML content in edit rich editor
function setEditRichEditorContent(htmlContent) {
    const editor = document.getElementById('editIdeaRichEditor');
    if (editor) {
        editor.innerHTML = htmlContent || '';
    }
}

// Initialize rich editor with keyboard shortcuts
function initializeRichEditor() {
    const editor = document.getElementById('ideaRichEditor');
    if (editor) {
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
    }
    
    // ADDED: Initialize edit modal rich editor
    const editEditor = document.getElementById('editIdeaRichEditor');
    if (editEditor) {
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
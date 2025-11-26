// Configuration - Update this with your backend URL
// Automatically detects if running in Docker or standalone
const getApiBaseUrl = () => {
    // If running in Docker, backend is accessible via the exposed port
    // If running standalone, use localhost
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Check if we're accessing via localhost or 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
        return 'http://localhost:3000/api';
    }
    
    // For other hosts (e.g., Docker container name resolution won't work from browser)
    // Use the same host with port 3000
    return `${protocol}//${hostname}:3000/api`;
};

const API_BASE_URL = getApiBaseUrl();

// DOM Elements
const form = document.getElementById('record-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const recordsContainer = document.getElementById('records-container');
const loading = document.getElementById('loading');
const recordIdInput = document.getElementById('record-id');

let editingRecordId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadRecords();
    setupFormHandlers();
});

// Setup form event handlers
function setupFormHandlers() {
    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        description: document.getElementById('description').value
    };

    try {
        if (editingRecordId) {
            await updateRecord(editingRecordId, formData);
        } else {
            await createRecord(formData);
        }
        resetForm();
        loadRecords();
    } catch (error) {
        showError('Failed to save record. Please try again.');
        console.error('Error:', error);
    }
}

// API Functions
async function createRecord(data) {
    const response = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to create record');
    }

    showSuccess('Record created successfully!');
    return await response.json();
}

async function loadRecords() {
    loading.style.display = 'block';
    recordsContainer.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE_URL}/records`);
        if (!response.ok) {
            throw new Error('Failed to load records');
        }

        const records = await response.json();
        loading.style.display = 'none';

        if (records.length === 0) {
            recordsContainer.innerHTML = '<div class="empty-state"><p>No records found. Create your first record!</p></div>';
            return;
        }

        records.forEach(record => {
            const recordCard = createRecordCard(record);
            recordsContainer.appendChild(recordCard);
        });
    } catch (error) {
        loading.style.display = 'none';
        recordsContainer.innerHTML = '<div class="error-message">Failed to load records. Please check if the backend is running.</div>';
        console.error('Error loading records:', error);
    }
}

async function updateRecord(id, data) {
    const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update record');
    }

    showSuccess('Record updated successfully!');
    return await response.json();
}

async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this record?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/records/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete record');
        }

        showSuccess('Record deleted successfully!');
        loadRecords();
    } catch (error) {
        showError('Failed to delete record. Please try again.');
        console.error('Error deleting record:', error);
    }
}

// UI Functions
function createRecordCard(record) {
    const card = document.createElement('div');
    card.className = 'record-card';
    card.innerHTML = `
        <h3>${escapeHtml(record.name)}</h3>
        <p><strong>Email:</strong> ${escapeHtml(record.email)}</p>
        <p><strong>Description:</strong> ${escapeHtml(record.description || 'N/A')}</p>
        <div class="record-actions">
            <button class="btn-edit" onclick="editRecord(${record.id})">Edit</button>
            <button class="btn-delete" onclick="deleteRecord(${record.id})">Delete</button>
        </div>
    `;
    return card;
}

function editRecord(id) {
    // Find the record
    fetch(`${API_BASE_URL}/records/${id}`)
        .then(response => response.json())
        .then(record => {
            document.getElementById('name').value = record.name;
            document.getElementById('email').value = record.email;
            document.getElementById('description').value = record.description || '';
            recordIdInput.value = record.id;
            editingRecordId = record.id;
            
            formTitle.textContent = 'Edit Record';
            submitBtn.textContent = 'Update Record';
            cancelBtn.style.display = 'block';
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            showError('Failed to load record for editing.');
            console.error('Error:', error);
        });
}

function resetForm() {
    form.reset();
    recordIdInput.value = '';
    editingRecordId = null;
    formTitle.textContent = 'Add New Record';
    submitBtn.textContent = 'Add Record';
    cancelBtn.style.display = 'none';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const formSection = document.querySelector('.form-section');
    formSection.insertBefore(errorDiv, formSection.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const formSection = document.querySelector('.form-section');
    formSection.insertBefore(successDiv, formSection.firstChild);
    
    setTimeout(() => successDiv.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally for onclick handlers
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;


let currentUser = null;
let currentUserType = null;
let map = null;
let profiles = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadSampleData();
    checkStoredUser();
}

function setupEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    document.getElementById('authBtn').addEventListener('click', () => {
        showSection('auth');
    });

    document.querySelectorAll('.user-type-btn').forEach(btn => {
        btn.addEventListener('click', handleUserTypeSelection);
    });

    document.getElementById('authSwitchBtn').addEventListener('click', toggleAuthMode);
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleProfileFilter);
    });

    document.getElementById('callHelpBtn').addEventListener('click', handleCallForHelp);
    
    document.querySelectorAll('.requests-filter-btn').forEach(btn => {
        btn.addEventListener('click', handleRequestsFilter);
    });
}

function handleNavigation(e) {
    e.preventDefault();
    const sectionId = e.target.getAttribute('href').substring(1);
    showSection(sectionId);
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    if (sectionId === 'map') {
        initializeMap();
    } else if (sectionId === 'profiles') {
        displayProfiles();
    } else if (sectionId === 'help-requests') {
        loadHelpRequests();
    }
}

function handleUserTypeSelection(e) {
    currentUserType = e.target.dataset.type;
    showSection('auth');
}

function toggleAuthMode() {
    const authTitle = document.getElementById('authTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authSwitchText = document.getElementById('authSwitchText');
    const authSwitchBtn = document.getElementById('authSwitchBtn');

    if (authTitle.textContent === 'Sign In') {
        authTitle.textContent = 'Sign Up';
        authSubmitBtn.textContent = 'Sign Up';
        authSwitchText.textContent = 'Already have an account?';
        authSwitchBtn.textContent = 'Sign In';
    } else {
        authTitle.textContent = 'Sign In';
        authSubmitBtn.textContent = 'Sign In';
        authSwitchText.textContent = "Don't have an account?";
        authSwitchBtn.textContent = 'Sign Up';
    }
}

function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isSignUp = document.getElementById('authTitle').textContent === 'Sign Up';

    if (isSignUp) {
        currentUser = { email, userType: currentUserType };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showProfileSetup();
    } else {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser && storedUser.email === email) {
            currentUser = storedUser;
            updateAuthButton();
            showSection('home');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    }
}

function showProfileSetup() {
    const profileTitle = document.getElementById('profileTitle');
    const elderlyFields = document.getElementById('elderlyFields');
    const helperFields = document.getElementById('helperFields');

    if (currentUserType === 'elderly') {
        profileTitle.textContent = 'Create Your Care Profile';
        elderlyFields.classList.add('active');
        helperFields.classList.remove('active');
    } else {
        profileTitle.textContent = 'Create Your Helper Profile';
        helperFields.classList.add('active');
        elderlyFields.classList.remove('active');
    }

    showSection('profile-setup');
}

function handleProfileSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const profileData = {
        id: Date.now().toString(),
        email: currentUser.email,
        userType: currentUserType,
        fullName: formData.get('fullName') || document.getElementById('fullName').value,
        phone: formData.get('phone') || document.getElementById('phone').value,
        address: formData.get('address') || document.getElementById('address').value,
        lat: 33.7490 + (Math.random() - 0.5) * 0.1,
        lng: -84.3880 + (Math.random() - 0.5) * 0.1
    };

    if (currentUserType === 'elderly') {
        profileData.age = document.getElementById('age').value;
        profileData.needsHelp = Array.from(document.querySelectorAll('#elderlyFields input[type="checkbox"]:checked')).map(cb => cb.value);
        profileData.emergencyContact = document.getElementById('emergencyContact').value;
    } else {
        profileData.availability = Array.from(document.querySelectorAll('#helperFields input[type="checkbox"]:checked')).map(cb => cb.value);
        profileData.canHelp = Array.from(document.querySelectorAll('#helperFields .checkbox-group:nth-of-type(2) input[type="checkbox"]:checked')).map(cb => cb.value);
        profileData.experience = document.getElementById('experience').value;
        profileData.maxDistance = document.getElementById('maxDistance').value;
    }

    currentUser.profile = profileData;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    let storedProfiles = JSON.parse(localStorage.getItem('profiles')) || [];
    storedProfiles.push(profileData);
    localStorage.setItem('profiles', JSON.stringify(storedProfiles));

    profiles = storedProfiles;
    updateAuthButton();
    showSection('home');
    alert('Profile created successfully!');
}

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    const callHelpBtn = document.getElementById('callHelpBtn');
    const helpRequestsLink = document.querySelector('a[href="#help-requests"]');
    
    if (currentUser) {
        authBtn.textContent = 'Sign Out';
        authBtn.onclick = signOut;
        callHelpBtn.style.display = 'block';
        if (helpRequestsLink) {
            helpRequestsLink.style.display = 'block';
        }
    } else {
        authBtn.textContent = 'Sign In';
        authBtn.onclick = () => showSection('auth');
        callHelpBtn.style.display = 'none';
        if (helpRequestsLink) {
            helpRequestsLink.style.display = 'none';
        }
    }
}

function signOut() {
    currentUser = null;
    currentUserType = null;
    localStorage.removeItem('currentUser');
    updateAuthButton();
    showSection('home');
}

function checkStoredUser() {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
        currentUser = storedUser;
        currentUserType = storedUser.userType;
        updateAuthButton();
    }
}

function loadSampleData() {
    const storedProfiles = JSON.parse(localStorage.getItem('profiles'));
    if (storedProfiles && storedProfiles.length > 0) {
        profiles = storedProfiles;
        return;
    }

    profiles = [
        {
            id: '1',
            userType: 'elderly',
            fullName: 'Margaret Johnson',
            age: 78,
            address: '123 Peachtree Street, Atlanta, GA',
            phone: '(555) 123-4567',
            needsHelp: ['grocery-shopping', 'transportation', 'companionship'],
            emergencyContact: 'Sarah Johnson (555) 987-6543',
            lat: 33.7490,
            lng: -84.3880
        },
        {
            id: '2',
            userType: 'helper',
            fullName: 'Emily Chen',
            age: 28,
            address: '456 Buckhead Avenue, Buckhead, GA',
            phone: '(555) 234-5678',
            availability: ['weekday-afternoon', 'weekend'],
            canHelp: ['grocery-shopping', 'cleaning', 'technology'],
            experience: 'Former nurse assistant with 3 years experience',
            maxDistance: 10,
            lat: 33.8484,
            lng: -84.3781
        },
        {
            id: '3',
            userType: 'elderly',
            fullName: 'Robert Williams',
            age: 82,
            address: '789 Midtown Drive, Midtown Atlanta, GA',
            phone: '(555) 345-6789',
            needsHelp: ['yard-work', 'technology', 'medication'],
            emergencyContact: 'Michael Williams (555) 876-5432',
            lat: 33.7701,
            lng: -84.3862
        },
        {
            id: '4',
            userType: 'helper',
            fullName: 'David Rodriguez',
            age: 35,
            address: '321 Decatur Square, Decatur, GA',
            phone: '(555) 456-7890',
            availability: ['weekday-morning', 'weekday-evening'],
            canHelp: ['transportation', 'yard-work', 'companionship'],
            experience: 'Community volunteer for 5 years',
            maxDistance: 8,
            lat: 33.7748,
            lng: -84.2963
        }
    ];

    localStorage.setItem('profiles', JSON.stringify(profiles));
}

function initializeMap() {
    if (map) {
        map.remove();
    }

    map = L.map('mapView').setView([33.7490, -84.3880], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    profiles.forEach(profile => {
        const markerColor = profile.userType === 'elderly' ? '#e74c3c' : '#3498db';
        const markerIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([profile.lat, profile.lng], { icon: markerIcon }).addTo(map);
        
        const popupContent = `
            <div style="text-align: center;">
                <h3>${profile.fullName}</h3>
                <p><strong>${profile.userType === 'elderly' ? 'Needs Help With:' : 'Can Help With:'}</strong></p>
                <p>${(profile.needsHelp || profile.canHelp || []).join(', ')}</p>
                <p><strong>Phone:</strong> ${profile.phone}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
}

function displayProfiles(filterType = 'all') {
    const profilesList = document.getElementById('profilesList');
    const filteredProfiles = filterType === 'all' ? profiles : profiles.filter(p => p.userType === filterType);

    profilesList.innerHTML = filteredProfiles.map(profile => {
        const avatar = profile.userType === 'elderly' ? '👴' : '🤝';
        const typeLabel = profile.userType === 'elderly' ? 'Needs Help' : 'Helper';
        const skills = profile.userType === 'elderly' ? profile.needsHelp : profile.canHelp;
        
        return `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar ${profile.userType}">
                        ${avatar}
                    </div>
                    <div class="profile-info">
                        <h3>${profile.fullName}</h3>
                        <p class="profile-type">${typeLabel}</p>
                    </div>
                </div>
                <div class="profile-details">
                    <p><strong>Address:</strong> ${profile.address}</p>
                    <p><strong>Phone:</strong> ${profile.phone}</p>
                    ${profile.age ? `<p><strong>Age:</strong> ${profile.age}</p>` : ''}
                    ${profile.experience ? `<p><strong>Experience:</strong> ${profile.experience}</p>` : ''}
                    ${profile.emergencyContact ? `<p><strong>Emergency Contact:</strong> ${profile.emergencyContact}</p>` : ''}
                    ${profile.maxDistance ? `<p><strong>Travel Distance:</strong> Up to ${profile.maxDistance} miles</p>` : ''}
                </div>
                <div class="profile-tags">
                    ${(skills || []).map(skill => `<span class="profile-tag">${skill.replace('-', ' ')}</span>`).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function handleProfileFilter(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const filterType = e.target.dataset.filter;
    displayProfiles(filterType);
}

function handleCallForHelp() {
    const dialogflowNumber = '+1-844-HELP-123'; // Example Dialogflow phone number
    
    // Show modal with calling options
    const modal = document.createElement('div');
    modal.className = 'call-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📞 Call for Help</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <p>You can call our automated assistant to describe what help you need.</p>
                <p><strong>Phone Number:</strong> <a href="tel:${dialogflowNumber}">${dialogflowNumber}</a></p>
                <p>Our AI assistant will:</p>
                <ul>
                    <li>Ask about the type of help you need</li>
                    <li>Record your request details</li>
                    <li>Connect you with available helpers in your area</li>
                    <li>Schedule assistance if needed</li>
                </ul>
                <div class="modal-buttons">
                    <button onclick="window.open('tel:${dialogflowNumber}')" class="call-now-btn">📞 Call Now</button>
                    <button onclick="startWebChat()" class="web-chat-btn">💬 Chat Online</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').onclick = () => {
        document.body.removeChild(modal);
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

function startWebChat() {
    // Initialize Dialogflow Messenger
    const chatContainer = document.createElement('div');
    chatContainer.innerHTML = `
        <df-messenger
            chat-title="Sunny Side Care Assistant"
            agent-id="your-agent-id"
            language-code="en"
            chat-icon="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDJINEMyLjkgMiAyIDIuOSAyIDRWMjJMMTggMjBIMjBDMjEuMSAyMCAyMiAxOS4xIDIyIDE4VjRDMjIgMi45IDIxLjEgMiAyMCAyWiIgZmlsbD0iI0ZGNkIzNSIvPgo8L3N2Zz4K">
        </df-messenger>
    `;
    
    document.body.appendChild(chatContainer);
    
    // Close the call modal
    const modal = document.querySelector('.call-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Help Requests functionality
async function loadHelpRequests() {
    try {
        const response = await fetch('/api/help-requests');
        const helpRequests = await response.json();
        displayHelpRequests(helpRequests);
    } catch (error) {
        console.error('Error loading help requests:', error);
        // Show sample data if server is not running
        displayHelpRequests(getSampleHelpRequests());
    }
}

function getSampleHelpRequests() {
    return [
        {
            id: '1',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            helpType: 'grocery-shopping',
            status: 'submitted',
            queryText: 'I need help with grocery shopping',
            address: '123 Peachtree Street, Atlanta, GA',
            timing: 'tomorrow afternoon',
            location: 'Atlanta, GA area'
        },
        {
            id: '2',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            helpType: 'transportation',
            status: 'pending',
            queryText: 'I need a ride to the doctor',
            address: '456 Buckhead Avenue, Buckhead, GA',
            timing: 'today',
            location: 'Atlanta, GA area'
        },
        {
            id: '3',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            helpType: 'companionship',
            status: 'completed',
            queryText: 'I feel lonely and need someone to talk to',
            address: '789 Midtown Drive, Midtown Atlanta, GA',
            timing: 'yesterday',
            location: 'Atlanta, GA area'
        }
    ];
}

function displayHelpRequests(helpRequests = [], filterType = 'all') {
    const helpRequestsList = document.getElementById('helpRequestsList');
    const filteredRequests = filterType === 'all' ? helpRequests : helpRequests.filter(req => req.status === filterType);
    
    if (filteredRequests.length === 0) {
        helpRequestsList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #7f8c8d;">
                <h3>No help requests found</h3>
                <p>When people call our assistance line, their requests will appear here.</p>
            </div>
        `;
        return;
    }
    
    helpRequestsList.innerHTML = filteredRequests.map(request => {
        const requestDate = new Date(request.timestamp).toLocaleDateString();
        const requestTime = new Date(request.timestamp).toLocaleTimeString();
        const helpTypeLabel = request.helpType ? request.helpType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General Help';
        
        return `
            <div class="help-request-card">
                <div class="request-header">
                    <h3 class="request-title">${helpTypeLabel} Request</h3>
                    <span class="request-status ${request.status}">${request.status}</span>
                </div>
                <div class="request-details">
                    <div class="request-detail">
                        <strong>Request:</strong> ${request.queryText || 'No details provided'}
                    </div>
                    ${request.address ? `<div class="request-detail"><strong>Address:</strong> ${request.address}</div>` : ''}
                    ${request.timing ? `<div class="request-detail"><strong>Timing:</strong> ${request.timing}</div>` : ''}
                    <div class="request-detail">
                        <strong>Requested:</strong> ${requestDate} at ${requestTime}
                    </div>
                    <div class="request-detail">
                        <strong>Request ID:</strong> ${request.id}
                    </div>
                    ${request.helperInfo ? `<div class="request-detail"><strong>Helper:</strong> ${request.helperInfo.name} - ${request.helperInfo.phone}</div>` : ''}
                </div>
                ${currentUserType === 'helper' && request.status !== 'completed' ? `
                    <div class="request-actions">
                        <button class="action-btn respond-btn" onclick="respondToRequest('${request.id}')">
                            📞 Respond to Request
                        </button>
                        ${request.status === 'submitted' ? `
                            <button class="action-btn complete-btn" onclick="markAsCompleted('${request.id}')">
                                ✓ Mark Complete
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function handleRequestsFilter(e) {
    document.querySelectorAll('.requests-filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const filterType = e.target.dataset.filter;
    loadHelpRequests().then(() => {
        // Re-apply filter after loading
        const helpRequestsList = document.getElementById('helpRequestsList');
        const currentRequests = getSampleHelpRequests(); // This would come from the loaded data in a real app
        displayHelpRequests(currentRequests, filterType);
    });
}

async function respondToRequest(requestId) {
    if (!currentUser || currentUserType !== 'helper') {
        alert('You must be signed in as a helper to respond to requests.');
        return;
    }
    
    const helperInfo = {
        name: currentUser.profile?.fullName || 'Helper',
        phone: currentUser.profile?.phone || 'N/A',
        email: currentUser.email
    };
    
    try {
        const response = await fetch(`/api/help-requests/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'submitted',
                helperInfo: helperInfo
            })
        });
        
        if (response.ok) {
            alert('Thank you for responding! The person who requested help will be notified.');
            loadHelpRequests(); // Reload the requests
        } else {
            throw new Error('Failed to respond to request');
        }
    } catch (error) {
        console.error('Error responding to request:', error);
        alert('Response recorded! In a real application, this would notify the person who needs help.');
        // Simulate success for demo purposes
        loadHelpRequests();
    }
}

async function markAsCompleted(requestId) {
    if (!currentUser || currentUserType !== 'helper') {
        alert('You must be signed in as a helper to mark requests as complete.');
        return;
    }
    
    try {
        const response = await fetch(`/api/help-requests/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'completed'
            })
        });
        
        if (response.ok) {
            alert('Request marked as completed!');
            loadHelpRequests(); // Reload the requests
        } else {
            throw new Error('Failed to update request');
        }
    } catch (error) {
        console.error('Error updating request:', error);
        alert('Request marked as completed! Thank you for helping.');
        // Simulate success for demo purposes
        loadHelpRequests();
    }
}
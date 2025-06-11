const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('.'));

// CORS middleware for web requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Store help requests in a JSON file
const helpRequestsFile = path.join(__dirname, 'help-requests.json');

// Initialize help requests file if it doesn't exist
if (!fs.existsSync(helpRequestsFile)) {
    fs.writeFileSync(helpRequestsFile, JSON.stringify([]));
}

// Helper function to read help requests
function readHelpRequests() {
    try {
        const data = fs.readFileSync(helpRequestsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading help requests:', error);
        return [];
    }
}

// Helper function to write help requests
function writeHelpRequests(requests) {
    try {
        fs.writeFileSync(helpRequestsFile, JSON.stringify(requests, null, 2));
    } catch (error) {
        console.error('Error writing help requests:', error);
    }
}

// Dialogflow webhook endpoint
app.post('/webhook', (req, res) => {
    console.log('Dialogflow webhook request:', JSON.stringify(req.body, null, 2));
    
    const { queryResult } = req.body;
    const { intent, parameters, queryText } = queryResult;
    
    let response = {};
    
    // Handle different intents
    switch (intent.displayName) {
        case 'Help Request - Grocery Shopping':
        case 'Help Request - Transportation':
        case 'Help Request - House Cleaning':
        case 'Help Request - Companionship':
        case 'Help Request - Technology':
            response = handleHelpRequest(queryResult);
            break;
            
        case 'Collect Address':
            response = handleAddressCollection(queryResult);
            break;
            
        case 'Collect Timing':
            response = handleTimingCollection(queryResult);
            break;
            
        case 'Emergency':
            response = handleEmergency(queryResult);
            break;
            
        default:
            response = {
                fulfillmentText: "I understand you need help. Can you tell me what specific type of assistance you're looking for?"
            };
    }
    
    res.json(response);
});

function handleHelpRequest(queryResult) {
    const { parameters } = queryResult;
    const helpType = parameters['help-type'];
    
    // Create a new help request
    const helpRequest = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        helpType: helpType,
        status: 'pending',
        queryText: queryResult.queryText,
        parameters: parameters
    };
    
    // Store the help request
    const requests = readHelpRequests();
    requests.push(helpRequest);
    writeHelpRequests(requests);
    
    return {
        fulfillmentText: `I've recorded that you need help with ${helpType.replace('-', ' ')}. To find the best helpers near you, could you please tell me your address?`,
        outputContexts: [
            {
                name: `${queryResult.session}/contexts/help-request`,
                lifespanCount: 5,
                parameters: {
                    'help-type': helpType,
                    'request-id': helpRequest.id
                }
            }
        ]
    };
}

function handleAddressCollection(queryResult) {
    const { parameters, outputContexts } = queryResult;
    const address = parameters.address;
    
    // Get the help request context
    const helpContext = outputContexts.find(ctx => ctx.name.includes('help-request'));
    
    if (helpContext) {
        const requestId = helpContext.parameters['request-id'];
        const helpType = helpContext.parameters['help-type'];
        
        // Update the help request with address
        const requests = readHelpRequests();
        const requestIndex = requests.findIndex(req => req.id === requestId);
        if (requestIndex !== -1) {
            requests[requestIndex].address = address;
            requests[requestIndex].location = 'Atlanta, GA area'; // Default for this demo
            writeHelpRequests(requests);
        }
        
        return {
            fulfillmentText: `Thank you! I have your address as: ${address}. When do you need help with ${helpType.replace('-', ' ')}? You can say 'today', 'tomorrow', 'this afternoon', or be more specific with a time.`,
            outputContexts: [
                {
                    name: `${queryResult.session}/contexts/help-request`,
                    lifespanCount: 5,
                    parameters: {
                        'help-type': helpType,
                        'request-id': requestId,
                        'address': address
                    }
                }
            ]
        };
    }
    
    return {
        fulfillmentText: "I have your address. What type of help do you need?"
    };
}

function handleTimingCollection(queryResult) {
    const { parameters, outputContexts } = queryResult;
    const timing = parameters.timing;
    
    // Get the help request context
    const helpContext = outputContexts.find(ctx => ctx.name.includes('help-request'));
    
    if (helpContext) {
        const requestId = helpContext.parameters['request-id'];
        const helpType = helpContext.parameters['help-type'];
        const address = helpContext.parameters['address'];
        
        // Update the help request with timing
        const requests = readHelpRequests();
        const requestIndex = requests.findIndex(req => req.id === requestId);
        if (requestIndex !== -1) {
            requests[requestIndex].timing = timing;
            requests[requestIndex].status = 'submitted';
            requests[requestIndex].completedAt = new Date().toISOString();
            writeHelpRequests(requests);
        }
        
        return {
            fulfillmentText: `Perfect! I've submitted your request for help with ${helpType.replace('-', ' ')} at ${address} for ${timing}. I'm now searching for available helpers in the Atlanta area. You should receive a call or message from a helper within the next 30 minutes. Your request ID is ${requestId}. Is there anything else I can help you with today?`
        };
    }
    
    return {
        fulfillmentText: "I've noted the timing. Let me find available helpers for you."
    };
}

function handleEmergency(queryResult) {
    // Log emergency request
    const emergencyRequest = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'emergency',
        queryText: queryResult.queryText,
        status: 'emergency'
    };
    
    const requests = readHelpRequests();
    requests.push(emergencyRequest);
    writeHelpRequests(requests);
    
    return {
        fulfillmentText: "This sounds like an emergency. Please hang up immediately and call 911 if you need medical assistance. If this is not a medical emergency but you need urgent help, please call our emergency line at 1-800-URGENT-1, and someone will assist you right away."
    };
}

// API endpoint to get help requests (for the web application)
app.get('/api/help-requests', (req, res) => {
    const requests = readHelpRequests();
    res.json(requests);
});

// API endpoint to update help request status
app.put('/api/help-requests/:id', (req, res) => {
    const { id } = req.params;
    const { status, helperInfo } = req.body;
    
    const requests = readHelpRequests();
    const requestIndex = requests.findIndex(req => req.id === id);
    
    if (requestIndex !== -1) {
        requests[requestIndex].status = status;
        if (helperInfo) {
            requests[requestIndex].helperInfo = helperInfo;
        }
        requests[requestIndex].updatedAt = new Date().toISOString();
        writeHelpRequests(requests);
        res.json({ success: true, request: requests[requestIndex] });
    } else {
        res.status(404).json({ error: 'Help request not found' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
    console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
    console.log(`Web application: http://localhost:${PORT}`);
});

module.exports = app;
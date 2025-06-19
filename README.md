# Sunny Side Care - Dialogflow Integration

A community care platform with Google Cloud Dialogflow integration for voice-based help requests.

## Features

- **Call for Help**: Signed-in users can access a phone number to call for assistance
- **Voice AI Assistant**: Dialogflow bot that understands various help requests
- **Help Request Management**: Track and respond to requests from the web interface
- **Community Profiles**: View helpers and people who need assistance in Atlanta, GA area
- **Real-time Communication**: Phone and web chat integration

## Quick Start

### 1. Run the Web Application

For a simple demo (without server):
```bash
# Open index.html in a web browser
open index.html
```

For full functionality with webhook server:
```bash
# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

### 2. Test the Call Feature

1. Sign up as either "I Need Help" or "I Want to Help"
2. Create your profile
3. Once signed in, you'll see a "📞 Call for Help" button
4. Click it to see calling options (placeholder phone number for demo)

## Google Cloud Dialogflow Setup

### Prerequisites
- Google Cloud Platform account
- Billing enabled on your GCP project

### Setup Steps

1. **Create Dialogflow Agent**
   - Go to [Dialogflow Console](https://dialogflow.cloud.google.com/)
   - Create new agent: "Sunny Side Care Assistant"
   - Follow instructions in `dialogflow-setup.md`

2. **Configure Phone Integration**
   - Enable Phone Gateway in Dialogflow Console
   - Get phone number from Contact Center AI
   - Update phone number in the application

3. **Set Up Webhook** (Optional)
   - Deploy `webhook-server.js` to cloud platform
   - Configure webhook URL in Dialogflow
   - Update webhook settings in agent

## Phone Integration Features

The Dialogflow bot can handle:

- **Grocery Shopping Help**: "I need help with groceries"
- **Transportation**: "I need a ride to the doctor"
- **House Cleaning**: "I need help cleaning my house"  
- **Companionship**: "I feel lonely"
- **Technology Help**: "I need help with my computer"
- **Emergency Situations**: "This is an emergency"

## File Structure

```
├── index.html              # Main web application
├── script.js               # Frontend JavaScript
├── styles.css              # Styling
├── dialogflow-config.json  # Dialogflow agent configuration
├── dialogflow-setup.md     # Detailed setup instructions
├── webhook-server.js       # Node.js webhook server
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## API Endpoints

When running the webhook server:

- `GET /api/help-requests` - Get all help requests
- `PUT /api/help-requests/:id` - Update help request status
- `POST /webhook` - Dialogflow webhook endpoint

## Demo Mode

The application includes sample data for demonstration:
- Sample user profiles in Atlanta, GA area
- Sample help requests with different statuses
- Mock API responses when server is not running

## Deployment

### Webhook Server
Deploy to platforms like:
- Google Cloud Run
- Heroku
- AWS Lambda
- Vercel

### Static Site
Deploy the frontend to:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## Environment Variables

For production deployment:

```bash
PORT=3000                    # Server port
DIALOGFLOW_PROJECT_ID=your-project-id
WEBHOOK_TOKEN=your-webhook-token
```

## Security Considerations

- Use HTTPS for all webhook endpoints
- Implement authentication for sensitive operations
- Protect user data according to privacy regulations
- Enable request validation in Dialogflow

## Support

For issues with:
- **Dialogflow Setup**: Check `dialogflow-setup.md`
- **Phone Integration**: Verify Google Cloud billing and permissions
- **Webhook Issues**: Check server logs and network connectivity

## License

MIT License - see LICENSE file for details
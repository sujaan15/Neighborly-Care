# Google Cloud Dialogflow Setup Guide

---

## Prerequisites
1. Google Cloud Platform account
2. Google Cloud Console access
3. Billing enabled on your GCP project

---

## Step 1: Create a Dialogflow Agent

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Dialogflow API:
    - Go to APIs & Services > Library
    - Search for "Dialogflow API"
    - Click Enable

4. Go to Dialogflow Console (https://dialogflow.cloud.google.com/)
5. Create a new agent:
    - Click "Create Agent"
    - Name: "Sunny Side Care Assistant"
    - Default Language: English
    - Default Time Zone: America/New_York
    - Google Project: Select your GCP project

---

## Step 2: Import Intents

1. In Dialogflow Console, go to Intents
2. Create the following intents based on `dialogflow-config.json`:

### Default Welcome Intent (modify existing)
- Training phrases: "hi", "hello", "help", "I need help"
- Response: "Hello! I'm the Sunny Side Care assistant. I'm here to help you find assistance with daily tasks. What do you need help with today?"

### Help Request - Grocery Shopping
- Training phrases: "I need help with groceries", "grocery shopping", "help with shopping"
- Parameters: help-type = "grocery-shopping"
- Response: "I understand you need help with grocery shopping. Can you tell me your address so I can find helpers near you?"

### Help Request - Transportation
- Training phrases: "I need a ride", "transportation help", "drive me to appointment"
- Parameters: help-type = "transportation"
- Response: "I can help you find someone to give you a ride. Where do you need to go, and when do you need transportation?"

### Help Request - House Cleaning
- Training phrases: "house cleaning", "I need help cleaning", "cleaning help"
- Parameters: help-type = "cleaning"
- Response: "I understand you need help with house cleaning. What specific cleaning tasks do you need help with?"

### Help Request - Companionship
- Training phrases: "I feel lonely", "I need company", "someone to talk to"
- Parameters: help-type = "companionship"
- Response: "I understand you'd like some companionship. Would you like someone to visit for conversation?"

### Help Request - Technology
- Training phrases: "technology help", "help with computer", "help with phone"
- Parameters: help-type = "technology"
- Response: "I can help you find someone to assist with technology. What specific technology do you need help with?"

### Collect Address
- Training phrases: "I live at [address]", "My address is [address]"
- Parameters: address = @sys.any
- Response: "Thank you for providing your address. When do you need this help?"

### Collect Timing
- Training phrases: "today", "tomorrow", "this afternoon", "as soon as possible"
- Parameters: timing = @sys.date-time
- Response: "Perfect! I've recorded your request for help. I'm connecting you with available helpers in the Atlanta area."

### Emergency
- Training phrases: "emergency", "urgent", "I fell", "I'm hurt"
- Response: "This sounds like an emergency. Please hang up and call 911 immediately if you need medical assistance."

---

## Step 3: Set Up Phone Integration

1. In Dialogflow Console, go to Integrations
2. Click on "Phone Gateway"
3. Enable phone integration
4. Get your phone number from Google Cloud Contact Center AI
5. Configure voice settings:
    - Voice: Choose a clear, friendly voice
    - Speed: Normal or slightly slower
    - Language: English (US)

---

## Step 4: Set Up Web Integration

1. In Integrations, enable "Dialogflow Messenger"
2. Copy the integration code
3. Replace "your-agent-id" in the web application with your actual agent ID

---

## Step 5: Set Up Webhook (Optional)

1. Create a webhook endpoint to capture help requests
2. In Dialogflow Console, go to Fulfillment
3. Enable Webhook
4. Enter your webhook URL
5. Add authentication headers if needed

---

## Step 6: Test Your Agent

1. Use the simulator in Dialogflow Console
2. Test with various phrases:
    - "I need help with groceries"
    - "I need a ride to the doctor"
    - "Can someone help me with my computer?"
3. Test phone integration by calling the assigned number

---

## Step 7: Deploy and Monitor

1. Monitor conversations in Dialogflow Analytics
2. Improve intents based on user interactions
3. Add new training phrases as needed
4. Set up logging for help requests

---

## Phone Number Configuration

The phone number displayed in the application (+1-844-HELP-123) is a placeholder. Replace it with your actual Dialogflow phone number once configured.

---

## Cost Considerations

- Dialogflow charges per request
- Phone gateway has additional costs
- Consider setting up billing alerts
- Review pricing at: https://cloud.google.com/dialogflow/pricing

---

## Security Notes

- Enable authentication for webhook endpoints
- Use HTTPS for all connections
- Protect sensitive user data
- Follow HIPAA guidelines if handling health information
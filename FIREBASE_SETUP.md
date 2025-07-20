# Firebase Cloud Messaging (FCM) Setup Guide

## Current Implementation Status

✅ **Completed Features:**
- Firebase project configuration
- FCM SDK integration
- Service worker for background notifications
- PWA manifest for app installation
- Real-time notification system
- Notification permission handling

⚠️ **Requires Manual Setup:**
- VAPID key generation (see below)
- Cloud Function for server-side messaging (optional)

## Step 1: Generate VAPID Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `my-portfolio-fb767`
3. Navigate to **Project Settings** > **Cloud Messaging**
4. Under **Web Configuration**, click **Generate key pair**
5. Copy the generated VAPID key
6. Replace the placeholder in `src/lib/firebase.ts`:

```typescript
const token = await getToken(messaging, {
  vapidKey: 'YOUR_ACTUAL_VAPID_KEY_HERE' // Replace with your key
});
```

## Step 2: Test Real-time Notifications

### Using Firebase Console:
1. Go to **Engage** > **Messaging** in Firebase Console
2. Click **Create your first campaign**
3. Select **Firebase Notification messages**
4. Enter title and message text
5. Under **Target**, select your app
6. Send test message

### Using REST API:
```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "USER_FCM_TOKEN",
    "notification": {
      "title": "New Message",
      "body": "You have received a new contact message"
    },
    "data": {
      "url": "/",
      "type": "message"
    }
  }'
```

## Step 3: PWA Installation

The app is configured as a Progressive Web App (PWA):

### Desktop Installation:
- Chrome: Look for install icon in address bar
- Edge: Click "Install" from three-dot menu
- Safari: Add to Dock from Share menu

### Mobile Installation:
- Android: "Add to Home Screen" prompt
- iOS: Share > "Add to Home Screen"

## Current Notification Features

1. **Real-time FCM Integration**: Receives messages when app is open
2. **Background Notifications**: Shows notifications when app is closed
3. **Permission Management**: Handles notification permissions gracefully
4. **Service Worker**: Caches app for offline use
5. **Install Prompts**: Shows PWA install options

## Supabase Integration Recommendation

For enhanced data management and real-time features, consider integrating Supabase:

### Benefits:
- **Real-time Database**: Automatic UI updates when messages arrive
- **Authentication**: User management and admin access control
- **Edge Functions**: Server-side logic for processing messages
- **Row Level Security**: Secure data access policies
- **Storage**: File attachments and media handling

### Migration Path:
1. Connect Lovable project to Supabase
2. Create `messages` table with real-time subscriptions
3. Add authentication for admin access
4. Implement RLS policies for data security
5. Add Edge Functions for email notifications

## Next Steps

1. **Generate VAPID key** in Firebase Console
2. **Test notifications** using Firebase Console
3. **Consider Supabase integration** for enhanced features
4. **Deploy app** and test PWA installation

## Troubleshooting

### Common Issues:
- **No notifications**: Check VAPID key and browser permissions
- **Install button not showing**: Ensure HTTPS and valid manifest
- **Service worker errors**: Check browser developer tools

### Debug Commands:
```javascript
// Check registration status
navigator.serviceWorker.getRegistrations().then(console.log);

// Check notification permission
console.log(Notification.permission);

// Test notification
new Notification('Test', { body: 'This is a test notification' });
```
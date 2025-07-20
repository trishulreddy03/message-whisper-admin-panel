import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const FCMSetup: React.FC = () => {
  const { permission, requestPermission } = useNotifications();
  const [setupStatus, setSetupStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const handleEnableNotifications = async () => {
    try {
      const token = await requestPermission();
      if (token) {
        setSetupStatus('success');
      } else {
        setSetupStatus('error');
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
      setSetupStatus('error');
    }
  };

  const getStatusDisplay = () => {
    switch (permission) {
      case 'granted':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: 'Notifications Enabled',
          badge: 'success'
        };
      case 'denied':
        return {
          icon: <BellOff className="h-5 w-5 text-red-500" />,
          text: 'Notifications Blocked',
          badge: 'destructive'
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          text: 'Setup Required',
          badge: 'secondary'
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <Card className="animated-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Real-time Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status.icon}
            <span>{status.text}</span>
          </div>
          <Badge variant={status.badge as any}>{permission}</Badge>
        </div>
        
        {permission !== 'granted' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enable notifications to receive real-time alerts for new messages.
            </p>
            <Button 
              onClick={handleEnableNotifications} 
              className="w-full"
              disabled={permission === 'denied'}
            >
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
            
            {permission === 'denied' && (
              <p className="text-xs text-red-500">
                Notifications are blocked. Please enable them in your browser settings.
              </p>
            )}
          </div>
        )}

        {permission === 'granted' && (
          <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            ✅ You'll receive notifications for new messages
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FCMSetup;
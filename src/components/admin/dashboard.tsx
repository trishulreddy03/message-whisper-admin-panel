import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Search, 
  Filter, 
  Calendar, 
  Building, 
  Phone, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Trash2,
  Reply
} from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import NotificationBell from '@/components/ui/notification-bell';
import FCMSetup from '@/components/fcm-setup';

const Dashboard: React.FC = () => {
  const { messages, loading, markAsRead, deleteMessage, stats } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      const matchesSearch = 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const handleMessageClick = async (message: any) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      await markAsRead(message.id);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    setDeleting(messageId);
    try {
      await deleteMessage(messageId);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="spinner mx-auto shadow-neon" />
          <div>
            <h2 className="text-2xl font-orbitron font-bold gradient-text mb-2">Loading Messages</h2>
            <p className="text-muted-foreground">Connecting to Firebase...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-border/50 sticky top-0 z-40 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-orbitron font-bold gradient-text">Message Manager</h1>
                  <p className="text-sm text-muted-foreground">Real-time message dashboard</p>
                </div>
              </motion.div>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationBell />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="glass hover:shadow-glow"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Messages', 
              value: stats.total, 
              icon: MessageSquare, 
              color: 'text-tech-blue',
              gradient: 'from-tech-blue/20 to-tech-blue/5'
            },
            { 
              label: 'Unread', 
              value: stats.unread, 
              icon: Clock, 
              color: 'text-accent',
              gradient: 'from-accent/20 to-accent/5'
            },
            { 
              label: 'Read', 
              value: stats.read, 
              icon: CheckCircle, 
              color: 'text-tech-green',
              gradient: 'from-tech-green/20 to-tech-green/5'
            },
            { 
              label: 'This Week', 
              value: stats.thisWeek, 
              icon: TrendingUp, 
              color: 'text-tech-purple',
              gradient: 'from-tech-purple/20 to-tech-purple/5'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`glass hover-glow bg-gradient-to-br ${stat.gradient} border-border/50`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <motion.p 
                        className="text-3xl font-bold font-orbitron"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 glass border-border/50"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('all')}
                        size="sm"
                        className="glass"
                      >
                        All
                      </Button>
                      <Button
                        variant={statusFilter === 'unread' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('unread')}
                        size="sm"
                        className="glass"
                      >
                        Unread
                      </Button>
                      <Button
                        variant={statusFilter === 'read' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('read')}
                        size="sm"
                        className="glass"
                      >
                        Read
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Messages */}
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="glass border-border/50">
                    <CardContent className="p-12 text-center">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2 font-orbitron">No messages found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your filters' 
                          : 'No contact form submissions yet'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`message-card ${message.status} ${
                        selectedMessage?.id === message.id ? 'ring-2 ring-primary shadow-neon' : ''
                      }`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg font-orbitron">{message.name}</h3>
                              <Badge 
                                variant={message.status === 'unread' ? 'default' : 'secondary'}
                                className={message.status === 'unread' ? 'bg-gradient-accent text-white animate-pulse' : ''}
                              >
                                {message.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {message.email}
                            </p>
                            <p className="font-medium mb-2">{message.subject}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {message.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(message.timestamp)}
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMessage(message.id);
                              }}
                              disabled={deleting === message.id}
                              className="hover:bg-destructive hover:text-destructive-foreground"
                            >
                              {deleting === message.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Message Details Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* FCM Setup Component */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FCMSetup />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="font-orbitron">Message Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMessage ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-semibold text-lg mb-2 font-orbitron">{selectedMessage.name}</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={`mailto:${selectedMessage.email}`}
                              className="text-primary hover:underline"
                            >
                              {selectedMessage.email}
                            </a>
                          </div>
                          
                          {selectedMessage.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedMessage.phone}</span>
                            </div>
                          )}
                          
                          {selectedMessage.company && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedMessage.company}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(selectedMessage.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Subject</h4>
                        <p className="text-sm glass p-3 rounded-lg">
                          {selectedMessage.subject}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Message</h4>
                        <div className="text-sm glass p-4 rounded-lg whitespace-pre-wrap">
                          {selectedMessage.message}
                        </div>
                      </div>

                      <motion.div 
                        className="flex gap-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Button 
                          className="flex-1 bg-gradient-primary hover:shadow-glow"
                          onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                        >
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-center py-12"
                    >
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select a message to view details
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
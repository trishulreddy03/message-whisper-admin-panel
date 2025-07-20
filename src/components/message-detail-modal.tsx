import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  User, 
  Reply, 
  Trash2, 
  X 
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
  timestamp: any;
  status: 'read' | 'unread';
}

interface MessageDetailModalProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (messageId: string) => void;
  deleting: boolean;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  message,
  isOpen,
  onClose,
  onDelete,
  deleting
}) => {
  if (!message) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'PPpp');
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Unknown time';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleReply = () => {
    const subject = `Re: ${message.subject}`;
    const body = `Hi ${message.name},\n\nThank you for your message. I'll get back to you soon!\n\nBest regards`;
    const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border/50">
            <DialogHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center"
                  >
                    <User className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <DialogTitle className="text-2xl font-orbitron gradient-text">
                      {message.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Received {getTimeAgo(message.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={message.status === 'unread' ? 'default' : 'secondary'}
                    className={message.status === 'unread' ? 'bg-gradient-accent text-white' : ''}
                  >
                    {message.status}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg font-orbitron">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 glass rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a 
                          href={`mailto:${message.email}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {message.email}
                        </a>
                      </div>
                    </div>
                    
                    {message.phone && (
                      <div className="flex items-center gap-3 p-3 glass rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{message.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {message.company && (
                      <div className="flex items-center gap-3 p-3 glass rounded-lg">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Company</p>
                          <p className="font-medium">{message.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg font-orbitron">Message Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 glass rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Received</p>
                        <p className="font-medium">{formatDate(message.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Subject */}
              <div>
                <h3 className="font-semibold text-lg mb-3 font-orbitron">Subject</h3>
                <div className="glass p-4 rounded-lg">
                  <p className="text-lg">{message.subject}</p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h3 className="font-semibold text-lg mb-3 font-orbitron">Message</h3>
                <div className="glass p-6 rounded-lg">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button 
                    onClick={handleReply}
                    className="w-full bg-gradient-primary hover:shadow-glow"
                    size="lg"
                  >
                    <Reply className="h-5 w-5 mr-2" />
                    Reply via Email
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="destructive"
                    onClick={() => onDelete(message.id)}
                    disabled={deleting}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {deleting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-5 w-5 mr-2" />
                    )}
                    Delete Message
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default MessageDetailModal;
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllSupportRequests, updateSupportRequest, SupportRequest } from '@/lib/supportService';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Eye, Mail, User } from 'lucide-react';
import NameChangeAdminPanel from './NameChangeAdminPanel';

const SupportAdminPanel: React.FC = () => {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const statusColors = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const loadSupportRequests = async () => {
    try {
      setLoading(true);
      const result = await getAllSupportRequests();
      if (result.success) {
        setSupportRequests(result.data || []);
      }
    } catch (error) {
      console.error('Error loading support requests:', error);
      toast({
        title: "Error",
        description: "Failed to load support requests. You may need admin permissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupportRequests();
  }, []);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      setUpdating(true);
      const updates: Partial<SupportRequest> = {
        status: newStatus as any
      };

      if (newStatus === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const result = await updateSupportRequest(requestId, updates);
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Support request status updated to ${newStatus}`,
        });
        loadSupportRequests(); // Reload the list
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Error",
        description: "Failed to update support request status",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAdminNotesUpdate = async () => {
    if (!selectedRequest) return;

    try {
      setUpdating(true);
      const result = await updateSupportRequest(selectedRequest.id!, {
        admin_notes: adminNotes
      });
      
      if (result.success) {
        toast({
          title: "Notes Updated",
          description: "Admin notes have been saved",
        });
        setAdminNotes('');
        setIsDetailOpen(false);
        loadSupportRequests(); // Reload the list
      }
    } catch (error) {
      console.error('Error updating admin notes:', error);
      toast({
        title: "Update Error",
        description: "Failed to update admin notes",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const openDetailDialog = (request: SupportRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading support requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration Panel</h1>
        <p className="text-gray-600">Review and manage support requests and name change requests</p>
      </div>

      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="support" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Support Requests</span>
          </TabsTrigger>
          <TabsTrigger value="name-changes" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Name Changes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Support Requests</h2>
              <p className="text-gray-600">Manage and respond to user support requests</p>
            </div>
            <Button onClick={loadSupportRequests} variant="outline">
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {supportRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No support requests found</p>
                </CardContent>
              </Card>
            ) : (
              supportRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{request.subject}</h3>
                          <Badge className={statusColors[request.status || 'open']}>
                            {request.status}
                          </Badge>
                          <Badge className={priorityColors[request.priority || 'medium']}>
                            {request.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <strong>From:</strong> {request.name} ({request.email})
                          </div>
                          <div>
                            <strong>Category:</strong> {request.category}
                          </div>
                          <div>
                            <strong>Created:</strong> {formatDate(request.created_at || '')}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 line-clamp-2">{request.message}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetailDialog(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        <Select
                          value={request.status}
                          onValueChange={(value) => handleStatusUpdate(request.id!, value)}
                          disabled={updating}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="name-changes" className="mt-6">
          <NameChangeAdminPanel />
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription>
              View and manage this support request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Request Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Subject:</strong> {selectedRequest.subject}</div>
                    <div><strong>Category:</strong> {selectedRequest.category}</div>
                    <div><strong>Status:</strong> {selectedRequest.status}</div>
                    <div><strong>Priority:</strong> {selectedRequest.priority}</div>
                    <div><strong>Created:</strong> {formatDate(selectedRequest.created_at || '')}</div>
                    {selectedRequest.resolved_at && (
                      <div><strong>Resolved:</strong> {formatDate(selectedRequest.resolved_at)}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedRequest.name}</div>
                    <div><strong>Email:</strong> {selectedRequest.email}</div>
                    {selectedRequest.user_id && (
                      <div><strong>User ID:</strong> {selectedRequest.user_id}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this request..."
                  rows={4}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdminNotesUpdate}
                    disabled={updating}
                  >
                    {updating ? 'Saving...' : 'Save Notes'}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedRequest.email}?subject=Re: ${selectedRequest.subject}`, '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedRequest.id!, 'resolved')}
                    disabled={updating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedRequest.id!, 'closed')}
                    disabled={updating}
                  >
                    Close Request
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportAdminPanel; 
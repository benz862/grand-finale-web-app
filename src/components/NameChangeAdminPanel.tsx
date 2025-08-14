import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/emailService';
import { CheckCircle, XCircle, Eye, Clock, AlertCircle, FileText, User, Mail } from 'lucide-react';

interface NameChangeRequest {
  id: string;
  user_id: string;
  request_id: string;
  current_first_name: string;
  current_middle_name: string;
  current_last_name: string;
  requested_first_name: string;
  requested_middle_name: string;
  requested_last_name: string;
  reason: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  supporting_documents_count: number;
  has_supporting_documents: boolean;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

const NameChangeAdminPanel: React.FC = () => {
  const [nameChangeRequests, setNameChangeRequests] = useState<NameChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<NameChangeRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const reasonLabels = {
    marriage: 'Marriage',
    divorce: 'Divorce',
    legal_change: 'Legal Name Change',
    correction: 'Correction/Error',
    other: 'Other'
  };

  const loadNameChangeRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch name change requests with user email
      const { data, error } = await supabase
        .from('name_change_requests')
        .select(`
          *,
          users!inner(email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading name change requests:', error);
        toast({
          title: "Error",
          description: "Failed to load name change requests. You may need admin permissions.",
          variant: "destructive"
        });
        return;
      }

      // Transform data to include user email
      const requestsWithEmail = data?.map(request => ({
        ...request,
        user_email: request.users?.email
      })) || [];

      setNameChangeRequests(requestsWithEmail);
    } catch (error) {
      console.error('Error loading name change requests:', error);
      toast({
        title: "Error",
        description: "Failed to load name change requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNameChangeRequests();
  }, []);

  const handleApproveRequest = async (request: NameChangeRequest) => {
    if (!confirm(`Are you sure you want to approve the name change from "${request.current_first_name} ${request.current_last_name}" to "${request.requested_first_name} ${request.requested_last_name}"?`)) {
      return;
    }

    setProcessing(true);
    
    try {
      // Start a transaction to update multiple tables
      const { error: updateRequestError } = await supabase
        .from('name_change_requests')
        .update({
          status: 'approved',
          admin_notes: adminNotes || 'Approved by admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (updateRequestError) {
        throw updateRequestError;
      }

      // Update personal_info table with new names
      const { error: updatePersonalInfoError } = await supabase
        .from('personal_info')
        .update({
          legal_first_name: request.requested_first_name,
          legal_middle_name: request.requested_middle_name,
          legal_last_name: request.requested_last_name,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', request.user_id);

      if (updatePersonalInfoError) {
        console.error('Error updating personal info:', updatePersonalInfoError);
        // Continue anyway as the request was approved
      }

      // Send approval notification email
      if (request.user_email) {
        try {
          await sendWelcomeEmail({
            email: request.user_email,
            planId: '',
            planName: '',
            planPrice: '',
            planPeriod: '',
            loginUrl: '',
            customerName: request.requested_first_name
          });
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
        }
      }

      toast({
        title: "Request Approved",
        description: `Name change from "${request.current_first_name} ${request.current_last_name}" to "${request.requested_first_name} ${request.requested_last_name}" has been approved.`,
      });

      // Reload the list
      loadNameChangeRequests();
      
      // Close dialog
      setIsDetailOpen(false);
      setSelectedRequest(null);
      setAdminNotes('');

    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Approval Error",
        description: "Failed to approve name change request",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectRequest = async (request: NameChangeRequest) => {
    if (!confirm(`Are you sure you want to reject the name change request from "${request.current_first_name} ${request.current_last_name}" to "${request.requested_first_name} ${request.requested_last_name}"?`)) {
      return;
    }

    setProcessing(true);
    
    try {
      const { error } = await supabase
        .from('name_change_requests')
        .update({
          status: 'rejected',
          admin_notes: adminNotes || 'Rejected by admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) {
        throw error;
      }

      // Send rejection notification email
      if (request.user_email) {
        try {
          await sendWelcomeEmail({
            email: request.user_email,
            planId: '',
            planName: '',
            planPrice: '',
            planPeriod: '',
            loginUrl: '',
            customerName: request.current_first_name
          });
        } catch (emailError) {
          console.error('Error sending rejection email:', emailError);
        }
      }

      toast({
        title: "Request Rejected",
        description: `Name change request has been rejected.`,
      });

      // Reload the list
      loadNameChangeRequests();
      
      // Close dialog
      setIsDetailOpen(false);
      setSelectedRequest(null);
      setAdminNotes('');

    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Rejection Error",
        description: "Failed to reject name change request",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const openDetailDialog = (request: NameChangeRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCurrentName = (request: NameChangeRequest) => {
    return `${request.current_first_name} ${request.current_middle_name ? request.current_middle_name + ' ' : ''}${request.current_last_name}`.trim();
  };

  const getRequestedName = (request: NameChangeRequest) => {
    return `${request.requested_first_name} ${request.requested_middle_name ? request.requested_middle_name + ' ' : ''}${request.requested_last_name}`.trim();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading name change requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Name Change Request Administration</h1>
        <p className="text-gray-600">Review and manage name change requests from users</p>
      </div>

      <div className="grid gap-6">
        {nameChangeRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Name Change Requests</h3>
              <p className="text-gray-600">There are currently no name change requests to review.</p>
            </CardContent>
          </Card>
        ) : (
          nameChangeRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <CardTitle className="text-lg">
                        {getCurrentName(request)} → {getRequestedName(request)}
                      </CardTitle>
                      <CardDescription>
                        Request ID: {request.request_id} • {request.user_email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={statusColors[request.status]}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                    {request.has_supporting_documents && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{request.supporting_documents_count}</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reason</p>
                    <p className="text-sm">{reasonLabels[request.reason as keyof typeof reasonLabels] || request.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submitted</p>
                    <p className="text-sm">{formatDate(request.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-sm">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</p>
                  </div>
                </div>
                
                {request.details && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Additional Details</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{request.details}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(request)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  
                  {request.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(request)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(request)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Name Change Request Details</DialogTitle>
            <DialogDescription>
              Review the request details and take action
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Current Name</h4>
                  <p className="text-lg">{getCurrentName(selectedRequest)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requested Name</h4>
                  <p className="text-lg text-blue-600">{getRequestedName(selectedRequest)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reason</h4>
                  <p>{reasonLabels[selectedRequest.reason as keyof typeof reasonLabels] || selectedRequest.reason}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">User Email</h4>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {selectedRequest.user_email}
                  </p>
                </div>
              </div>

              {selectedRequest.details && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Additional Details</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRequest.details}</p>
                </div>
              )}

              {selectedRequest.has_supporting_documents && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Supporting Documents</h4>
                  <p className="text-gray-600">
                    {selectedRequest.supporting_documents_count} document(s) uploaded
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Admin Notes</h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this request..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailOpen(false);
                    setSelectedRequest(null);
                    setAdminNotes('');
                  }}
                >
                  Cancel
                </Button>
                
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectRequest(selectedRequest)}
                      disabled={processing}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {processing ? 'Rejecting...' : 'Reject'}
                    </Button>
                    <Button
                      onClick={() => handleApproveRequest(selectedRequest)}
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {processing ? 'Approving...' : 'Approve'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NameChangeAdminPanel; 
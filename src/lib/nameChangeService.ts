import { supabase } from './supabase';
import { sendWelcomeEmail } from './emailService';

export interface NameChangeRequest {
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

export interface NameChangeApprovalResult {
  success: boolean;
  error?: string;
  requestId?: string;
  userId?: string;
}

export const getNameChangeRequests = async (): Promise<{ success: boolean; data?: NameChangeRequest[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('name_change_requests')
      .select(`
        *,
        users!inner(email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching name change requests:', error);
      return { success: false, error: error.message };
    }

    // Transform data to include user email
    const requestsWithEmail = data?.map(request => ({
      ...request,
      user_email: request.users?.email
    })) || [];

    return { success: true, data: requestsWithEmail };
  } catch (error) {
    console.error('Error in getNameChangeRequests:', error);
    return { success: false, error: 'Failed to fetch name change requests' };
  }
};

export const approveNameChangeRequest = async (
  requestId: string, 
  adminNotes?: string
): Promise<NameChangeApprovalResult> => {
  try {
    // First, get the request details
    const { data: request, error: fetchError } = await supabase
      .from('name_change_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      console.error('Error fetching request:', fetchError);
      return { success: false, error: 'Request not found' };
    }

    // Update the request status to approved
    const { error: updateRequestError } = await supabase
      .from('name_change_requests')
      .update({
        status: 'approved',
        admin_notes: adminNotes || 'Approved by admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateRequestError) {
      console.error('Error updating request status:', updateRequestError);
      return { success: false, error: 'Failed to update request status' };
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
      // Log the error but don't fail the approval since the request was already approved
    }

    // Get user email for notification
    const { data: userData } = await supabase
      .from('users')
      .select('email')
      .eq('id', request.user_id)
      .single();

    // Send approval notification email
    if (userData?.email) {
      try {
        await sendWelcomeEmail({
          email: userData.email,
          planId: '',
          planName: '',
          planPrice: '',
          planPeriod: '',
          loginUrl: '',
          customerName: request.requested_first_name
        });
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't fail the approval if email fails
      }
    }

    return { 
      success: true, 
      requestId: request.request_id,
      userId: request.user_id
    };

  } catch (error) {
    console.error('Error in approveNameChangeRequest:', error);
    return { success: false, error: 'Failed to approve name change request' };
  }
};

export const rejectNameChangeRequest = async (
  requestId: string, 
  adminNotes?: string
): Promise<NameChangeApprovalResult> => {
  try {
    // Get the request details
    const { data: request, error: fetchError } = await supabase
      .from('name_change_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      console.error('Error fetching request:', fetchError);
      return { success: false, error: 'Request not found' };
    }

    // Update the request status to rejected
    const { error: updateError } = await supabase
      .from('name_change_requests')
      .update({
        status: 'rejected',
        admin_notes: adminNotes || 'Rejected by admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating request status:', updateError);
      return { success: false, error: 'Failed to update request status' };
    }

    // Get user email for notification
    const { data: userData } = await supabase
      .from('users')
      .select('email')
      .eq('id', request.user_id)
      .single();

    // Send rejection notification email
    if (userData?.email) {
      try {
        await sendWelcomeEmail({
          email: userData.email,
          planId: '',
          planName: '',
          planPrice: '',
          planPeriod: '',
          loginUrl: '',
          customerName: request.current_first_name
        });
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
        // Don't fail the rejection if email fails
      }
    }

    return { 
      success: true, 
      requestId: request.request_id,
      userId: request.user_id
    };

  } catch (error) {
    console.error('Error in rejectNameChangeRequest:', error);
    return { success: false, error: 'Failed to reject name change request' };
  }
};

export const updateNameChangeRequestNotes = async (
  requestId: string, 
  adminNotes: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('name_change_requests')
      .update({
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      console.error('Error updating request notes:', error);
      return { success: false, error: 'Failed to update request notes' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateNameChangeRequestNotes:', error);
    return { success: false, error: 'Failed to update request notes' };
  }
};

export const getNameChangeRequestById = async (
  requestId: string
): Promise<{ success: boolean; data?: NameChangeRequest; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('name_change_requests')
      .select(`
        *,
        users!inner(email)
      `)
      .eq('id', requestId)
      .single();

    if (error) {
      console.error('Error fetching name change request:', error);
      return { success: false, error: error.message };
    }

    const requestWithEmail = {
      ...data,
      user_email: data.users?.email
    };

    return { success: true, data: requestWithEmail };
  } catch (error) {
    console.error('Error in getNameChangeRequestById:', error);
    return { success: false, error: 'Failed to fetch name change request' };
  }
};

export const getPendingNameChangeRequests = async (): Promise<{ success: boolean; data?: NameChangeRequest[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('name_change_requests')
      .select(`
        *,
        users!inner(email)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending name change requests:', error);
      return { success: false, error: error.message };
    }

    const requestsWithEmail = data?.map(request => ({
      ...request,
      user_email: request.users?.email
    })) || [];

    return { success: true, data: requestsWithEmail };
  } catch (error) {
    console.error('Error in getPendingNameChangeRequests:', error);
    return { success: false, error: 'Failed to fetch pending name change requests' };
  }
};

export const getPendingNameChangeRequestsCount = async (): Promise<{ success: boolean; count?: number; error?: string }> => {
  try {
    const { count, error } = await supabase
      .from('name_change_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending requests count:', error);
      return { success: false, error: error.message };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Error in getPendingNameChangeRequestsCount:', error);
    return { success: false, error: 'Failed to fetch pending requests count' };
  }
}; 
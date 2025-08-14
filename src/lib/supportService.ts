import { supabase } from './supabase';

export interface SupportRequest {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  admin_notes?: string;
  resolved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const submitSupportRequest = async (supportData: Omit<SupportRequest, 'id' | 'status' | 'priority' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('Submitting support request:', supportData);

    // Get current authenticated user (but don't require it)
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.warn('Auth error (continuing as unauthenticated):', authError);
    }

    // Prepare the data for insertion
    const requestData = {
      user_id: authUser?.id || null, // Allow null for unauthenticated users
      name: supportData.name,
      email: supportData.email,
      subject: supportData.subject,
      category: supportData.category,
      message: supportData.message,
      status: 'open' as const,
      priority: 'medium' as const
    };

    console.log('Inserting support request with data:', requestData);

    // Insert the support request
    const { data, error } = await supabase
      .from('support_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      // Provide more specific error information
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check RLS policies.');
      } else if (error.code === '23505') {
        throw new Error('Duplicate request detected.');
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    }

    console.log('Support request submitted successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error submitting support request:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

export const getUserSupportRequests = async () => {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch support requests: ${error.message}`);
    }

    return { success: true, data };

  } catch (error) {
    console.error('Error fetching support requests:', error);
    throw error;
  }
};

export const updateSupportRequest = async (requestId: string, updates: Partial<SupportRequest>) => {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('support_requests')
      .update(updates)
      .eq('id', requestId)
      .eq('user_id', authUser.id) // Ensure user can only update their own requests
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to update support request: ${error.message}`);
    }

    return { success: true, data };

  } catch (error) {
    console.error('Error updating support request:', error);
    throw error;
  }
};

// Admin function to get all support requests (you'll need to implement admin role checking)
export const getAllSupportRequests = async () => {
  try {
    // TODO: Add admin role verification here
    // For now, this will only work if RLS is disabled or admin policies are set up
    
    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch all support requests: ${error.message}`);
    }

    return { success: true, data };

  } catch (error) {
    console.error('Error fetching all support requests:', error);
    throw error;
  }
}; 
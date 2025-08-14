// Feedback Service for managing improvement suggestions and rewards
import { supabase } from '@/lib/supabase';

export interface FeedbackSubmission {
  id: string;
  feedbackId: string;
  category: string;
  title: string;
  description: string;
  implementationSuggestion?: string;
  priorityLevel: string;
  status: 'submitted' | 'under_review' | 'planned' | 'in_development' | 'implemented' | 'rejected';
  rewardEligible: boolean;
  rewardGranted: boolean;
  rewardType?: string;
  submittedAt: string;
  contactEmail?: string;
  contactName?: string;
}

export interface FeedbackStats {
  totalSubmissions: number;
  implementedSuggestions: number;
  rewardsGranted: number;
  pendingReview: number;
}

export class FeedbackService {
  
  // Submit new feedback
  static async submitFeedback(
    userId: string,
    feedbackData: {
      category: string;
      title: string;
      description: string;
      implementationSuggestion?: string;
      priorityLevel: string;
      contactEmail?: string;
      contactName?: string;
      consentForContact: boolean;
      consentForImplementation: boolean;
    }
  ): Promise<{ success: boolean; feedbackId?: string; error?: string }> {
    try {
      const feedbackId = `FB-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('feedback_submissions')
        .insert({
          user_id: userId,
          feedback_id: feedbackId,
          category: feedbackData.category,
          title: feedbackData.title,
          description: feedbackData.description,
          implementation_suggestion: feedbackData.implementationSuggestion || null,
          priority_level: feedbackData.priorityLevel,
          consent_for_contact: feedbackData.consentForContact,
          consent_for_implementation: feedbackData.consentForImplementation,
          contact_email: feedbackData.contactEmail || null,
          contact_name: feedbackData.contactName || null,
          reward_eligible: feedbackData.consentForImplementation,
          status: 'submitted'
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting feedback:', error);
        return { success: false, error: 'Failed to submit feedback' };
      }

      return { success: true, feedbackId };

    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: 'Unexpected error occurred' };
    }
  }

  // Get user's feedback submissions
  static async getUserFeedback(userId: string): Promise<FeedbackSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user feedback:', error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        feedbackId: item.feedback_id,
        category: item.category,
        title: item.title,
        description: item.description,
        implementationSuggestion: item.implementation_suggestion,
        priorityLevel: item.priority_level,
        status: item.status,
        rewardEligible: item.reward_eligible,
        rewardGranted: item.reward_granted,
        rewardType: item.reward_type,
        submittedAt: item.created_at,
        contactEmail: item.contact_email,
        contactName: item.contact_name
      }));

    } catch (error) {
      console.error('Error fetching user feedback:', error);
      return [];
    }
  }

  // Get feedback statistics for user
  static async getUserFeedbackStats(userId: string): Promise<FeedbackStats> {
    try {
      const feedback = await this.getUserFeedback(userId);
      
      return {
        totalSubmissions: feedback.length,
        implementedSuggestions: feedback.filter(f => f.status === 'implemented').length,
        rewardsGranted: feedback.filter(f => f.rewardGranted).length,
        pendingReview: feedback.filter(f => f.status === 'submitted' || f.status === 'under_review').length
      };

    } catch (error) {
      console.error('Error calculating feedback stats:', error);
      return {
        totalSubmissions: 0,
        implementedSuggestions: 0,
        rewardsGranted: 0,
        pendingReview: 0
      };
    }
  }

  // Check if user has pending rewards
  static async checkPendingRewards(userId: string): Promise<{
    hasRewards: boolean;
    rewardCount: number;
    totalMonthsFree: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select('reward_type, reward_granted')
        .eq('user_id', userId)
        .eq('status', 'implemented')
        .eq('reward_eligible', true);

      if (error) {
        console.error('Error checking rewards:', error);
        return { hasRewards: false, rewardCount: 0, totalMonthsFree: 0 };
      }

      const implementedSuggestions = data.length;
      const grantedRewards = data.filter(item => item.reward_granted).length;
      const pendingRewards = implementedSuggestions - grantedRewards;

      return {
        hasRewards: pendingRewards > 0,
        rewardCount: pendingRewards,
        totalMonthsFree: pendingRewards * 2 // 2 months per implemented suggestion
      };

    } catch (error) {
      console.error('Error checking rewards:', error);
      return { hasRewards: false, rewardCount: 0, totalMonthsFree: 0 };
    }
  }

  // Admin functions (for admin dashboard)
  static async getAllFeedback(
    status?: string,
    category?: string,
    limit = 50
  ): Promise<FeedbackSubmission[]> {
    try {
      let query = supabase
        .from('feedback_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching all feedback:', error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        feedbackId: item.feedback_id,
        category: item.category,
        title: item.title,
        description: item.description,
        implementationSuggestion: item.implementation_suggestion,
        priorityLevel: item.priority_level,
        status: item.status,
        rewardEligible: item.reward_eligible,
        rewardGranted: item.reward_granted,
        rewardType: item.reward_type,
        submittedAt: item.created_at,
        contactEmail: item.contact_email,
        contactName: item.contact_name
      }));

    } catch (error) {
      console.error('Error fetching all feedback:', error);
      return [];
    }
  }

  // Update feedback status (admin function)
  static async updateFeedbackStatus(
    feedbackId: string,
    status: FeedbackSubmission['status'],
    adminNotes?: string,
    implementationNotes?: string
  ): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        reviewed_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      if (implementationNotes) {
        updateData.implementation_notes = implementationNotes;
      }

      if (status === 'implemented') {
        updateData.implemented_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('feedback_submissions')
        .update(updateData)
        .eq('feedback_id', feedbackId);

      if (error) {
        console.error('Error updating feedback status:', error);
        return false;
      }

      return true;

    } catch (error) {
      console.error('Error updating feedback status:', error);
      return false;
    }
  }

  // Grant reward (admin function)
  static async grantReward(
    feedbackId: string,
    rewardType = '2_months_free'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({
          reward_granted: true,
          reward_type: rewardType,
          reward_granted_at: new Date().toISOString()
        })
        .eq('feedback_id', feedbackId)
        .eq('reward_eligible', true);

      if (error) {
        console.error('Error granting reward:', error);
        return false;
      }

      return true;

    } catch (error) {
      console.error('Error granting reward:', error);
      return false;
    }
  }

  // Get feedback metrics (admin function)
  static async getFeedbackMetrics(): Promise<{
    totalSubmissions: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    recentSubmissions: number; // Last 30 days
  }> {
    try {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select('category, status, created_at');

      if (error) {
        console.error('Error fetching feedback metrics:', error);
        return {
          totalSubmissions: 0,
          byCategory: {},
          byStatus: {},
          recentSubmissions: 0
        };
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const byCategory: Record<string, number> = {};
      const byStatus: Record<string, number> = {};
      let recentSubmissions = 0;

      data.forEach(item => {
        // Count by category
        byCategory[item.category] = (byCategory[item.category] || 0) + 1;
        
        // Count by status
        byStatus[item.status] = (byStatus[item.status] || 0) + 1;
        
        // Count recent submissions
        if (new Date(item.created_at) > thirtyDaysAgo) {
          recentSubmissions++;
        }
      });

      return {
        totalSubmissions: data.length,
        byCategory,
        byStatus,
        recentSubmissions
      };

    } catch (error) {
      console.error('Error fetching feedback metrics:', error);
      return {
        totalSubmissions: 0,
        byCategory: {},
        byStatus: {},
        recentSubmissions: 0
      };
    }
  }
}

// Export convenience functions
export const submitFeedback = FeedbackService.submitFeedback;
export const getUserFeedback = FeedbackService.getUserFeedback;
export const getUserFeedbackStats = FeedbackService.getUserFeedbackStats;
export const checkPendingRewards = FeedbackService.checkPendingRewards;

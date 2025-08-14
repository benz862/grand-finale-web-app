import { supabase } from '@/lib/supabase';

export interface PdfExportLimit {
  limit: number;
  hasWatermark: boolean;
  used: number;
  remaining: number;
  purchasedTokens: number;
  totalAvailable: number;
}

export interface PdfExportRecord {
  id: string;
  user_id: string;
  export_date: string;
  has_watermark: boolean;
  month_year: string;
  created_at: string;
}

export class PdfExportService {
  
  // Get current month-year string (YYYY-MM format)
  private static getCurrentMonthYear(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Get user's PDF export limit based on their plan
  static getExportLimit(userTier: string): { limit: number; hasWatermark: boolean } {
    switch (userTier) {
      case 'Lite':
        return { limit: 1, hasWatermark: true };
      case 'Standard':
        return { limit: 3, hasWatermark: false };
      case 'Premium':
      case 'Lifetime':
        return { limit: -1, hasWatermark: false }; // Unlimited
      default:
        return { limit: 1, hasWatermark: true };
    }
  }

  // Check if user can export PDF
  static async canExportPdf(userId: string, userTier: string): Promise<{
    canExport: boolean;
    limit: PdfExportLimit;
    error?: string;
  }> {
    try {
      const { limit, hasWatermark } = this.getExportLimit(userTier);
      
      // Unlimited exports for Premium/Lifetime
      if (limit === -1) {
        return {
          canExport: true,
          limit: { limit: -1, hasWatermark, used: 0, remaining: 0, purchasedTokens: 0, totalAvailable: -1 }
        };
      }

      const currentMonth = this.getCurrentMonthYear();
      
      // Get current month's export count
      const { data: monthlyExports, error: monthlyError } = await supabase
        .from('pdf_exports')
        .select('id')
        .eq('user_id', userId)
        .eq('month_year', currentMonth);

      if (monthlyError) {
        console.error('Error checking PDF exports:', monthlyError);
        return {
          canExport: false,
          limit: { limit, hasWatermark, used: 0, remaining: limit, purchasedTokens: 0, totalAvailable: limit },
          error: 'Failed to check export limits'
        };
      }

      // Get purchased tokens
      const { data: tokenPurchases, error: tokenError } = await supabase
        .from('token_purchases')
        .select('tokens_remaining')
        .eq('user_id', userId)
        .eq('is_active', true)
        .gte('tokens_remaining', 1)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

      if (tokenError) {
        console.error('Error checking token purchases:', tokenError);
      }

      const monthlyUsed = monthlyExports?.length || 0;
      const monthlyRemaining = Math.max(0, limit - monthlyUsed);
      const purchasedTokens = tokenPurchases?.reduce((sum, purchase) => sum + purchase.tokens_remaining, 0) || 0;
      const totalAvailable = monthlyRemaining + purchasedTokens;

      return {
        canExport: totalAvailable > 0,
        limit: { 
          limit, 
          hasWatermark, 
          used: monthlyUsed, 
          remaining: monthlyRemaining, 
          purchasedTokens, 
          totalAvailable 
        }
      };

    } catch (error) {
      console.error('Error in canExportPdf:', error);
      return {
        canExport: false,
        limit: { limit: 1, hasWatermark: true, used: 0, remaining: 1, purchasedTokens: 0, totalAvailable: 1 },
        error: 'Failed to check export limits'
      };
    }
  }

  // Record a PDF export (with token consumption)
  static async recordExport(userId: string, userTier: string): Promise<{
    success: boolean;
    error?: string;
    exportRecord?: PdfExportRecord;
  }> {
    try {
      // First check if user can export
      const canExport = await this.canExportPdf(userId, userTier);
      
      if (!canExport.canExport) {
        const { limit, purchasedTokens } = canExport.limit;
        if (purchasedTokens > 0) {
          return {
            success: false,
            error: `All monthly exports used (${limit}/${limit}). You have ${purchasedTokens} purchased tokens available.`
          };
        } else {
          return {
            success: false,
            error: `Monthly PDF export limit reached. You have used ${limit}/${limit} exports this month.`
          };
        }
      }

      const { limit, hasWatermark, remaining, purchasedTokens } = canExport.limit;
      const currentMonth = this.getCurrentMonthYear();

      // If monthly tokens available, use those first
      if (remaining > 0) {
        const { data, error } = await supabase
          .from('pdf_exports')
          .insert({
            user_id: userId,
            has_watermark: hasWatermark,
            month_year: currentMonth
          })
          .select()
          .single();

        if (error) {
          console.error('Error recording PDF export:', error);
          return {
            success: false,
            error: 'Failed to record PDF export'
          };
        }

        return {
          success: true,
          exportRecord: data
        };
      }

      // If no monthly tokens, consume a purchased token
      if (purchasedTokens > 0) {
        // Find the oldest active token purchase
        const { data: tokenPurchase, error: tokenError } = await supabase
          .from('token_purchases')
          .select('id, tokens_remaining')
          .eq('user_id', userId)
          .eq('is_active', true)
          .gte('tokens_remaining', 1)
          .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
          .order('purchase_date', { ascending: true })
          .limit(1)
          .single();

        if (tokenError || !tokenPurchase) {
          console.error('Error finding token purchase:', tokenError);
          return {
            success: false,
            error: 'Failed to find available token purchase'
          };
        }

        // Consume one token
        const { error: updateError } = await supabase
          .from('token_purchases')
          .update({ tokens_remaining: tokenPurchase.tokens_remaining - 1 })
          .eq('id', tokenPurchase.id);

        if (updateError) {
          console.error('Error consuming token:', updateError);
          return {
            success: false,
            error: 'Failed to consume token'
          };
        }

        // Record the export (purchased tokens are always clean)
        const { data, error } = await supabase
          .from('pdf_exports')
          .insert({
            user_id: userId,
            has_watermark: false, // Purchased tokens are always clean
            month_year: currentMonth
          })
          .select()
          .single();

        if (error) {
          console.error('Error recording PDF export:', error);
          return {
            success: false,
            error: 'Failed to record PDF export'
          };
        }

        return {
          success: true,
          exportRecord: data
        };
      }

      return {
        success: false,
        error: 'No tokens available for export'
      };

    } catch (error) {
      console.error('Error in recordExport:', error);
      return {
        success: false,
        error: 'Failed to record PDF export'
      };
    }
  }

  // Get user's export history
  static async getExportHistory(userId: string, limit = 50): Promise<{
    success: boolean;
    exports?: PdfExportRecord[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('pdf_exports')
        .select('*')
        .eq('user_id', userId)
        .order('export_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching export history:', error);
        return {
          success: false,
          error: 'Failed to fetch export history'
        };
      }

      return {
        success: true,
        exports: data || []
      };

    } catch (error) {
      console.error('Error in getExportHistory:', error);
      return {
        success: false,
        error: 'Failed to fetch export history'
      };
    }
  }

  // Get current month's export count
  static async getCurrentMonthExports(userId: string): Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }> {
    try {
      const currentMonth = this.getCurrentMonthYear();
      
      const { count, error } = await supabase
        .from('pdf_exports')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('month_year', currentMonth);

      if (error) {
        console.error('Error fetching current month exports:', error);
        return {
          success: false,
          error: 'Failed to fetch current month exports'
        };
      }

      return {
        success: true,
        count: count || 0
      };

    } catch (error) {
      console.error('Error in getCurrentMonthExports:', error);
      return {
        success: false,
        error: 'Failed to fetch current month exports'
      };
    }
  }

  // Admin function: Get all exports (for admin dashboard)
  static async getAllExports(limit = 100): Promise<{
    success: boolean;
    exports?: PdfExportRecord[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('pdf_exports')
        .select('*')
        .order('export_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching all exports:', error);
        return {
          success: false,
          error: 'Failed to fetch exports'
        };
      }

      return {
        success: true,
        exports: data || []
      };

    } catch (error) {
      console.error('Error in getAllExports:', error);
      return {
        success: false,
        error: 'Failed to fetch exports'
      };
    }
  }

  // Token purchasing methods
  static async purchaseTokens(
    userId: string, 
    tokenCount: number, 
    amount: number,
    stripePaymentIntentId?: string
  ): Promise<{
    success: boolean;
    error?: string;
    purchaseId?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('token_purchases')
        .insert({
          user_id: userId,
          tokens_purchased: tokenCount,
          tokens_remaining: tokenCount,
          purchase_amount: amount,
          stripe_payment_intent_id: stripePaymentIntentId,
          expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) // 6 months
        })
        .select()
        .single();

      if (error) {
        console.error('Error purchasing tokens:', error);
        return {
          success: false,
          error: 'Failed to purchase tokens'
        };
      }

      return {
        success: true,
        purchaseId: data.id
      };

    } catch (error) {
      console.error('Error in purchaseTokens:', error);
      return {
        success: false,
        error: 'Failed to purchase tokens'
      };
    }
  }

  // Get user's token purchase history
  static async getTokenPurchaseHistory(userId: string): Promise<{
    success: boolean;
    purchases?: any[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('token_purchases')
        .select('*')
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });

      if (error) {
        console.error('Error fetching token purchases:', error);
        return {
          success: false,
          error: 'Failed to fetch token purchases'
        };
      }

      return {
        success: true,
        purchases: data || []
      };

    } catch (error) {
      console.error('Error in getTokenPurchaseHistory:', error);
      return {
        success: false,
        error: 'Failed to fetch token purchases'
      };
    }
  }
}

// Export convenience functions
export const canExportPdf = PdfExportService.canExportPdf;
export const recordExport = PdfExportService.recordExport;
export const getExportHistory = PdfExportService.getExportHistory;
export const getCurrentMonthExports = PdfExportService.getCurrentMonthExports;
export const purchaseTokens = PdfExportService.purchaseTokens;
export const getTokenPurchaseHistory = PdfExportService.getTokenPurchaseHistory;

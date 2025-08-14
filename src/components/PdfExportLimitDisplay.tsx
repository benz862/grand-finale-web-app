import React, { useState, useEffect } from 'react';
import { useTrial } from '../contexts/TrialContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Info, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import TokenPurchaseModal from './TokenPurchaseModal';

interface PdfExportLimitDisplayProps {
  className?: string;
  showDetails?: boolean;
}

export default function PdfExportLimitDisplay({ 
  className = '', 
  showDetails = true 
}: PdfExportLimitDisplayProps) {
  const { getPdfExportLimit, canExportPdf } = useTrial();
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Get the next reset date (1st of next month)
  const getNextResetDate = (): string => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  const [limit, setLimit] = useState<{
    limit: number;
    hasWatermark: boolean;
    used: number;
    remaining: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLimit = async () => {
    try {
      setLoading(true);
      const result = await getPdfExportLimit();
      setLimit(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching PDF export limit:', err);
      setError('Failed to load export limits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimit();
  }, [getPdfExportLimit]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !limit) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Unable to load export limits'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isUnlimited = limit.limit === -1;
  const usagePercentage = isUnlimited ? 0 : (limit.used / limit.limit) * 100;
  const isNearLimit = !isUnlimited && limit.remaining <= 1;
  const isAtLimit = !isUnlimited && limit.remaining === 0;
  const showPurchaseButton = !isUnlimited && (isAtLimit || isNearLimit);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-skillbinder-blue" />
          PDF Export Limits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usage Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {isUnlimited ? 'Unlimited Exports' : 'Monthly Tokens'}
            </span>
            <Badge 
              variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
              className="text-xs"
            >
              {isUnlimited ? 'Unlimited' : `${limit.used}/${limit.limit}`}
            </Badge>
          </div>
          
          {!isUnlimited && (
            <Progress 
              value={usagePercentage} 
              className="h-2"
              style={{
                '--progress-background': isAtLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#3b82f6'
              } as React.CSSProperties}
            />
          )}
        </div>

        {/* Status Message */}
        <div className="flex items-start gap-2">
          {isAtLimit ? (
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          ) : isNearLimit ? (
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          )}
          <div className="text-sm">
            {isAtLimit ? (
              <span className="text-red-600 font-medium">
                All {limit.limit} monthly tokens used. Upgrade for more exports.
              </span>
            ) : isNearLimit ? (
              <span className="text-amber-600">
                Only {limit.remaining} token{limit.remaining === 1 ? '' : 's'} left until {getNextResetDate()}.
              </span>
            ) : isUnlimited ? (
              <span className="text-green-600">
                Unlimited PDF exports available.
              </span>
            ) : (
              <span className="text-gray-600">
                {limit.remaining} token{limit.remaining === 1 ? '' : 's'} remaining until {getNextResetDate()}.
              </span>
            )}
          </div>
        </div>

        {/* Token System Display */}
        {!isUnlimited && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">PDF Export Tokens</span>
              <Badge variant="outline" className="text-xs">
                {limit.hasWatermark ? 'Watermarked' : 'Clean'}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{limit.limit}</div>
                <div className="text-gray-500">Monthly</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{limit.used}</div>
                <div className="text-gray-500">Used</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-skillbinder-blue">{limit.remaining}</div>
                <div className="text-gray-500">Remaining</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{limit.purchasedTokens}</div>
                <div className="text-gray-500">Purchased</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 text-center">
              Resets {getNextResetDate()}
            </div>
          </div>
        )}

        {/* Watermark Status */}
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="text-xs">
            {limit.hasWatermark ? 'Watermarked' : 'No Watermark'}
          </Badge>
          <span className="text-gray-600">
            {limit.hasWatermark 
              ? 'Exports include watermark' 
              : 'Clean exports without watermark'
            }
          </span>
        </div>

        {/* Purchase Button */}
        {showPurchaseButton && (
          <div className="pt-3 border-t border-gray-200">
            <Button
              onClick={() => setShowTokenModal(true)}
              className="w-full bg-skillbinder-blue hover:bg-skillbinder-blue/90"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buy More Tokens - $4.95 each
            </Button>
          </div>
        )}

        {/* Detailed Info */}
        {showDetails && (
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Your {limit.limit === -1 ? 'unlimited' : `${limit.limit} monthly`} exports reset on {getNextResetDate()}</p>
              <p>• Premium and Lifetime plans have unlimited exports</p>
              <p>• Lite and Standard plans have monthly limits</p>
              {!isUnlimited && (
                <p>• You've used {limit.used} of {limit.limit} exports this month</p>
              )}
              {limit.purchasedTokens > 0 && (
                <p>• You have {limit.purchasedTokens} purchased token{limit.purchasedTokens > 1 ? 's' : ''} available</p>
              )}
            </div>
          </div>
        )}

        {/* Token Purchase Modal */}
        <TokenPurchaseModal
          isOpen={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          onPurchaseSuccess={() => {
            // Refresh the limit data
            fetchLimit();
          }}
          currentLimit={limit}
        />
      </CardContent>
    </Card>
  );
}

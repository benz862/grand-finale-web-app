import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useTrial } from '../contexts/TrialContext';
import { purchaseTokens } from '../lib/pdfExportService';
import { useToast } from './ui/use-toast';
import { CreditCard, Download, AlertTriangle, CheckCircle } from 'lucide-react';

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
  currentLimit: {
    limit: number;
    used: number;
    remaining: number;
    purchasedTokens: number;
    totalAvailable: number;
    hasWatermark: boolean;
  };
}

const tokenPackages = [
  { count: 1, price: 4.95, popular: false },
  { count: 2, price: 9.90, popular: true },
  { count: 5, price: 19.80, popular: false }
];

export default function TokenPurchaseModal({
  isOpen,
  onClose,
  onPurchaseSuccess,
  currentLimit
}: TokenPurchaseModalProps) {
  const { user } = useAuth();
  const { userTier } = useTrial();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState(tokenPackages[1]); // Default to 2 tokens
  const [isPurchasing, setIsPurchasing] = useState(false);

  const getExportType = () => {
    return userTier === 'Lite' ? 'watermarked' : 'clean';
  };

  const handlePurchase = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to purchase tokens.",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);

    try {
      // For now, we'll simulate a successful purchase
      // In production, this would integrate with Stripe
      const result = await purchaseTokens(
        user.id,
        selectedPackage.count,
        selectedPackage.price
      );

      if (result.success) {
        toast({
          title: "Success!",
          description: `${selectedPackage.count} ${getExportType()} export token${selectedPackage.count > 1 ? 's' : ''} purchased successfully.`,
          variant: "default",
        });
        onPurchaseSuccess();
        onClose();
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase tokens. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-skillbinder-blue" />
            Buy Additional Export Tokens
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-2">Current Status:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Monthly:</span> {currentLimit.used}/{currentLimit.limit} used
                </div>
                <div>
                  <span className="font-medium">Purchased:</span> {currentLimit.purchasedTokens} available
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Export type: {getExportType()} exports
              </div>
            </CardContent>
          </Card>

          {/* Token Packages */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Choose a package:</div>
            {tokenPackages.map((pkg) => (
              <Card 
                key={pkg.count}
                className={`cursor-pointer transition-all ${
                  selectedPackage.count === pkg.count 
                    ? 'ring-2 ring-skillbinder-blue border-skillbinder-blue' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-skillbinder-blue">
                          {pkg.count}
                        </div>
                        <div className="text-xs text-gray-500">tokens</div>
                      </div>
                      <div>
                        <div className="font-medium">
                          ${pkg.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${(pkg.price / pkg.count).toFixed(2)} per token
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pkg.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                      {selectedPackage.count === pkg.count && (
                        <CheckCircle className="h-5 w-5 text-skillbinder-blue" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-2">What you get:</div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• {selectedPackage.count} additional {getExportType()} PDF export{selectedPackage.count > 1 ? 's' : ''}</li>
              <li>• Tokens never expire</li>
              <li>• Use anytime, even after monthly reset</li>
              <li>• {getExportType()} exports (no watermarks for Standard+ plans)</li>
            </ul>
          </div>

          {/* Warning for Lite users */}
          {userTier === 'Lite' && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <div className="font-medium">Lite Plan Restriction:</div>
                  <div className="text-xs mt-1">
                    Purchased tokens will be watermarked. Upgrade to Standard for clean exports.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isPurchasing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="flex-1 bg-skillbinder-blue hover:bg-skillbinder-blue/90"
            >
              {isPurchasing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Buy ${selectedPackage.price.toFixed(2)}
                </div>
              )}
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-xs text-gray-500 text-center">
            Secure payment processed by Stripe. Your payment information is encrypted.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Mail, Clock, Home } from 'lucide-react';
import Logo from './Logo';

const SupportSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const requestId = searchParams.get('id');
  const category = searchParams.get('category');
  const subject = searchParams.get('subject');

  const getResponseTime = (category: string | null) => {
    switch (category) {
      case 'urgent':
      case 'technical':
        return 'within 4-6 hours';
      case 'billing':
        return 'within 8-12 hours';
      case 'feature':
      case 'bug':
        return 'within 24 hours';
      default:
        return 'within 24 hours';
    }
  };

  const getNextSteps = (category: string | null) => {
    switch (category) {
      case 'urgent':
        return 'We will prioritize your urgent request and respond as quickly as possible.';
      case 'technical':
        return 'Our technical team will investigate and provide a detailed solution.';
      case 'billing':
        return 'Our billing team will review your request and contact you with a resolution.';
      case 'feature':
        return 'We will review your feature request and let you know if it aligns with our roadmap.';
      case 'bug':
        return 'Our development team will investigate and fix the issue as soon as possible.';
      default:
        return 'We will review your request and get back to you with a helpful response.';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 bg-white text-skillbinder-blue rounded-t-lg shadow-lg border-b-2 border-skillbinder-blue/20">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-skillbinder-yellow rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-10 w-10" style={{ color: '#17394B' }} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-skillbinder-blue drop-shadow-lg">
              Support Request Submitted!
            </CardTitle>
            <CardDescription className="text-lg text-skillbinder-yellow font-semibold drop-shadow-md">
              Thank you for contacting The Grand Finale Support
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Request Details */}
            <div className="bg-gradient-to-r from-skillbinder-blue/5 to-skillbinder-yellow/5 p-6 rounded-xl border-2 border-skillbinder-blue/20">
              <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#17394B' }}>
                <div className="w-2 h-2 bg-skillbinder-yellow rounded-full mr-3"></div>
                Request Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {requestId && (
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="font-semibold text-skillbinder-blue mb-1">Request ID</div>
                    <div className="font-mono text-gray-700">{requestId}</div>
                  </div>
                )}
                {subject && (
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="font-semibold text-skillbinder-blue mb-1">Subject</div>
                    <div className="text-gray-700">{subject}</div>
                  </div>
                )}
                {category && (
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="font-semibold text-skillbinder-blue mb-1">Category</div>
                    <div className="text-gray-700 capitalize">{category}</div>
                  </div>
                )}
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="font-semibold text-skillbinder-blue mb-1">Submitted</div>
                  <div className="text-gray-700">{new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-skillbinder-yellow/10 to-skillbinder-blue/10 p-5 rounded-xl border border-skillbinder-yellow/30">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-skillbinder-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6" style={{ color: '#17394B' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2" style={{ color: '#17394B' }}>Response Time</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We typically respond to <span className="font-semibold text-skillbinder-blue">{category || 'general'}</span> requests <span className="font-semibold text-skillbinder-yellow">{getResponseTime(category)}</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-skillbinder-blue/10 to-skillbinder-yellow/10 p-5 rounded-xl border border-skillbinder-blue/30">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-skillbinder-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6" style={{ color: '#E3B549' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2" style={{ color: '#17394B' }}>What happens next?</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {getNextSteps(category)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-skillbinder-blue/5 to-skillbinder-yellow/5 p-6 rounded-xl border border-skillbinder-blue/20">
              <h4 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#17394B' }}>
                <div className="w-2 h-2 bg-skillbinder-yellow rounded-full mr-3"></div>
                Important Information
              </h4>
              <ul className="text-sm text-gray-700 space-y-3">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-skillbinder-yellow rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You'll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-skillbinder-yellow rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Keep your Request ID for future reference</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-skillbinder-yellow rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You can reply to our response email for follow-up questions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-skillbinder-yellow rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>For urgent matters, email us directly at <span className="font-semibold text-skillbinder-blue">support@skillbinder.com</span></span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => navigate('/app')}
                className="flex-1 font-bold text-lg py-4 bg-skillbinder-yellow hover:bg-skillbinder-yellow/90 text-skillbinder-blue border-2 border-skillbinder-yellow shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-3" />
                Return to App
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                className="flex-1 font-bold text-lg py-4 bg-transparent hover:bg-skillbinder-blue/5 text-skillbinder-blue border-2 border-skillbinder-blue shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Home className="h-5 w-5 mr-3" />
                Go to Homepage
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t-2 border-skillbinder-blue/20">
              <p className="text-sm text-gray-600">
                Need immediate assistance? Email us at{' '}
                <a 
                  href="mailto:support@skillbinder.com" 
                  className="font-bold underline hover:text-skillbinder-blue transition-colors duration-200"
                  style={{ color: '#17394B' }}
                >
                  support@skillbinder.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportSuccessPage; 
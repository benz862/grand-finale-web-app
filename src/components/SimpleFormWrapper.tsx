import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SimpleFormWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onPrevious: () => void;
}

const SimpleFormWrapper: React.FC<SimpleFormWrapperProps> = ({
  title,
  description,
  children,
  onNext,
  onPrevious
}) => {
  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary">{title}</CardTitle>
          <CardDescription className="text-subtext">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>

      <div className="flex justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        <Button
          onClick={onNext}
          className="flex items-center space-x-2"
        >
          <span>Save & Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SimpleFormWrapper;
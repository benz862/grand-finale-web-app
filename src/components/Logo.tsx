import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      {/* SkillBinder Logo */}
      <div className="flex-shrink-0">
        <img 
          src="/skillbinder_logo_with_guides.jpg" 
          alt="SkillBinder Logo" 
          className="h-20 w-auto"
          style={{ maxHeight: '80px' }}
        />
      </div>
      
      {/* The Grand Finale Title and Tagline */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-serif text-[#E4B64A] font-bold leading-tight">
          The Grand Finale
        </h1>
        <p className="text-sm text-[#153A4B] font-sans italic">
          A well planned goodbye
        </p>
      </div>
    </div>
  );
};

export default Logo;
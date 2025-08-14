import React from 'react';

const PricingLandingPage = () => {
  console.log('PricingLandingPage is rendering!');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', color: '#17394B', marginBottom: '1rem' }}>
        THE GRAND FINALE - PRICING PAGE
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        Complete SaaS pricing page coming up!
      </p>
      
      {/* Simple pricing cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h3 style={{ color: '#17394B', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Lite - $4/month</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Basic Legacy Sections</p>
          <button style={{ backgroundColor: '#E3B549', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Start Free Trial
          </button>
        </div>
        
        <div style={{ border: '2px solid #E3B549', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h3 style={{ color: '#17394B', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Standard - $8/month</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Most Popular Choice</p>
          <button style={{ backgroundColor: '#E3B549', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Start Free Trial
          </button>
        </div>
        
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h3 style={{ color: '#17394B', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Premium - $12/month</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Advanced Features</p>
          <button style={{ backgroundColor: '#E3B549', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Start Free Trial
          </button>
        </div>
        
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h3 style={{ color: '#17394B', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Lifetime - $199</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Pay Once, Use Forever</p>
          <button style={{ backgroundColor: '#17394B', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Get Lifetime Access
          </button>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#E3B549', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '2rem' }}>Start Your 7-Day Free Trial</h2>
        <p style={{ color: 'white', margin: '0 0 1rem 0' }}>
          No credit card required. Cancel anytime.
        </p>
        <button style={{ backgroundColor: 'white', color: '#17394B', padding: '1rem 2rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default PricingLandingPage;

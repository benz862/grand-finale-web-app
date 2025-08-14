-- Support Requests Table
-- This table stores user support requests and inquiries

CREATE TABLE IF NOT EXISTS support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own support requests
CREATE POLICY "Users can view own support requests" ON support_requests FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own support requests
CREATE POLICY "Users can insert own support requests" ON support_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own support requests
CREATE POLICY "Users can update own support requests" ON support_requests FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all support requests (you'll need to set up admin role)
-- CREATE POLICY "Admins can view all support requests" ON support_requests FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX idx_support_requests_user_id ON support_requests(user_id);
CREATE INDEX idx_support_requests_status ON support_requests(status);
CREATE INDEX idx_support_requests_created_at ON support_requests(created_at);
CREATE INDEX idx_support_requests_email ON support_requests(email);

-- Create updated_at trigger
CREATE TRIGGER update_support_requests_updated_at 
    BEFORE UPDATE ON support_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample categories for reference
-- You can modify these as needed
INSERT INTO support_requests (name, email, subject, category, message, status, priority) VALUES
('Sample User', 'sample@example.com', 'Test Support Request', 'general', 'This is a sample support request for testing purposes.', 'resolved', 'low')
ON CONFLICT DO NOTHING; 
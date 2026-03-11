CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  file_size BIGINT,
  processing_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  delete_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  -- AI Double-Check System columns
  review_status VARCHAR(30) DEFAULT NULL,       -- 'approved' | 'needs_revision' | 'rejected'
  review_confidence DECIMAL(3,2) DEFAULT NULL,  -- 0.00 – 1.00
  review_notes TEXT DEFAULT NULL,               -- Expert B's review notes
  revisions_applied INTEGER DEFAULT 0           -- Number of corrections made
);

-- AI Double-Check Cache Table (for speed optimization)
CREATE TABLE IF NOT EXISTS ai_double_check_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_hash VARCHAR(64) NOT NULL UNIQUE,     -- SHA-256 hash of content
  tool_type VARCHAR(50) NOT NULL,
  processor_result TEXT NOT NULL,               -- Expert A cached result
  reviewer_result TEXT NOT NULL,                -- Expert B cached review
  verdict VARCHAR(30) NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  hit_count INTEGER DEFAULT 1,                 -- Cache hit tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL  -- Cache TTL
);

CREATE INDEX IF NOT EXISTS idx_cache_content_hash ON ai_double_check_cache(content_hash);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON ai_double_check_cache(expires_at);

CREATE TABLE IF NOT EXISTS usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_type VARCHAR(50) NOT NULL,
  ip_hash VARCHAR(64) NOT NULL,
  country VARCHAR(2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level VARCHAR(10) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

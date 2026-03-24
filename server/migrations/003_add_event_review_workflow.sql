ALTER TABLE event_details
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS rejection_message TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by BIGINT REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

ALTER TABLE event_details
  ADD CONSTRAINT event_details_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_event_details_status ON event_details (status);
CREATE INDEX IF NOT EXISTS idx_event_details_user_id ON event_details (user_id);
CREATE INDEX IF NOT EXISTS idx_event_details_reviewed_by ON event_details (reviewed_by);

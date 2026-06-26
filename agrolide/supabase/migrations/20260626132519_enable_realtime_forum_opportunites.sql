-- Migration to enable Realtime for forum_messages and opportunites

DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'forum_messages'
    ) THEN 
        ALTER PUBLICATION supabase_realtime ADD TABLE forum_messages; 
    END IF; 
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'opportunites'
    ) THEN 
        ALTER PUBLICATION supabase_realtime ADD TABLE opportunites; 
    END IF; 
END $$;

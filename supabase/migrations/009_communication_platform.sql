-- Phase 03.2H Enterprise Communication & Messaging Platform Migrations

CREATE TABLE IF NOT EXISTS notification_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL',
    priority VARCHAR(50) DEFAULT 'NORMAL',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS notification_template (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject_template VARCHAR(255),
    body_template TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL, -- 'EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'IN_APP'
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS announcement_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience JSONB NOT NULL,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS circular_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    circular_number VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    attachment_url VARCHAR(255),
    target_audience JSONB NOT NULL,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS conversation_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255),
    type VARCHAR(50) DEFAULT 'ONE_TO_ONE', -- 'ONE_TO_ONE', 'GROUP'
    participants JSONB NOT NULL,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS message_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS attachment_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    message_id UUID NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS broadcast_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender_id UUID NOT NULL,
    scheduled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS broadcast_recipient (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    broadcast_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    delivery_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS notification_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    channel VARCHAR(50) NOT NULL,
    content TEXT,
    delivery_status VARCHAR(50) DEFAULT 'SENT',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    retry_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS sms_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    retry_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS whatsapp_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    retry_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS push_queue (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    device_token VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    retry_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS reminder_master (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    reminder_type VARCHAR(50) NOT NULL, -- 'HOMEWORK', 'FEE', 'ATTENDANCE', 'EXAMINATION', 'HOLIDAY', 'MEETING'
    scheduled_at TIMESTAMP NOT NULL,
    is_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS event_invitation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    event_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    response_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS notification_preference (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    channel_preferences JSONB NOT NULL,
    category_preferences JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS device_token (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    token VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'IOS', 'ANDROID', 'WEB'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS delivery_status (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    message_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'SENT', 'DELIVERED', 'READ', 'FAILED'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    version INT DEFAULT 1
);


-- Indexes
CREATE INDEX IF NOT EXISTS idx_notif_tenant ON notification_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_annc_tenant ON announcement_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_circ_tenant ON circular_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conv_tenant ON conversation_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_msg_tenant ON message_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_brdc_tenant ON broadcast_master(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notiflog_tenant ON notification_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_email_q_tenant ON email_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sms_q_tenant ON sms_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wa_q_tenant ON whatsapp_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_push_q_tenant ON push_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rem_tenant ON reminder_master(tenant_id);


-- Row-Level Security (RLS)
ALTER TABLE notification_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE circular_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachment_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_recipient ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invitation ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preference ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_token ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_status ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notification_master') THEN
        CREATE POLICY tenant_isolation_notification_master ON notification_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notification_template') THEN
        CREATE POLICY tenant_isolation_notification_template ON notification_template FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_announcement_master') THEN
        CREATE POLICY tenant_isolation_announcement_master ON announcement_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_circular_master') THEN
        CREATE POLICY tenant_isolation_circular_master ON circular_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_conversation_master') THEN
        CREATE POLICY tenant_isolation_conversation_master ON conversation_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_message_master') THEN
        CREATE POLICY tenant_isolation_message_master ON message_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_attachment_master') THEN
        CREATE POLICY tenant_isolation_attachment_master ON attachment_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_broadcast_master') THEN
        CREATE POLICY tenant_isolation_broadcast_master ON broadcast_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_broadcast_recipient') THEN
        CREATE POLICY tenant_isolation_broadcast_recipient ON broadcast_recipient FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notification_log') THEN
        CREATE POLICY tenant_isolation_notification_log ON notification_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_email_queue') THEN
        CREATE POLICY tenant_isolation_email_queue ON email_queue FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_sms_queue') THEN
        CREATE POLICY tenant_isolation_sms_queue ON sms_queue FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_whatsapp_queue') THEN
        CREATE POLICY tenant_isolation_whatsapp_queue ON whatsapp_queue FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_push_queue') THEN
        CREATE POLICY tenant_isolation_push_queue ON push_queue FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_reminder_master') THEN
        CREATE POLICY tenant_isolation_reminder_master ON reminder_master FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_event_invitation') THEN
        CREATE POLICY tenant_isolation_event_invitation ON event_invitation FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_notification_preference') THEN
        CREATE POLICY tenant_isolation_notification_preference ON notification_preference FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_device_token') THEN
        CREATE POLICY tenant_isolation_device_token ON device_token FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_delivery_status') THEN
        CREATE POLICY tenant_isolation_delivery_status ON delivery_status FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
END $$;

-- Audit Triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_notification_master_audit') THEN
        CREATE TRIGGER tr_notification_master_audit AFTER INSERT OR UPDATE OR DELETE ON notification_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_notification_template_audit') THEN
        CREATE TRIGGER tr_notification_template_audit AFTER INSERT OR UPDATE OR DELETE ON notification_template FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_announcement_master_audit') THEN
        CREATE TRIGGER tr_announcement_master_audit AFTER INSERT OR UPDATE OR DELETE ON announcement_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_circular_master_audit') THEN
        CREATE TRIGGER tr_circular_master_audit AFTER INSERT OR UPDATE OR DELETE ON circular_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_conversation_master_audit') THEN
        CREATE TRIGGER tr_conversation_master_audit AFTER INSERT OR UPDATE OR DELETE ON conversation_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_message_master_audit') THEN
        CREATE TRIGGER tr_message_master_audit AFTER INSERT OR UPDATE OR DELETE ON message_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_broadcast_master_audit') THEN
        CREATE TRIGGER tr_broadcast_master_audit AFTER INSERT OR UPDATE OR DELETE ON broadcast_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_email_queue_audit') THEN
        CREATE TRIGGER tr_email_queue_audit AFTER INSERT OR UPDATE OR DELETE ON email_queue FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_sms_queue_audit') THEN
        CREATE TRIGGER tr_sms_queue_audit AFTER INSERT OR UPDATE OR DELETE ON sms_queue FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_whatsapp_queue_audit') THEN
        CREATE TRIGGER tr_whatsapp_queue_audit AFTER INSERT OR UPDATE OR DELETE ON whatsapp_queue FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_push_queue_audit') THEN
        CREATE TRIGGER tr_push_queue_audit AFTER INSERT OR UPDATE OR DELETE ON push_queue FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_reminder_master_audit') THEN
        CREATE TRIGGER tr_reminder_master_audit AFTER INSERT OR UPDATE OR DELETE ON reminder_master FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
END $$;

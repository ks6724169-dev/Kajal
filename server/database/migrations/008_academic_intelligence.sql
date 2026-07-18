-- Phase 03.2G Enterprise Academic Intelligence Migrations

CREATE TABLE IF NOT EXISTS student_academic_profile (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    overall_gpa NUMERIC(4, 2) DEFAULT 0.00,
    total_credits_earned INT DEFAULT 0,
    academic_standing VARCHAR(50) DEFAULT 'GOOD',
    learning_style VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS student_performance_analytics (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    term VARCHAR(50) NOT NULL,
    average_score NUMERIC(5, 2) DEFAULT 0.00,
    percentile_rank NUMERIC(5, 2) DEFAULT 0.00,
    class_rank INT,
    attendance_rate NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS subject_analytics (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    term VARCHAR(50) NOT NULL,
    average_score NUMERIC(5, 2) DEFAULT 0.00,
    pass_rate NUMERIC(5, 2) DEFAULT 0.00,
    difficulty_index NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS weak_student_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    reason TEXT,
    identified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remediation_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS gifted_student_registry (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    reason TEXT,
    identified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enrichment_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS dropout_prediction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    risk_level VARCHAR(50) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
    confidence_score NUMERIC(5, 2) DEFAULT 0.00,
    risk_factors JSONB,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS attendance_prediction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    predicted_attendance_rate NUMERIC(5, 2) DEFAULT 0.00,
    risk_level VARCHAR(50) NOT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS promotion_prediction (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    probability NUMERIC(5, 2) DEFAULT 0.00,
    recommendation VARCHAR(100),
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS learning_style_profile (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    primary_style VARCHAR(50) NOT NULL, -- 'VISUAL', 'AUDITORY', 'KINESTHETIC', 'READING_WRITING'
    secondary_style VARCHAR(50),
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_study_plan (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- 'WEEKLY', 'DAILY', 'REVISION'
    plan_data JSONB NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS ai_recommendation (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL,
    recommendation_text TEXT NOT NULL,
    generated_by VARCHAR(100) DEFAULT 'AI_GATEWAY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS academic_benchmark (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    benchmark_name VARCHAR(100) NOT NULL,
    target_metric VARCHAR(100) NOT NULL,
    target_value NUMERIC(10, 2) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    term VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS academic_trend (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'STUDENT', 'CLASS', 'SUBJECT'
    entity_id UUID NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    trend_data JSONB NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS academic_alert (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    alert_message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'MEDIUM',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS performance_history (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    score NUMERIC(5, 2),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS student_prediction_log (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL,
    prediction_type VARCHAR(100) NOT NULL,
    prediction_result JSONB NOT NULL,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    deleted_by UUID,
    created_by UUID,
    updated_by UUID,
    version INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stud_acad_prof_tenant ON student_academic_profile (tenant_id);
CREATE INDEX IF NOT EXISTS idx_stud_perf_anal_tenant ON student_performance_analytics (tenant_id);
CREATE INDEX IF NOT EXISTS idx_subj_anal_tenant ON subject_analytics (tenant_id);
CREATE INDEX IF NOT EXISTS idx_dropout_pred_tenant ON dropout_prediction (tenant_id);
CREATE INDEX IF NOT EXISTS idx_att_pred_tenant ON attendance_prediction (tenant_id);
CREATE INDEX IF NOT EXISTS idx_promo_pred_tenant ON promotion_prediction (tenant_id);
CREATE INDEX IF NOT EXISTS idx_learn_style_tenant ON learning_style_profile (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_study_plan_tenant ON ai_study_plan (tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommend_tenant ON ai_recommendation (tenant_id);
CREATE INDEX IF NOT EXISTS idx_acad_bench_tenant ON academic_benchmark (tenant_id);
CREATE INDEX IF NOT EXISTS idx_acad_trend_tenant ON academic_trend (tenant_id);
CREATE INDEX IF NOT EXISTS idx_acad_alert_tenant ON academic_alert (tenant_id);
CREATE INDEX IF NOT EXISTS idx_perf_hist_tenant ON performance_history (tenant_id);
CREATE INDEX IF NOT EXISTS idx_stud_pred_log_tenant ON student_prediction_log (tenant_id);

-- Row-Level Security (RLS)
ALTER TABLE student_academic_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropout_prediction ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_prediction ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_prediction ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_style_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_study_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendation ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_benchmark ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_trend ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_alert ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_prediction_log ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_student_academic_profile') THEN
        CREATE POLICY tenant_isolation_student_academic_profile ON student_academic_profile FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_student_performance_analytics') THEN
        CREATE POLICY tenant_isolation_student_performance_analytics ON student_performance_analytics FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_subject_analytics') THEN
        CREATE POLICY tenant_isolation_subject_analytics ON subject_analytics FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_dropout_prediction') THEN
        CREATE POLICY tenant_isolation_dropout_prediction ON dropout_prediction FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_attendance_prediction') THEN
        CREATE POLICY tenant_isolation_attendance_prediction ON attendance_prediction FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_promotion_prediction') THEN
        CREATE POLICY tenant_isolation_promotion_prediction ON promotion_prediction FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_learning_style_profile') THEN
        CREATE POLICY tenant_isolation_learning_style_profile ON learning_style_profile FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_study_plan') THEN
        CREATE POLICY tenant_isolation_ai_study_plan ON ai_study_plan FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_ai_recommendation') THEN
        CREATE POLICY tenant_isolation_ai_recommendation ON ai_recommendation FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_academic_benchmark') THEN
        CREATE POLICY tenant_isolation_academic_benchmark ON academic_benchmark FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_academic_trend') THEN
        CREATE POLICY tenant_isolation_academic_trend ON academic_trend FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_academic_alert') THEN
        CREATE POLICY tenant_isolation_academic_alert ON academic_alert FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_performance_history') THEN
        CREATE POLICY tenant_isolation_performance_history ON performance_history FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_student_prediction_log') THEN
        CREATE POLICY tenant_isolation_student_prediction_log ON student_prediction_log FOR ALL USING (tenant_id = current_setting('app.current_tenant')::UUID);
    END IF;
END $$;

-- Audit Triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_student_academic_profile_audit') THEN
        CREATE TRIGGER tr_student_academic_profile_audit AFTER INSERT OR UPDATE OR DELETE ON student_academic_profile FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_student_performance_analytics_audit') THEN
        CREATE TRIGGER tr_student_performance_analytics_audit AFTER INSERT OR UPDATE OR DELETE ON student_performance_analytics FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_subject_analytics_audit') THEN
        CREATE TRIGGER tr_subject_analytics_audit AFTER INSERT OR UPDATE OR DELETE ON subject_analytics FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_dropout_prediction_audit') THEN
        CREATE TRIGGER tr_dropout_prediction_audit AFTER INSERT OR UPDATE OR DELETE ON dropout_prediction FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_attendance_prediction_audit') THEN
        CREATE TRIGGER tr_attendance_prediction_audit AFTER INSERT OR UPDATE OR DELETE ON attendance_prediction FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_promotion_prediction_audit') THEN
        CREATE TRIGGER tr_promotion_prediction_audit AFTER INSERT OR UPDATE OR DELETE ON promotion_prediction FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_learning_style_profile_audit') THEN
        CREATE TRIGGER tr_learning_style_profile_audit AFTER INSERT OR UPDATE OR DELETE ON learning_style_profile FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_study_plan_audit') THEN
        CREATE TRIGGER tr_ai_study_plan_audit AFTER INSERT OR UPDATE OR DELETE ON ai_study_plan FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_ai_recommendation_audit') THEN
        CREATE TRIGGER tr_ai_recommendation_audit AFTER INSERT OR UPDATE OR DELETE ON ai_recommendation FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_academic_benchmark_audit') THEN
        CREATE TRIGGER tr_academic_benchmark_audit AFTER INSERT OR UPDATE OR DELETE ON academic_benchmark FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_academic_trend_audit') THEN
        CREATE TRIGGER tr_academic_trend_audit AFTER INSERT OR UPDATE OR DELETE ON academic_trend FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_academic_alert_audit') THEN
        CREATE TRIGGER tr_academic_alert_audit AFTER INSERT OR UPDATE OR DELETE ON academic_alert FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_performance_history_audit') THEN
        CREATE TRIGGER tr_performance_history_audit AFTER INSERT OR UPDATE OR DELETE ON performance_history FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_student_prediction_log_audit') THEN
        CREATE TRIGGER tr_student_prediction_log_audit AFTER INSERT OR UPDATE OR DELETE ON student_prediction_log FOR EACH ROW EXECUTE FUNCTION public.fn_trigger_audit_logger();
    END IF;
END $$;

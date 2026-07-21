import { BaseEntity } from './BaseEntity.js';

export interface Dashboard extends BaseEntity {
  name: string;
  role: string;
  layout: any;
  is_default: boolean;
}

export interface KPI extends BaseEntity {
  name: string;
  category: string;
  value: number;
  unit: string;
  target_value?: number;
  trend: 'UP' | 'DOWN' | 'FLAT';
  percentage_change?: number;
}

export interface Widget extends BaseEntity {
  dashboard_id: string;
  title: string;
  type: string;
  data_source: string;
  configuration: any;
  position: any;
}

export interface AnalyticsSnapshot extends BaseEntity {
  snapshot_date: Date;
  metrics: any;
}

export interface Report extends BaseEntity {
  name: string;
  type: 'PDF' | 'EXCEL' | 'CSV';
  parameters: any;
  generated_url?: string;
  report_status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
}

export interface ScheduledReport extends BaseEntity {
  report_id: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recipients: string[];
  next_run_date: Date;
  is_active: boolean;
}

export interface ExecutiveInsight extends BaseEntity {
  title: string;
  content: string;
  category: 'REVENUE' | 'ACADEMIC' | 'OPERATIONAL' | 'RISK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ai_generated: boolean;
  date_generated: Date;
}

export interface Prediction extends BaseEntity {
  metric_name: string;
  predicted_value: number;
  confidence_score: number;
  prediction_date: Date;
  timeframe: string;
}

export interface TrendAnalysis extends BaseEntity {
  metric_name: string;
  trend_direction: 'UP' | 'DOWN' | 'FLAT';
  historical_data: any;
  analysis_text: string;
}

export interface AlertRule extends BaseEntity {
  metric_name: string;
  condition: string;
  threshold: number;
  notification_channels: string[];
  is_active: boolean;
}

export interface AlertHistory extends BaseEntity {
  rule_id: string;
  triggered_value: number;
  triggered_at: Date;
  alert_status: 'UNREAD' | 'READ' | 'RESOLVED';
}

export interface UsageAnalytics extends BaseEntity {
  module_name: string;
  user_id: string;
  action: string;
  timestamp: Date;
  metadata: any;
}

export interface SystemMetrics extends BaseEntity {
  metric_name: string;
  value: number;
  unit: string;
  timestamp: Date;
}

export interface PerformanceBenchmark extends BaseEntity {
  category: string;
  benchmark_value: number;
  current_value: number;
  comparison: string;
}

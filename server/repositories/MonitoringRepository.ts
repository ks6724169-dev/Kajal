import { BaseRepository } from './BaseRepository.js';
import { 
  SystemHealth,
  ServiceHealth,
  ApplicationLog,
  ErrorLog,
  PerformanceMetric,
  APIMetric,
  Alert,
  Incident,
  FeatureFlag,
  MonitoringDashboard
} from '../entities/MonitoringDomain.js';

export class SystemHealthRepository extends BaseRepository<SystemHealth> {
  protected tableName = 'system_health';
}

export class ServiceHealthRepository extends BaseRepository<ServiceHealth> {
  protected tableName = 'service_health';
}

export class ApplicationLogRepository extends BaseRepository<ApplicationLog> {
  protected tableName = 'application_log';
}

export class ErrorLogRepository extends BaseRepository<ErrorLog> {
  protected tableName = 'error_log';
}

export class PerformanceMetricRepository extends BaseRepository<PerformanceMetric> {
  protected tableName = 'performance_metric';
}

export class APIMetricRepository extends BaseRepository<APIMetric> {
  protected tableName = 'api_metric';
}

export class AlertRepository extends BaseRepository<Alert> {
  protected tableName = 'alert';
}

export class IncidentRepository extends BaseRepository<Incident> {
  protected tableName = 'incident';
}

export class FeatureFlagRepository extends BaseRepository<FeatureFlag> {
  protected tableName = 'feature_flag';
}

export class MonitoringDashboardRepository extends BaseRepository<MonitoringDashboard> {
  protected tableName = 'monitoring_dashboard';
}

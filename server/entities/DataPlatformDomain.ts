import { BaseEntity } from './BaseEntity.js';

export interface DataSource extends BaseEntity { tenant_id: string; name: string; type: string; config: any; status: string; }
export interface DataConnector extends BaseEntity { tenant_id: string; source_id: string; target_id: string; config: any; status: string; }
export interface DataPipeline extends BaseEntity { tenant_id: string; name: string; description: string; config: any; status: string; }
export interface PipelineExecution extends BaseEntity { tenant_id: string; pipeline_id: string; start_time: Date; end_time?: Date; status: string; logs: any; }
export interface PipelineSchedule extends BaseEntity { tenant_id: string; pipeline_id: string; cron_expression: string; is_active: boolean; }
export interface ETLJob extends BaseEntity { tenant_id: string; pipeline_id: string; step_name: string; status: string; metrics: any; }
export interface ELTJob extends BaseEntity { tenant_id: string; pipeline_id: string; step_name: string; status: string; metrics: any; }
export interface DataLake extends BaseEntity { tenant_id: string; name: string; storage_provider: string; config: any; }
export interface LakeObject extends BaseEntity { tenant_id: string; lake_id: string; path: string; size_bytes: number; metadata: any; }
export interface WarehouseDataset extends BaseEntity { tenant_id: string; name: string; description: string; schema_definition: any; }
export interface WarehouseTable extends BaseEntity { tenant_id: string; dataset_id: string; table_name: string; schema_definition: any; }
export interface WarehouseSnapshot extends BaseEntity { tenant_id: string; table_id: string; snapshot_date: Date; row_count: number; }
export interface MetadataCatalog extends BaseEntity { tenant_id: string; name: string; description: string; }
export interface MetadataAttribute extends BaseEntity { tenant_id: string; catalog_id: string; key: string; value: string; }
export interface DataDictionary extends BaseEntity { tenant_id: string; table_id: string; column_name: string; data_type: string; description: string; }
export interface DataQualityRule extends BaseEntity { tenant_id: string; dataset_id: string; rule_name: string; condition: string; is_active: boolean; }
export interface DataValidationResult extends BaseEntity { tenant_id: string; rule_id: string; execution_time: Date; passed: boolean; details: any; }
export interface DataProfile extends BaseEntity { tenant_id: string; dataset_id: string; profiling_data: any; generated_at: Date; }
export interface DataLineage extends BaseEntity { tenant_id: string; source_node: string; target_node: string; transformation_logic: string; }
export interface FeatureStore extends BaseEntity { tenant_id: string; name: string; description: string; }
export interface FeatureDefinition extends BaseEntity { tenant_id: string; store_id: string; feature_name: string; data_type: string; calculation_logic: string; }
export interface MLDataset extends BaseEntity { tenant_id: string; name: string; version_number: string; features: string[]; }
export interface TrainingJob extends BaseEntity { tenant_id: string; dataset_id: string; model_name: string; status: string; metrics: any; }
export interface TrainedModel extends BaseEntity { tenant_id: string; job_id: string; model_path: string; accuracy: number; }
export interface ModelRegistry extends BaseEntity { tenant_id: string; name: string; description: string; }
export interface ModelVersion extends BaseEntity { tenant_id: string; registry_id: string; version_number: string; model_id: string; status: string; }
export interface ModelDeployment extends BaseEntity { tenant_id: string; version_id: string; endpoint_url: string; status: string; }
export interface EmbeddingCollection extends BaseEntity { tenant_id: string; name: string; dimension: number; }
export interface EmbeddingVector extends BaseEntity { tenant_id: string; collection_id: string; vector: number[]; metadata: any; }
export interface VectorIndex extends BaseEntity { tenant_id: string; collection_id: string; index_type: string; status: string; }
export interface SemanticDocument extends BaseEntity { tenant_id: string; collection_id: string; document_text: string; metadata: any; }
export interface SemanticChunk extends BaseEntity { tenant_id: string; document_id: string; chunk_text: string; embedding_id: string; }
export interface KnowledgeGraph extends BaseEntity { tenant_id: string; name: string; description: string; }
export interface KnowledgeNode extends BaseEntity { tenant_id: string; graph_id: string; label: string; properties: any; }
export interface KnowledgeEdge extends BaseEntity { tenant_id: string; graph_id: string; source_node_id: string; target_node_id: string; relationship: string; properties: any; }
export interface GraphRelationship extends BaseEntity { tenant_id: string; name: string; properties_schema: any; }
export interface AIDataset extends BaseEntity { tenant_id: string; name: string; purpose: string; records_count: number; }
export interface AITrainingLog extends BaseEntity { tenant_id: string; dataset_id: string; epoch: number; loss: number; }
export interface StreamingEvent extends BaseEntity { tenant_id: string; stream_id: string; event_type: string; payload: any; timestamp: Date; }
export interface EventStream extends BaseEntity { tenant_id: string; name: string; topic_name: string; }
export interface CDCLog extends BaseEntity { tenant_id: string; table_name: string; operation: string; old_data: any; new_data: any; }
export interface EventReplay extends BaseEntity { tenant_id: string; stream_id: string; start_time: Date; end_time: Date; status: string; }
export interface LakehouseObject extends BaseEntity { tenant_id: string; name: string; format: string; location: string; }
export interface RetentionPolicy extends BaseEntity { tenant_id: string; entity_type: string; retention_days: number; }
export interface ArchivePolicy extends BaseEntity { tenant_id: string; entity_type: string; archive_after_days: number; storage_tier: string; }

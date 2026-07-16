# DATABASE INDEXING STRATEGY
This directory details index configurations designed to maintain low latency across GCEC enterprise clusters.

## Standard Indexing Rules
- **Primary Keys**: Automatically indexed as unique B-tree indices.
- **Foreign Keys**: Must be indexed explicitly using B-tree indices to speed up table joins and cascade operations.
- **JSONB data**: Indexed using GIN indices (`jsonb_ops` or `jsonb_path_ops`) to search schemaless properties efficiently.
- **Text Search**: Indexed using GIN indices with the `pg_trgm` extension for faster natural language queries.

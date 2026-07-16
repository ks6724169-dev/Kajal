# Specification Pattern / Query Builder

## Purpose
Directly writing raw SQL strings inside Service classes breaks Hexagonal architecture principles. The `QuerySpecification` class implements the Specification Pattern to construct complex filtering logic dynamically.

## Security
- Utilizes parameterized bindings (`$1`, `$2`) to completely neutralize SQL injection risks.
- Maintains sequence tracking via `paramOffset`.

## Extensibility
Future iterations will support:
- Standard `JOIN` conditions.
- Graph relationships mapping.
- Native Full-Text Search.
- PostGIS boundary intersections.

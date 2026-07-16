export interface ISpecification {
  toSql(): { query: string; params: any[] };
}

export class QuerySpecification implements ISpecification {
  private conditions: string[] = [];
  private parameters: any[] = [];
  private paramOffset: number = 1;

  constructor(paramOffset: number = 1) {
    this.paramOffset = paramOffset;
  }

  public and(condition: string, value?: any): this {
    if (value !== undefined) {
      this.conditions.push(`(${condition} = $${this.paramOffset++})`);
      this.parameters.push(value);
    } else {
      this.conditions.push(`(${condition})`);
    }
    return this;
  }

  public or(condition: string, value?: any): this {
    if (value !== undefined) {
      this.conditions.push(`(${condition} = $${this.paramOffset++})`);
      this.parameters.push(value);
    } else {
      this.conditions.push(`(${condition})`);
    }
    // Simple mock logic for "OR", a real query builder would handle precedence better
    if (this.conditions.length >= 2) {
      const last = this.conditions.pop();
      const prev = this.conditions.pop();
      this.conditions.push(`(${prev} OR ${last})`);
    }
    return this;
  }

  public in(field: string, values: any[]): this {
    if (values.length > 0) {
      const placeholders = values.map(() => `$${this.paramOffset++}`).join(', ');
      this.conditions.push(`(${field} IN (${placeholders}))`);
      this.parameters.push(...values);
    }
    return this;
  }

  public isNull(field: string): this {
    this.conditions.push(`(${field} IS NULL)`);
    return this;
  }

  public isNotNull(field: string): this {
    this.conditions.push(`(${field} IS NOT NULL)`);
    return this;
  }

  public toSql(): { query: string; params: any[] } {
    if (this.conditions.length === 0) {
      return { query: '1=1', params: [] };
    }
    return {
      query: this.conditions.join(' AND '),
      params: this.parameters
    };
  }
}

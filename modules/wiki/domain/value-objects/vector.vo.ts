/**
 * Module: wiki-core
 * Layer: domain/value-object
 * Purpose: Vector value with minimal invariant checks; no provider dependency.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
export class Vector {
  constructor(public readonly values: number[]) {
    if (values.length === 0) throw new Error('Vector cannot be empty')
  }
}

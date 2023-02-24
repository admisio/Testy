import { test, expect } from 'vitest';
import { prismaMock } from './singleton';

test('hello', () => {
    prismaMock.
    expect('hello').toBe('hello');
    }
);
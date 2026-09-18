// utils/version.test.js
import { describe, it, expect } from 'vitest';
import { conversionVer } from '../utils/version.js';

describe('conversionVer', () => {
    it('убирает точки', () => {
        expect(conversionVer('1.0.0')).toBe('100');
    });
    it('убирает ведущие нули', () => {
        expect(conversionVer('0.1.0')).toBe('10');
        expect(conversionVer('0.0.5')).toBe('5');
    });
    it('возвращает "0" для пустой строки / строки из нулей', () => {
        expect(conversionVer('0.0.0')).toBe('0');
        expect(conversionVer('')).toBe('0');
    });
    it('работает с beta-суффиксами', () => {
        expect(conversionVer('1.2.3-beta')).toBe('123');
    });
    it('обрезает всё после первого ненулевого', () => {
        expect(conversionVer('1.2.3.4.5')).toBe('12345');
    });
});
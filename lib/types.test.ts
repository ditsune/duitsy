import { describe, it, expect } from 'vitest';
import { fmt, fmtAmount, fmtDelta, fmtPercent, tintOf } from './types';

describe('fmt', () => {
  it('format angka positif ke Rupiah', () => {
    expect(fmt(15000)).toBe('Rp15.000');
  });

  it('nilai negatif ikut membawa tanda minus', () => {
    expect(fmt(-15000)).toBe('-Rp15.000');
  });

  it('nol tetap terbaca benar', () => {
    expect(fmt(0)).toBe('Rp0');
  });

  it('membulatkan desimal (transaksi selalu integer rupiah)', () => {
    expect(fmt(1500.7)).toBe('Rp1.501');
  });
});

describe('fmtDelta', () => {
  it('selalu menunjukkan arah arus kas', () => {
    expect(fmtDelta(15000)).toBe('+Rp15.000');
    expect(fmtDelta(-15000)).toBe('-Rp15.000');
  });

  it('arus kas nol tidak diberi tanda', () => {
    expect(fmtDelta(0)).toBe('Rp0');
  });
});

describe('fmtAmount', () => {
  it('selalu absolut karena arah sudah diberikan oleh tipe transaksi', () => {
    expect(fmtAmount(-25000)).toBe('Rp25.000');
  });
});

describe('fmtPercent', () => {
  it('menghitung persentase dan aman saat total nol', () => {
    expect(fmtPercent(25, 100)).toBe('25%');
    expect(fmtPercent(10, 0)).toBe('0%');
  });
});

describe('tintOf', () => {
  it('memetakan nama warna lama di database ke tiga tint yang berlaku', () => {
    expect(tintOf('pink')).toBe('blue');
    expect(tintOf('purple')).toBe('blue');
    expect(tintOf('teal')).toBe('green');
    expect(tintOf('amber')).toBe('coral');
  });

  it('nilai kosong atau tidak dikenal jatuh ke biru', () => {
    expect(tintOf(undefined)).toBe('blue');
    expect(tintOf('')).toBe('blue');
    expect(tintOf('merah-jambu')).toBe('blue');
  });
});

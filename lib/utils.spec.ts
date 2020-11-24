import { topoSort } from './utils';

describe('topoSort', () => {
  describe('Should fail due to circular dependence', () => {
    it('if a root does not exists', () => {
      const a = { key: '1', depends: ['2'] };
      const b = { key: '2', depends: ['1'] };

      const sorted = topoSort([a, b], { findKey: n => n.key, findInputs: n => n.depends });

      expect(sorted).toBeUndefined();
    });

    it('if a root exists', () => {
      const a = { key: '1', depends: [] };
      const b = { key: '2', depends: ['1', '4'] };
      const c = { key: '3', depends: ['2'] };
      const d = { key: '4', depends: ['3'] };

      const sorted = topoSort([a, b, c, d], { findKey: n => n.key, findInputs: n => n.depends });

      expect(sorted).toBeUndefined();
    });
  });

  it("Dependencies that don't exist should be ignored", () => {
    const a = { key: '1', depends: ['100'] };
    const b = { key: '2', depends: ['1'] };
    const c = { key: '3', depends: ['1'] };

    const sorted = topoSort([a, b, c], { findKey: n => n.key, findInputs: n => n.depends });

    expect(sorted).toBeDefined();
    expect(sorted).toHaveLength(3);
  });

  it('success pattern', () => {
    const a = { key: '1', depends: [] };
    const b = { key: '2', depends: ['1', '6'] };
    const c = { key: '3', depends: ['6'] };
    const d = { key: '4', depends: ['7'] };
    const e = { key: '5', depends: ['3'] };
    const f = { key: '6', depends: [] };
    const g = { key: '7', depends: ['2'] };

    const sorted = topoSort([a, b, c, d, e, f, g], {
      findKey: n => n.key,
      findInputs: n => n.depends,
    });
    const idxA = sorted.findIndex(n => n.key === a.key);
    const idxB = sorted.findIndex(n => n.key === b.key);
    const idxC = sorted.findIndex(n => n.key === c.key);
    const idxD = sorted.findIndex(n => n.key === d.key);
    const idxE = sorted.findIndex(n => n.key === e.key);
    const idxF = sorted.findIndex(n => n.key === f.key);
    const idxG = sorted.findIndex(n => n.key === g.key);

    expect(sorted).toBeDefined();
    expect(idxB).toBeGreaterThan(idxA);
    expect(idxB).toBeGreaterThan(idxF);
    expect(idxC).toBeGreaterThan(idxF);
    expect(idxD).toBeGreaterThan(idxG);
    expect(idxE).toBeGreaterThan(idxC);
    expect(idxG).toBeGreaterThan(idxB);
  });
});

const names = [
  null,
  null,
  null,
  'triangle',
  'square',
  'pentagon',
  null,
  'heptagon',
  'octagon',
  'nonagon',
  'decagon',
  'hendecagon',
  'dodecagon',
  'tridecagon',
  'tetradecagon',
  'pentadecagon',
  'hexadecagon',
  'heptadecagon',
  'octadecagon',
  'enneadecagon',
  'icosagon',
];

const tens = [
  null,
  null,
  'icosi',
  'triaconta',
  'tetraconta',
  'pentaconta',
  'hexaconta',
  'heptaconta',
  'octaconta',
  'ennecaonta',
];

const ones = [
  '',
  'hena',
  'di',
  'tri',
  'tetra',
  'penta',
  'hexa',
  'hepta',
  'octa',
  'ennea',
];

export default function polygonName(sides: number): string {
  if (sides <= 20) {
    return names[sides] ?? 'unknown';
  }
  if (sides >= 100) return `${sides}-gon`;
  return `${tens[Math.floor(sides / 10)]}${ones[sides % 10]}gon`;
}

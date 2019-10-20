import { toGuidelimeStep } from '../adapter';

test('Tame step shows pet name', () => {
  const tameStep = [
    '',
    'Tame',
    'OTU',
    'H',
    '',
    '',
    '',
    '',
    '',
    'Prairie Wolf Alpha',
    '2960',
    '',
    '~67, 58',
    'mulgore',
    '',
    '',
    '',
  ];

  const petName = 'Prairie Wolf Alpha';
  const guidelimeLine = toGuidelimeStep(tameStep);
  expect(guidelimeLine).toContain(petName);
});

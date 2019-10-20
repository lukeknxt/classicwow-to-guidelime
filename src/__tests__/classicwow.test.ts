import { getLevelingSteps } from '../classicwow';
import * as fs from 'fs';

const levelingData = JSON.parse(fs.readFileSync(__dirname + '/../resources/horde.json', 'utf-8'));

test('Filtering removes non-specific class steps (regression #3)', () => {
  const steps = getLevelingSteps('priest', 'troll', levelingData);
  Object.keys(steps).forEach(levelBracket => {
    expect(
      steps[levelBracket].filter(step => {
        step[1].includes('Tame');
      })
    ).toHaveLength(0);
  });
});

test('Filtering keeps relevant class-specific steps (regression #3)', () => {
  const steps = getLevelingSteps('hunter', 'troll', levelingData);
  expect(
    steps[Object.keys(steps)[0]].filter(step => step[1].includes('Tame')).length
  ).toBeGreaterThan(0);
});

import * as Adapter from './adapter';
import * as ClassicWow from './classicwow';

export type GuidelimeGuide = { [partName: string]: Array<string> };

export function getGuideTitle(wowRace: string, wowClass: string): string {
  const wowRaceCapital = wowRace.charAt(0).toUpperCase() + wowRace.substring(1).toLowerCase();
  const wowClassCapital = wowClass.charAt(0).toUpperCase() + wowClass.substring(1).toLowerCase();
  return wowRaceCapital + wowClassCapital;
}

export function generateGuide(wowRace: string, wowClass: string): GuidelimeGuide {
  try {
    const levelingSteps = ClassicWow.getLevelingSteps(wowRace, wowClass);
    const header = 'Guidelime.registerGuide([[';
    const footer = `]], 'Guidelime_${getGuideTitle(wowRace, wowClass)}')`;
    return Object.keys(levelingSteps).reduce((parts, levelBracket, i, levelBrackets) => {
      const nextLevelBracket = levelBrackets[i + 1];
      const titles = [`[N ${levelBracket} classicwow.live ${wowRace} ${wowClass}]`];
      if (typeof nextLevelBracket !== 'undefined') {
        titles.push(`[NX ${nextLevelBracket} classicwow.live ${wowRace} ${wowClass}]`);
      }
      const steps = [
        header,
        ...titles,
        ...levelingSteps[levelBracket].map(Adapter.toGuidelimeStep),
        footer,
      ];
      const fileName = `${levelBracket}.lua`;
      parts[fileName] = steps;
      return parts;
    }, {});
  } catch (e) {
    console.log('Something went wrong ', e);
  }
}

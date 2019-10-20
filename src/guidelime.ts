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
    return Object.keys(levelingSteps).reduce((parts, levelBracket) => {
      const steps = [
        header,
        `[N ${levelBracket} classicwow.live ${wowRace} ${wowClass} levels ${levelBracket}]`,
        `[NX ${levelBracket} classicwow.live ${wowRace} ${wowClass} levels ${levelBracket}]`,
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

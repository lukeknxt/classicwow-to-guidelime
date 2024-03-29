import * as Adapter from "./adapter";
import * as ClassicWow from "./classicwow";

export type GuidelimeGuide = { [partName: string]: Array<string> };

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

export function getGuideTitle(wowRace: string, wowClass: string): string {
  return capitalize(wowRace) + capitalize(wowClass);
}

export function generateGuide(
  wowRace: ClassicWow.Race,
  wowClass: ClassicWow.Class,
): GuidelimeGuide {
  try {
    const levelingSteps = ClassicWow.getLevelingSteps(wowRace, wowClass);
    const header = "Guidelime.registerGuide([[";
    const footer = `]], 'Guidelime_${getGuideTitle(wowRace, wowClass)}')`;
    return Object.keys(levelingSteps).reduce(
      (parts, levelBracket, i, levelBrackets) => {
        const nextLevelBracket = levelBrackets[i + 1];
        const titles = [
          `[GA ${capitalize(wowRace)},${capitalize(wowClass)}]`,
          `[N ${levelBracket} Guide]`,
        ];
        if (typeof nextLevelBracket !== "undefined") {
          titles.push(`[NX ${nextLevelBracket} Guide]`);
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
      },
      {} as GuidelimeGuide,
    );
  } catch (e) {
    console.log("Something went wrong generating guide.", e);
    throw e;
  }
}

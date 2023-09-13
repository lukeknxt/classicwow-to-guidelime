import { readFileSync } from "fs";
import path from "path";

export type LevelingData = {
  [section: string]: { [step: string]: Array<Array<string>> };
};

export const RACES = <const>[
  "undead",
  "tauren",
  "orc",
  "troll",
  "dwarf",
  "nightelf",
  "gnome",
  "human",
];

export const CLASSES = <const>[
  "mage",
  "priest",
  "warrior",
  "warlock",
  "paladin",
  "hunter",
  "rogue",
  "druid",
  "shaman",
];

export const FACTIONS = <const>["horde", "alliance"];

export type Class = (typeof CLASSES)[number];

export type Faction = (typeof FACTIONS)[number];

export type Race = (typeof RACES)[number];

const raceZoneFaction: Record<Race, [string, Faction]> = {
  undead: ["tirisfal", "horde"],
  tauren: ["mulgore", "horde"],
  orc: ["durotar", "horde"],
  troll: ["durotar", "horde"],
  dwarf: ["dunmorogh", "alliance"],
  nightelf: ["teldrassil", "alliance"],
  gnome: ["dunmorogh", "alliance"],
  human: ["elwynnforest", "alliance"],
};

export const classes: Record<Class, string> = {
  mage: "M",
  priest: "Pr",
  warrior: "W",
  warlock: "L",
  paladin: "Pa",
  hunter: "H",
  rogue: "R",
  druid: "D",
  shaman: "S",
};

export const races: Record<Race, string> = {
  orc: "O",
  troll: "T",
  tauren: "C",
  undead: "U",
  human: "H",
  dwarf: "D",
  gnome: "G",
  nightelf: "N",
};

export const raceClassMapping: Record<Race, Class[]> = {
  orc: ["hunter", "rogue", "shaman", "warlock", "warrior"],
  troll: ["hunter", "mage", "priest", "rogue", "shaman", "warrior"],
  tauren: ["druid", "hunter", "shaman", "warrior"],
  undead: ["mage", "priest", "rogue", "warlock", "warrior"],
  human: ["mage", "paladin", "priest", "rogue", "warlock", "warrior"],
  dwarf: ["hunter", "paladin", "priest", "rogue", "warrior"],
  gnome: ["mage", "rogue", "warlock", "warrior"],
  nightelf: ["druid", "hunter", "priest", "rogue", "warrior"],
};

function getFileNames(wowRace: Race): [string, string] {
  const [startZone, faction] = raceZoneFaction[wowRace];
  return [`${startZone}.json`, `${faction}.json`];
}

function loadResource(fileName: string): string {
  const resourcePath = path.join(import.meta.dir, "resources", fileName);
  return readFileSync(resourcePath, "utf-8");
}

function appendLevelingData(
  first: LevelingData,
  second: LevelingData,
): LevelingData {
  const finalSection = Object.keys(first).length;
  Object.keys(second).forEach((sectionNumber) => {
    const steps = second[sectionNumber];
    first[finalSection + Number(sectionNumber)] = steps;
  });
  return first;
}

function loadLevelingData(wowRace: Race): LevelingData {
  const [startZoneFile, factionFile] = getFileNames(wowRace);
  const startZoneLevelingData = JSON.parse(loadResource(startZoneFile));
  const factionLevelingData = JSON.parse(loadResource(factionFile));
  const levelingData = appendLevelingData(
    startZoneLevelingData,
    factionLevelingData,
  );
  return levelingData;
}

function filterSteps(
  wowClass: Class,
  wowRace: Race,
  steps: Array<Array<string>>,
): Array<Array<string>> {
  const forRaceIdx = 2;
  const forClassIdx = 3;
  const classCode = classes[wowClass];
  const raceCode = races[wowRace];
  return steps.filter((step: Array<string>): boolean => {
    const containsRace = step[forRaceIdx].includes(raceCode);
    const containsClass = step[forClassIdx].includes(classCode);
    return (
      (containsClass && step[forRaceIdx] === "") ||
      (containsRace && step[forClassIdx] === "") ||
      (containsRace && containsClass) ||
      (step[forClassIdx] === "" && step[forRaceIdx] === "")
    );
  });
}

/**
 * Converts the default section/steps structure of the classic.wow
 * guides into a friendlier structure where steps are sectioned
 * by level.
 *
 * @param wowRace the wow race to parse steps for
 * @param wowClass the wow class to parse steps for
 * @returns A map where keys are the level brackets and values are an array of steps.
 */
export function getLevelingSteps(
  wowRace: Race,
  wowClass: Class,
): { [bracket: string]: Array<Array<string>> } {
  const levelingData = loadLevelingData(wowRace);

  const stepsByLevel: { [level: string]: Array<Array<string>> } = {};
  let substepsInLevel: Array<Array<string>> = [];
  Object.values(levelingData).forEach((steps) => {
    Object.values(steps).forEach((step) => {
      step.forEach((substep) => {
        substepsInLevel.push(substep);
        if (substep[1].includes("DING ")) {
          const stepsLevel = Number(substep[1].replace("DING ", "")) - 1;
          stepsByLevel[stepsLevel] = filterSteps(
            wowClass,
            wowRace,
            substepsInLevel,
          );
          substepsInLevel = [];
        }
      });
    });
  });

  const bracketedSteps = {} as Record<string, string[][]>;
  let startLevel = "1";
  let endLevel = "0";
  let substeps = [] as string[][];
  Object.keys(stepsByLevel).forEach((level) => {
    const steps = stepsByLevel[level];
    substeps = substeps.concat(steps);
    if (substeps.length > 300 || level === "59") {
      endLevel = (Number(level) + 1).toString();
      bracketedSteps[`${startLevel}-${endLevel}`] = substeps;
      startLevel = endLevel;
      substeps = [];
    }
  });

  return bracketedSteps;
}

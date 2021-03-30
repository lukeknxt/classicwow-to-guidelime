import * as fs from 'fs';

export type LevelingData = { [section: string]: { [step: string]: Array<Array<string>> } };
export type StepsByLevel = { [level: string]: Array<Array<string>> };

const raceZoneFaction = {
  undead: ['tirisfal', 'horde'],
  tauren: ['mulgore', 'horde'],
  orc: ['durotar', 'horde'],
  troll: ['durotar', 'horde'],
  dwarf: ['dunmorogh', 'alliance'],
  nightelf: ['teldrassil', 'alliance'],
  gnome: ['dunmorogh', 'alliance'],
  human: ['elwynnforest', 'alliance'],
};

export const classes = {
  mage: 'M',
  priest: 'Pr',
  warrior: 'W',
  warlock: 'L',
  paladin: 'Pa',
  hunter: 'H',
  rogue: 'R',
  druid: 'D',
  shaman: 'S',
};

export const races = {
  orc: 'O',
  troll: 'T',
  tauren: 'C',
  undead: 'U',
  human: 'H',
  dwarf: 'D',
  gnome: 'G',
  nightelf: 'N',
};

export const raceClassMapping = {
  orc: ['hunter', 'rogue', 'shaman', 'warlock', 'warrior'],
  troll: ['hunter', 'mage', 'priest', 'rogue', 'shaman', 'warrior'],
  tauren: ['druid', 'hunter', 'shaman', 'warrior'],
  undead: ['mage', 'priest', 'rogue', 'warlock', 'warrior'],
  human: ['mage', 'paladin', 'priest', 'rogue', 'warlock', 'warrior'],
  dwarf: ['hunter', 'paladin', 'priest', 'rogue', 'warrior'],
  gnome: ['mage', 'rogue', 'warlock', 'warrior'],
  nightelf: ['druid', 'hunter', 'priest', 'rogue', 'warrior'],
};

function getFileNames(wowRace: string): [string, string] {
  const [startZone, faction] = raceZoneFaction[wowRace];
  return [`${startZone}.json`, `${faction}.json`];
}

function loadResource(fileName: string): string {
  return fs.readFileSync(__dirname + '/resources/' + fileName, 'utf-8');
}

function loadLevelingData(wowRace: string, startingZone: boolean): LevelingData {
  const [startZoneFile, factionFile] = getFileNames(wowRace);
  return startingZone
    ? JSON.parse(loadResource(startZoneFile))
    : JSON.parse(loadResource(factionFile));
}

function filterSteps(
  wowClass: string,
  wowRace: string,
  steps: Array<Array<string>>
): Array<Array<string>> {
  const forRaceIdx = 2;
  const forClassIdx = 3;
  const classCode = classes[wowClass];
  const raceCode = races[wowRace];
  return steps.filter((step: Array<string>): boolean => {
    const containsRace = step[forRaceIdx].includes(raceCode);
    const containsClass = step[forClassIdx].includes(classCode);
    return (
      (containsClass && step[forRaceIdx] === '') ||
      (containsRace && step[forClassIdx] === '') ||
      (containsRace && containsClass) ||
      (step[forClassIdx] === '' && step[forRaceIdx] === '')
    );
  });
}

/**
 * Converts the default section/steps structure of the classic.wow
 * guides into a friendlier structure where steps are sectioned
 * by level.
 *
 * @param levelingData the parsed classic.wow json data
 * @param wowClass the wow class to parse steps for
 * @param wowRace the wow race to parse steps for
 * @returns A map where keys are the level and values are an array of steps for that level.
 */
function levelingStepsByZone(
  levelingData: LevelingData,
  wowClass: string,
  wowRace: string
): StepsByLevel {
  const stepsByLevel: StepsByLevel = {};
  let substepsInLevel = [];
  Object.values(levelingData).forEach(steps => {
    Object.values(steps).forEach(step => {
      step.forEach(substep => {
        substepsInLevel.push(substep);
        if (substep[1].includes('DING ')) {
          const stepsLevel = Number(substep[1].replace('DING ', '')) - 1;
          stepsByLevel[stepsLevel] = filterSteps(wowClass, wowRace, substepsInLevel);
          substepsInLevel = [];
        }
      });
    });
  });
  return stepsByLevel;
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
  wowRace: string,
  wowClass: string
): { [bracket: string]: Array<Array<string>> } {
  const startingLevelingData = loadLevelingData(wowRace, true);
  const startingStepsByLevel = levelingStepsByZone(startingLevelingData, wowClass, wowRace);

  const bracketedSteps = {};
  let startingZoneStartLevel = '1';
  const startingZoneEndLevel = Object.keys(startingStepsByLevel).length.toString();
  let bracketEndLevel = '0';
  let substeps = [];
  Object.keys(startingStepsByLevel).forEach(level => {
    const steps = startingStepsByLevel[level];
    substeps = substeps.concat(steps);
    if (substeps.length > 300 || level === startingZoneEndLevel) {
      bracketEndLevel = (Number(level) + 1).toString();
      bracketedSteps[`${startingZoneStartLevel}-${bracketEndLevel}`] = substeps;
      startingZoneStartLevel = bracketEndLevel;
      substeps = [];
    }
  });

  const factionLevelingData = loadLevelingData(wowRace, false);
  const factionStepsByLevel = levelingStepsByZone(factionLevelingData, wowClass, wowRace);
  let factionZoneStartingLevel = Object.keys(factionStepsByLevel)[0];
  Object.keys(factionStepsByLevel).forEach(level => {
    const steps = factionStepsByLevel[level];
    substeps = substeps.concat(steps);
    if (substeps.length > 300 || level === '59') {
      bracketEndLevel = (Number(level) + 1).toString();
      bracketedSteps[`${factionZoneStartingLevel}-${bracketEndLevel}`] = substeps;
      factionZoneStartingLevel = bracketEndLevel;
      substeps = [];
    }
  });
  return bracketedSteps;
}

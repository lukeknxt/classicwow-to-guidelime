export const raceZoneFaction = {
  undead: ["tirisfal", "horde"],
  tauren: ["mulgore", "horde"],
  orc: ["durotar", "horde"],
  troll: ["durotar", "horde"],
  dwarf: ["dunmorogh", "alliance"],
  nightelf: ["teldrassil", "alliance"],
  gnome: ["dunmorogh", "alliance"],
  human: ["elwynnforest", "alliance"]
};

export const classes = {
  mage: "M",
  priest: "Pr",
  warrior: "W",
  warlock: "L",
  paladin: "Pa",
  hunter: "H",
  rogue: "R",
  druid: "D",
  shaman: "S"
};

export const races = {
  orc: "O",
  troll: "T",
  tauren: "C",
  undead: "U",
  human: "H",
  dwarf: "D",
  gnome: "G",
  nightelf: "N"
};

export type LevelingData = { [section: string]: { [step: string]: Array<Array<string>> } };

function filterSteps(wowClass: string, wowRace: string, steps: Array<Array<string>>): Array<Array<string>> {
  const forRaceIdx = 2;
  const forClassIdx = 3;
  const classCode = classes[wowClass];
  const raceCode = races[wowRace];
  return steps.filter((step: Array<string>): boolean => {
    const containsRace = step[forRaceIdx].includes(raceCode);
    const containsClass = step[forClassIdx].includes(classCode);
    return containsClass || containsRace || ("" === step[forClassIdx] && "" === step[forRaceIdx]);
  });
}

export function getLevelingSteps(
  wowClass: string,
  wowRace: string,
  levelingData: LevelingData
): { [bracket: string]: Array<Array<string>> } {
  const stepsByLevel: { [level: string]: Array<Array<string>> } = {};
  let substepsInLevel = [];
  Object.values(levelingData).forEach(steps => {
    Object.values(steps).forEach(step => {
      step.forEach(substep => {
        substepsInLevel.push(substep);
        if (substep[1].includes("DING ")) {
          const stepsLevel = Number(substep[1].replace("DING ", "")) - 1;
          stepsByLevel[stepsLevel] = filterSteps(wowClass, wowRace, substepsInLevel);
          substepsInLevel = [];
        }
      });
    });
  });

  const bracketedSteps = {};
  let startLevel = "1";
  let endLevel = "0";
  let substeps = [];
  Object.keys(stepsByLevel).forEach(level => {
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

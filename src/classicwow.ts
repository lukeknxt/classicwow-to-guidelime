
export const raceZoneFaction = {
    undead: ['tirisfal', 'horde'],
    tauren: ['mulgore', 'horde'],
    orc: ['durotar', 'horde'],
    troll: ['durotar', 'horde'],
    dwarf: ['dunmorogh', 'alliance'],
    nightelf: ['teldrassil', 'alliance'],
    gnome: ['dunmorogh', 'alliance'],
    human: ['elwynnforest', 'alliance']
}

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
}

export const races = {
    orc: "O",
    troll: "T",
    tauren: "C",
    undead: "U",
    human: "H",
    dwarf: "D",
    gnome: "G",
    nightelf: "N"
}

export type LevelingData = { [section: string]: { [step: string]: Array<Array<string>> } }

function filterSteps(wowClass: string, wowRace: string, t: Array<Array<string>>) {
    const forRaceIdx = 2;
    const forClassIdx = 3;
    const classCode = classes[wowClass];
    const raceCode = races[wowRace];
    return t.filter((step: Array<string>): boolean => {
        const containsRace = step[forRaceIdx].includes(raceCode);
        const containsClass = step[forClassIdx].includes(classCode);
        return containsClass
            || containsRace
            || "" === step[forClassIdx] && "" === step[forRaceIdx]
    });
}

export function getLevelingSteps(wowClass: string, wowRace: string, levelingData: LevelingData): LevelingData {
    const newSections = {};
    let newSectionIndex = 0;
    Object.keys(levelingData).forEach(sectionIndex => {
        const newSteps = {};
        const steps = levelingData[sectionIndex];
        let stepIndex = 0;
        Object.keys(steps).forEach(stepNum => {
            const substeps = steps[stepNum]
            const filteredSteps = filterSteps(wowClass, wowRace, substeps);
            if (filteredSteps.length > 0) {
                newSteps[++stepIndex] = filteredSteps
            }
        })
        newSections[++newSectionIndex] = newSteps
    })
    return newSections;
}

type GuidelimeStep = string;

export function toGuidelimeStep(classicWowStep: Array<string>): GuidelimeStep {
  const actionIdx = 1;
  const questIdIdx = 6;
  const amountIdx = 7;
  const questNameIdx = 8;
  const npcName = 9;
  const coordIdx = 12;
  const zone = 13;
  const xpIdx = 14;
  // const requirement = 15;
  const extraNotes = 16;

  const xpLine = `${classicWowStep[xpIdx]}`;
  const actionLine = classicWowStep[actionIdx];

  const toTitleCaseNoDash = (str: string): string =>
    str
      .toLowerCase()
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

  const sanitizeCoords = (coords: string): string => {
    const xy = coords.split(',');
    const x = (Number(xy[0]) || Number(xy[0].slice(1))).toFixed(1);
    const y = (Number(xy[1]) || Number(xy[1].slice(1))).toFixed(1);
    return [x, y].join(',');
  };

  const coordsLine = (): string => {
    const coords = classicWowStep[coordIdx];
    if (coords === '') {
      return '';
    } else {
      const location = toTitleCaseNoDash(classicWowStep[zone]);
      return `[G ${sanitizeCoords(coords)} ${location}]`;
    }
  };

  const getAmount = (): string => {
    if (
      ['Buy', 'Bank Deposit', 'Bank Withdrawal', 'Save', 'Disenchant', 'Craft', 'Grind'].includes(
        actionLine
      ) &&
      classicWowStep[amountIdx] !== ''
    ) {
      return `(Qty: ${classicWowStep[amountIdx]})`;
    } else {
      return '';
    }
  };

  const trimSqBrackets = (str: string): string => str.replace(/[[|\]]/g, '');

  const removeFirstWord = (str: string): string => str.replace(/^([^ ]+ )/, '');

  const questKeys = {
    'Hand In': 'T',
    'Hand In*': 'T',
    'Quick Hand In': 'T',
    'Quick Hand In*': 'T',
    'Pick Up': 'A',
    'Pick Up*': 'A',
    'Accept Item Quest': 'A',
    'Accept Item Quest*': 'A',
    Skip: 'S',
    'Complete Quest': 'C',
    'Complete Objective': 'C',
  };

  const getNpc = (): string => {
    if (classicWowStep[npcName] !== '') {
      if (
        [
          'Loot',
          'Loot*',
          'Get',
          'Buy',
          'Vendor',
          'Repair',
          'Vendor + Repair',
          'Train',
          'Bank Deposit',
          'Bank Withdrawal',
          'Hand In',
          'Hand In*',
          'Quick Hand In',
          'Quick Hand In*',
          'Pick Up',
          'Pick Up*',
        ].includes(actionLine)
      ) {
        return `(${classicWowStep[npcName]})`;
      } else if (actionLine === 'Tame') {
        return `${classicWowStep[npcName]}`;
      }
    }
    return '';
  };

  const getObjective = (): string => {
    if (['Complete Objective', 'Progress Objective', 'Progress Quest'].includes(actionLine)) {
      const objective = trimSqBrackets(classicWowStep[npcName]);
      return objective ? `(${objective})` : '';
    } else {
      return '';
    }
  };

  const getNotes = (): string => {
    if (classicWowStep[extraNotes] !== '') {
      return `(${trimSqBrackets(classicWowStep[extraNotes])})`;
    } else {
      return '';
    }
  };

  const getGrindLine = (): string => {
    const step = classicWowStep[questNameIdx];
    const partialLevelRe = new RegExp('^to ([0-9]*) / [0-9]* L([0-9]*)$');
    const fullLevelRe = new RegExp('^to ([0-9]*)$');

    const partialLevelMatch = step.match(partialLevelRe);
    if (partialLevelMatch) {
      const [, xp, lvl] = partialLevelMatch;
      return `to [XP${lvl}+${xp} ${xp}xp into ${lvl}]`;
    }

    const fullLevelMatch = step.match(fullLevelRe);
    if (fullLevelMatch) {
      const [, lv] = fullLevelMatch;
      return `to [XP${lv}]`;
    }

    return `${trimSqBrackets(step)}`;
  };

  const getOtherLine = (): string => {
    const step = classicWowStep[questNameIdx];

    if (actionLine === 'Set Hearth') {
      return `at [S ${removeFirstWord(step)}]`;
    } else if (actionLine === 'Hearth') {
      return `to [H ${removeFirstWord(step)}]`;
    } else if (actionLine === 'Fly') {
      return `to [F ${removeFirstWord(step)}]`;
    } else if (actionLine === 'Get Flight Path') {
      return `at [P ${removeFirstWord(step)}]`;
    } else if (actionLine === 'Grind') {
      return getGrindLine();
    }
    return `${trimSqBrackets(step)}`;
  };

  const getQuestLine = (): string => {
    const questKey = questKeys[actionLine];
    if (typeof questKey === 'undefined') {
      return getOtherLine();
    }

    const questId = trimSqBrackets(classicWowStep[questIdIdx]);
    if (questId !== '') {
      const item = ['Accept Item Quest', 'Accept Item Quest*'].includes(actionLine)
        ? `(Item: ${trimSqBrackets(classicWowStep[npcName])})`
        : '';
      return `[Q${questKey}${questId}] ${item}`;
    } else {
      return `${trimSqBrackets(classicWowStep[questNameIdx])}`;
    }
  };

  const getStepIcon = (): string => {
    if (actionLine === 'Vendor') {
      return '[V]';
    } else if (actionLine === 'Repair') {
      return '[R]';
    } else if (actionLine === 'Vendor + Repair') {
      return '[V][R]';
    } else if (actionLine === 'Train') {
      return '[T]';
    }
    return '';
  };

  return [
    actionLine,
    getStepIcon(),
    getQuestLine(),
    getAmount(),
    getNpc(),
    getObjective(),
    coordsLine(),
    xpLine,
    getNotes(),
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

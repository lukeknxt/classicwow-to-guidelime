type GuidelimeStep = string;

export function toGuidelimeStep(classicWowStep: Array<string>): GuidelimeStep {
  const actionIdx = 1;
  const raceIdx = 2;
  const classIdx = 3;
  const questIdIdx = 6;
  const amountIdx = 7;
  const questNameIdx = 8; // location for set hearth
  const npcName = 9;
  const npcId = 10;
  const coordIdx = 12;
  const zone = 13;
  const xpIdx = 14;
  const requirement = 15;
  const extraNotes = 16;

  const toTitleCaseNoDash = (str: string): string =>
    str
      .toLowerCase()
      .split("-")
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");

  const coordsLine = (): string => {
    const coords = classicWowStep[coordIdx];
    if (coords === "") {
      return "";
    } else {
      const location = toTitleCaseNoDash(classicWowStep[zone]);
      return `[G ${coords} ${location}]`;
    }
  };

  const getAmount = (): string => {
    if ((actionLine === "Buy" || actionLine === "Bank Deposit") && classicWowStep[amountIdx] !== "") {
      return `(Qty: ${classicWowStep[amountIdx]})`;
    } else {
      return "";
    }
  };

  const trimSqBrackets = (str: string): string => {
    return str.replace(/[\[|\]]/g, "");
  };

  const xpLine = `${classicWowStep[xpIdx]}`;
  const actionLine = classicWowStep[actionIdx];
  const questKeys = {
    "Hand In": "T",
    "Hand In*": "T",
    "Quick Hand In": "T",
    "Quick Hand In*": "T",
    "Pick Up": "A",
    "Pick Up*": "A",
    "Accept Item Quest": "A",
    "Accept Item Quest*": "A",
    "Skip for now": "S",
    Skip: "S",
    "Complete Quest": "C"
  };

  const hearth = () => {
    if (actionLine === "Set Hearth") {
      const location = classicWowStep[questNameIdx].replace("at ", "");
      return `[S ${location}]`;
    } else if (actionLine === "Hearth") {
      const location = classicWowStep[questNameIdx].replace("to ", "");
      return `[H ${location}]`;
    } else {
      return "";
    }
  };

  const getNpc = () => {
    if (actionLine === "Loot" && classicWowStep[npcName] !== "") {
      return `from ${classicWowStep[npcName]}`;
    } else {
      return "";
    }
  };

  const getObjective = () => {
    if (actionLine === "Complete Objective") {
      const objective = trimSqBrackets(classicWowStep[npcName]);
      return `(${objective})`;
    } else {
      return "";
    }
  };

  const getNotes = () => {
    if (classicWowStep[extraNotes] !== "") {
      return `(${trimSqBrackets(classicWowStep[extraNotes])})`;
    } else {
      return "";
    }
  };

  const getQuestLine = () => {
    const questKey = questKeys[actionLine];
    if (typeof questKey === "undefined") {
      return `${trimSqBrackets(classicWowStep[questNameIdx])}`;
    } else {
      const questId = trimSqBrackets(classicWowStep[questIdIdx]);
      if (questId !== "") {
        const item = actionLine === "Accept Item Quest" ? `(Item: ${trimSqBrackets(classicWowStep[npcName])})` : "";
        return `[Q${questKey}${questId}] ${item}`;
      } else {
        return `${trimSqBrackets(classicWowStep[questNameIdx])}`;
      }
    }
  };

  return [actionLine, getQuestLine(), getAmount(), getNpc(), getObjective(), hearth(), coordsLine(), xpLine, getNotes()]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

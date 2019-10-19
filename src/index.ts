import * as fs from 'fs';
import { toGuidelimeStep } from './adapter';
import * as ClassicWow from './classicwow';
import { LevelingData } from './classicwow';

import JSZip = require('jszip');

type GuidelimeGuide = { [partName: string]: Array<string> };

function writeTocFile(
  wowRace: string,
  wowClass: string,
  title: string,
  dir: string,
  partList: Array<string>
): void {
  const toc = [
    `## Title: Guidelime_${title}`,
    '## Author: lukeknoot',
    '## Version: 0.1.0',
    '## Interface: 11302',
    '## Dependencies: Guidelime',
    `## Notes: Guide for leveling a ${wowRace} ${wowClass}`,
    '',
  ]
    .concat(partList)
    .join('\n');

  fs.writeFileSync(`${dir}/Guidelime_${title}.toc`, toc);
}

function getFileNames(wowRace: string): [string, string] {
  const [startZone, faction] = ClassicWow.raceZoneFaction[wowRace];
  return [`${startZone}.json`, `${faction}.json`];
}

function loadResource(fileName: string): string {
  return fs.readFileSync(__dirname + '/resources/' + fileName, 'utf-8');
}

function writeGuide(guide: GuidelimeGuide, dir: string): void {
  Object.keys(guide).forEach(fileName => {
    const partLines = guide[fileName];
    const content = `${partLines.join('\n')}`;
    fs.writeFileSync(`${dir}/${fileName}`, content);
  });
}

function appendLevelingData(first: LevelingData, second: LevelingData): LevelingData {
  const finalSection = Object.keys(first).length;
  Object.keys(second).forEach(sectionNumber => {
    const steps = second[sectionNumber];
    first[finalSection + Number(sectionNumber)] = steps;
  });
  return first;
}

function generateGuide(wowRace: string, wowClass: string, title: string): GuidelimeGuide {
  try {
    const [startZoneFile, factionFile] = getFileNames(wowRace);
    const startZoneLevelingData = JSON.parse(loadResource(startZoneFile));
    const factionLevelingData = JSON.parse(loadResource(factionFile));
    const levelingData = appendLevelingData(startZoneLevelingData, factionLevelingData);
    const levelingSteps = ClassicWow.getLevelingSteps(wowClass, wowRace, levelingData);
    const header = 'Guidelime.registerGuide([[';
    const footer = `]], 'Guidelime_${title}')`;
    return Object.keys(levelingSteps).reduce((parts, levelBracket) => {
      const steps = [
        header,
        `[N ${levelBracket} classicwow.live ${wowRace} ${wowClass} levels ${levelBracket}]`,
        `[NX ${levelBracket} classicwow.live ${wowRace} ${wowClass} levels ${levelBracket}]`,
        ...levelingSteps[levelBracket].map(toGuidelimeStep),
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

function createDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeZip(dir: string, title: string): void {
  const zip = new JSZip();
  const guideFolder = zip.folder(`Guidelime_${title}`);
  const files = fs.readdirSync(dir, 'utf-8');
  files.forEach(f => {
    guideFolder.file(f, fs.readFileSync(`${dir}/${f}`));
  });
  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(`${dir}.zip`))
    .on('finish', function() {
      console.log('Done');
    });
}

if (process.argv.length < 4) {
  console.log('Please provide race and class to generate Guidelime guide for.');
} else {
  const wowRace = process.argv[2].toLowerCase();
  const wowClass = process.argv[3].toLowerCase();
  if (typeof ClassicWow.classes[wowClass] === 'undefined') {
    console.log(`Class "${wowClass}" is invalid`);
  } else if (typeof ClassicWow.races[wowRace] === 'undefined') {
    console.log(`Race "${wowRace}" is invalid`);
  } else {
    console.log('Generating Guidelime guide for ' + wowRace + ' ' + wowClass);
    const wowRaceCapital = wowRace.charAt(0).toUpperCase() + wowRace.substring(1);
    const wowClassCapital = wowClass.charAt(0).toUpperCase() + wowClass.substring(1);
    const title = wowRaceCapital + wowClassCapital;
    const guide = generateGuide(wowRace, wowClass, title);
    const dir = `${__dirname}/tmp/Guidelime_${title}`;
    createDir(dir);
    writeGuide(guide, dir);
    writeTocFile(wowRaceCapital, wowClassCapital, title, dir, Object.keys(guide));
    writeZip(dir, title);
  }
}

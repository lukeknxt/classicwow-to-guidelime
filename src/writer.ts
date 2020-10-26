import * as fs from 'fs';
import { getGuideTitle, GuidelimeGuide } from './guidelime';
import * as JSZip from 'jszip';

function writeTocFile(
  wowRace: string,
  wowClass: string,
  dir: string,
  partList: Array<string>
): void {
  const toc = [
    `## Title: Guidelime_${getGuideTitle(wowRace, wowClass)}`,
    '## Author: lukeknoot',
    '## Version: 0.1.0',
    '## Interface: 11302',
    '## Dependencies: Guidelime',
    `## Notes: Guide for leveling a ${wowRace} ${wowClass}`,
    '',
  ]
    .concat(partList)
    .join('\n');

  fs.writeFileSync(`${dir}/Guidelime_${getGuideTitle(wowRace, wowClass)}.toc`, toc);
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
      console.log(`Wrote ${dir}.zip`);
    });
}

export function writeGuide(wowRace: string, wowClass: string, guide: GuidelimeGuide): void {
  const dir = `${__dirname}/tmp/Guidelime_${getGuideTitle(wowRace, wowClass)}`;
  createDir(dir);

  Object.keys(guide).forEach(fileName => {
    const partLines = guide[fileName];
    const content = `${partLines.join('\n')}`;
    fs.writeFileSync(`${dir}/${fileName}`, content);
  });

  writeTocFile(wowRace, wowClass, dir, Object.keys(guide));
  writeZip(dir, getGuideTitle(wowRace, wowClass));
}

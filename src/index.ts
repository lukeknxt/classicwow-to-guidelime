import * as ClassicWow from './classicwow';
import { toGuidelimeStep } from './adapter';
import { LevelingData } from './classicwow';

const fs = require('fs');

type GuidelimeGuide = { [partName: string]: Array<string> }

function writeTocFile(title: string, dir: string, partList: Array<string>): void {
    const toc = [
        `## Title: Guidelime_${title}`,
        "## Author: lukeknoot",
        "## Version: 0.1.0",
        "## Interface: 11302",
        "## Dependencies: Guidelime",
        `## Notes: Guide for leveling a ${title}`,
        ""
    ].concat(partList).join('\n')

    fs.writeFileSync(`${dir}/Guidelime_${title}.toc`, toc, function (err) {
        if (err) throw err;
        console.log(`Wrote ${title}.toc`);
    });
}

function getFileNames(wowRace: string): [string, string] {
    const [startZone, faction] = ClassicWow.raceZoneFaction[wowRace];
    return [`./resources/${startZone}.json`, `./resources/${faction}.json`];
}

function writeGuide(guide: GuidelimeGuide, dir: string): void {
    Object.keys(guide).forEach(fileName => {
        const partLines = guide[fileName];
        const content = `${partLines.join("\n")}`;
        fs.writeFileSync(`${dir}/${fileName}`, content, function (err) {
            if (err) throw err;
            console.log(`Wrote ${fileName}`);
        });
    })
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
        const startZoneLevelingData = require(startZoneFile);
        const factionLevelingData = require(factionFile)
        const levelingData = appendLevelingData(startZoneLevelingData, factionLevelingData)
        const levelingSteps = ClassicWow.getLevelingSteps(wowClass, wowRace, levelingData);
        const header = 'Guidelime.registerGuide([[';
        const footer = `]], 'Guidelime_${title}')`;
        return Object.keys(levelingSteps).reduce((parts, sectionNum) => {
            const section = levelingSteps[sectionNum];
            const guidelimeSteps: Array<string> = Object.keys(section).reduce((acc: Array<string>, stepNum: string) => {
                const steps = section[stepNum];
                return acc.concat(steps.map(toGuidelimeStep));
            }, [header, `[N Part ${sectionNum}]`]);
            guidelimeSteps.push(footer);
            const fileName = `part${sectionNum}.lua`;
            parts[fileName] = guidelimeSteps;
            return parts;
        }, {})
    } catch (e) {
        console.log("Something went wrong ", e);
    }
}

function createDir(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

if (process.argv.length < 4) {
    console.log("Please provide race and class to generate Guidelime guide for.")
} else {
    const wowRace = process.argv[2];
    const wowClass = process.argv[3];
    if (typeof ClassicWow.classes[wowClass] === 'undefined') {
        console.log(`Class "${wowClass}" is invalid`)
    } else if (typeof ClassicWow.races[wowRace] === 'undefined') {
        console.log(`Race "${wowRace}" is invalid`)
    } else {
        console.log("Generating Guidelime guide for " + wowRace + " " + wowClass);
        const wowRaceCapital = wowRace.charAt(0).toUpperCase() + wowRace.substring(1);
        const wowClassCapital = wowClass.charAt(0).toUpperCase() + wowClass.substring(1);
        const title = wowRaceCapital + wowClassCapital;
        const guide = generateGuide(wowRace, wowClass, title);
        const dir = `${__dirname}/tmp/Guidelime_${title}`
        createDir(dir);
        writeGuide(guide, dir);
        writeTocFile(title, dir, Object.keys(guide));
        // TODO: zip up folder
    }
}

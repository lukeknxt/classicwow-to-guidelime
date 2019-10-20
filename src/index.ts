import * as ClassicWow from './classicwow';
import * as Writer from './writer';
import * as Guidelime from './guidelime';

if (process.argv.length !== 4) {
  console.log('Incorrect usage. Arguments must be in the format: <race> <class>');
  console.log('Example: yarn generateGuide human warrior');
} else {
  const wowRace = process.argv[2].toLowerCase();
  const wowClass = process.argv[3].toLowerCase();
  if (typeof ClassicWow.classes[wowClass] === 'undefined') {
    console.log(`Class "${wowClass}" is invalid`);
  } else if (typeof ClassicWow.races[wowRace] === 'undefined') {
    console.log(`Race "${wowRace}" is invalid`);
  } else if (!ClassicWow.raceClassMapping[wowRace].includes(wowClass)) {
    console.log(`Race "${wowRace}" can not be a "${wowClass}"`);
  } else {
    console.log('Generating Guidelime guide for ' + wowRace + ' ' + wowClass);
    const guide = Guidelime.generateGuide(wowRace, wowClass);
    Writer.writeGuide(wowRace, wowClass, guide);
    console.log('Finished');
  }
}

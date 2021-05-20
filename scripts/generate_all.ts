import * as Guidelime from '../src/guidelime';
import * as Writer from '../src/writer';
import * as ClassicWow from '../src/classicwow';

import * as fs from 'fs-extra';

console.log('Deleting old guides');

fs.removeSync(__dirname + '/../src/tmp');

Object.keys(ClassicWow.raceClassMapping).forEach((wowRace) => {
  const classes = ClassicWow.raceClassMapping[wowRace];
  classes.forEach((wowClass) => {
    console.log('Generating Guidelime guide for ' + wowRace + ' ' + wowClass);
    const guide = Guidelime.generateGuide(wowRace, wowClass);
    Writer.writeGuide(wowRace, wowClass, guide);
  });
});

console.log('Finished');

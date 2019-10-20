import * as Guidelime from '../src/guidelime';
import * as Writer from '../src/writer';

import * as fs from 'fs-extra';

const raceClassCombos = {
  human: ['warrior', 'paladin', 'rogue', 'priest', 'warlock'],
  dwarf: ['warrior', 'hunter', 'rogue', 'paladin', 'priest'],
  nightelf: ['warrior', 'hunter', 'rogue', 'priest', 'druid'],
  gnome: ['warrior', 'rogue', 'mage', 'warlock'],
  orc: ['warrior', 'rogue', 'hunter', 'warlock', 'shaman'],
  undead: ['warrior', 'rogue', 'priest', 'mage', 'warlock'],
  tauren: ['warrior', 'hunter', 'druid', 'shaman'],
  troll: ['warrior', 'hunter', 'rogue', 'shaman', 'priest', 'mage'],
};

console.log('Deleting old guides');

fs.removeSync(__dirname + '/../src/tmp');

Object.keys(raceClassCombos).forEach(wowRace => {
  const classes = raceClassCombos[wowRace];
  classes.forEach(wowClass => {
    console.log('Generating Guidelime guide for ' + wowRace + ' ' + wowClass);
    const guide = Guidelime.generateGuide(wowRace, wowClass);
    Writer.writeGuide(wowRace, wowClass, guide);
  });
});

console.log('Finished');

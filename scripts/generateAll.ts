import * as Guidelime from "../src/guidelime";
import * as Writer from "../src/writer";
import * as ClassicWow from "../src/classicwow";
import path from "path";
import fs from "fs";

function main() {
  console.log("Deleting old guides");

  fs.rmSync(path.join(import.meta.dir, "..", "src", "tmp"), {
    recursive: true,
    force: true,
  });

  ClassicWow.RACES.forEach((wowRace) => {
    const classes = ClassicWow.raceClassMapping[wowRace];
    classes.forEach((wowClass) => {
      console.log("Generating Guidelime guide for " + wowRace + " " + wowClass);
      const guide = Guidelime.generateGuide(wowRace, wowClass);
      Writer.writeGuide(wowRace, wowClass, guide);
    });
  });

  console.log("Finished");
}

main();

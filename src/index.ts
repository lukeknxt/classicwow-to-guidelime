import { exit } from "process";
import * as ClassicWow from "./classicwow";
import * as Guidelime from "./guidelime";
import * as Writer from "./writer";

const readAs = <T>(
  type: string,
  maybeType: string,
  options: ReadonlyArray<T>,
): T => {
  if (options.includes(maybeType as T)) {
    return maybeType as T;
  } else {
    console.log(`${type} is invalid. Options are ${options}`);
    exit(1);
  }
};

function main() {
  if (Bun.argv.length !== 4) {
    console.log(
      "Incorrect usage. Arguments must be in the format: <race> <class>",
    );
    console.log("Example: bun generateGuide human warrior");
  } else {
    const wowRace = readAs<ClassicWow.Race>(
      "Race",
      Bun.argv[2].toLowerCase(),
      ClassicWow.RACES,
    );
    const wowClass = readAs<ClassicWow.Class>(
      "Class",
      Bun.argv[3].toLowerCase(),
      ClassicWow.CLASSES,
    );
    if (!ClassicWow.raceClassMapping[wowRace].includes(wowClass)) {
      console.log(`Race "${wowRace}" can not be a "${wowClass}"`);
      exit(1);
    } else {
      console.log("Generating Guidelime guide for " + wowRace + " " + wowClass);
      const guide = Guidelime.generateGuide(wowRace, wowClass);
      Writer.writeGuide(wowRace, wowClass, guide);
      console.log("Finished");
    }
  }
}

main();

# classicwow-to-guidelime

[![Travis (.org)](https://img.shields.io/travis/lukeknoot/classicwow-to-guidelime?label=build)](https://travis-ci.org/lukeknoot/classicwow-to-guidelime)

A project to provide the convenience of [Guidelime](https://github.com/max-ri/Guidelime) with the sophistication of the [classicwow.live](https://classicwow.live/leveling) levelling guides.

## Setup

```
yarn install
```

## Usage

```
yarn run generateGuide <race> <class>
```

E.g.

```
yarn run generateGuide human warrior
```

The generated guide can then be found at `src/tmp/Guidelime_<Race><Class>` alongside a zip file that is generated for sharing convenience. Follow the instructions [here](https://github.com/max-ri/Guidelime/wiki/FAQ#when-i-have-downloaded-a-guide-module-where-should-i-install-it) to import this into Guidelime.

## Running Tests

```
yarn run test
```

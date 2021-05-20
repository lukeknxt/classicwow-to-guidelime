# classicwow-to-guidelime

[![Travis (.org)](https://img.shields.io/travis/lukeknoot/classicwow-to-guidelime?label=build)](https://travis-ci.org/lukeknoot/classicwow-to-guidelime)

A project to provide the convenience of [Guidelime](https://github.com/max-ri/Guidelime) with the sophistication of the [classicwow.live](https://classicwow.live/leveling) levelling guides.

## Installation

The latest guides available for download can be found [here](https://github.com/lukeknoot/classicwow-to-guidelime/releases).

Follow the [Guidelime instructions](https://github.com/max-ri/Guidelime/wiki/FAQ#when-i-have-downloaded-a-guide-module-where-should-i-install-it) to install them and make them available to the addon.

## Contributing

### Setup

Prerequisites
- Node v10+

```
npm install
```

### Usage

For a single guide:

```
npm run generateGuide <race> <class>
```

For all guides:

```
npm run generateAll
```

E.g.

```
npm run generateGuide human warrior
```

The generated guide can then be found at `src/tmp/Guidelime_<Race><Class>` alongside a zip file that is generated for sharing convenience.

### Running Tests

```
npm run test
```

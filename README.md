# classicwow-to-guidelime

![GitHub Actions Badge](https://github.com/lukeknxt/classicwow-to-guidelime/actions/workflows/main.yml/badge.svg)

A project to provide the convenience of [Guidelime](https://github.com/max-ri/Guidelime) with the sophistication of the [classicwow.live](https://classicwow.live/leveling) levelling guides.

## Installation

The latest guides available for download can be found [here](https://github.com/lukeknoot/classicwow-to-guidelime/releases).

Follow the [Guidelime instructions](https://github.com/max-ri/Guidelime/wiki/FAQ#when-i-have-downloaded-a-guide-module-where-should-i-install-it) to install them and make them available to the addon.

## Contributing

### Setup

Prerequisites

- [Bun](https://bun.sh/) v1.0.0 or above.

```
bun install
```

### Usage

For a single guide:

```
bun generateGuide <race> <class>
```

For all guides:

```
bun generateAll
```

E.g.

```
bun generateGuide human warrior
```

The generated guide can then be found at `src/tmp/Guidelime_<Race><Class>` alongside a zip file that is generated for sharing convenience.

### Running Tests

```
bun test
```

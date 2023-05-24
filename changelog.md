# changelog

all notable changes to this project will be documented in this file.

the format is loosely based on [keep a changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [semantic versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

## [0.1.6]

### added

- typescript typings via jsdoc syntax

## [0.1.5]

### added

- added a second port option 3000 to defaults

### changed

- changed changelog.md

## [0.1.4] - 2021-08-15

### added

- added --list-dir / -d option
- added repository to package.json
- bumped ws version

### fixed

- fixed time zone offset in logs

## [0.1.3] - 2021-07-10

### added

- added comment to injected live-reload code

### changed

- updated version for cli

### fixed

- fixed breaking bug in static mode

## [0.1.2] - 2021-07-09

### added

- added static mode (--static flag)
- sorted files while serving directory

### changed

- improved directory design while serving directory
- improved readme.md
- added default values for sade

### fixed

- fixed bug when serving directory with index.html
- fixed bug not reloading when file removed
- fixed import error (package.json)
- fixed potential bug with the coloring

## [0.1.1] - 2021-07-01

### added

- directories now show the files contained within it

### changed

- updated readme.md
- removed uuid module
- moved the handler

### fixed

- fixed bug that caused the main entry directory to not update on file change
- removed spelling mistake from readme.md

## [0.1.0] - 2021-06-28

### added

- initial release

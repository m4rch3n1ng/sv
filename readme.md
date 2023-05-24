# @m4rch/sv

this is a package for file-serving with automatically added live-reload functionality

# usage

## cli

```
$ sv --help
  Description
    quickly serve and live-reload a folder for development.

  Usage
    $ sv [dir] [options]

  Options
    -p, --port        specify the port  (default 4000)
    -o, --open        open the website in a browser
    -s, --static      disable live-reloading and content updates
    -d, --list-dir    always list directories
    -v, --version     Displays current version
    -h, --help        Displays this message

  Examples
    $ sv dist
    $ sv -p 5000
```

## api

you can import the serve function via

```js
import serve from "@m4rch/sv"
```

the serve function takes an object as the only argument.

```ts
interface options {
	dir: string // the directory you want to serve
	port: number // the port of the wished service
	wsPort: number // the port of the live-reload socket
	static?: boolean // whether or not to live-reload,
	listDir?: boolean // whether or not to always list directories
}
```

# credit

the ui is heavily inspired by the [sirv-cli](https://github.com/lukeed/sirv)

#!/usr/bin/env node

import sade from "sade"
import handler from "./handler.js"

sade("sv [dir]")
	.version("v0.1.5")
	.describe("quickly serve and live-reload a folder for development.")
	.option("-p, --port", "specify the port")
	.option("-o, --open", "open the website in a browser")
	.option("-s, --static", "disable live-reloading and content updates")
	.option("-d, --list-dir", "always list directories")
	.example("dist")
	.example("-p 5000")
	.action(handler)
	.parse(process.argv, { default: { static: false, open: false, d: false }})

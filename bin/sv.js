#!/usr/bin/env node

import sade from "sade"
import handler from "./handler.js"

sade("sv [dir]")
	.version("v0.1.1")
	.describe("quickly serve and live-reload a folder for development.")
	.option("-p, --port", "specify the port", 4000)
	.option("-o, --open", "open the website in a browser")
	.example("dist")
	.example("-p 5000")
	.action(handler)
	.parse(process.argv)

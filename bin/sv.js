#!/usr/bin/env node

import sade from "sade"
import index from "../src/index.js"

sade("sv [dir]")
	.version("v0.1.0")
	.option("-p, --port", "specify the port", 4000)
	.action(index)
	.parse(process.argv)

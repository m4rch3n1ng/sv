import colors from "kleur"
import { exec } from "child_process"
import { randomBytes } from "crypto"

export function parse ({ url }) {
	const [ path ] = decodeURI(url).split("?")
	return {
		raw: url,
		path: path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path
	}
}

export function is404 ( res ) {
	res.writeHead(404)
	res.end()
}

export function send ({ res, content, headers }) {
	res.writeHead(200, headers)
	res.end(content)
}

export function toHeaders ({ type, content }) {
	return {
		"Content-Length": content.length,
		"Content-Type": type || "",
		"Cache-Control": "no-cache"
	}
}

export function log ({ code, path }) {
	const date = colors.magenta(new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().split(/[T\.]/g)[1])
	const fn = code >= 400 ? "red" : code > 300 ? "yellow" : "green"

	console.log(`  [${date}] ${colors[fn](code)} - ${path}`)
}

export function launch ( port ) {
	const url = `http://localhost:${port}`

	if (process.platform == "win32") {
		exec(`start ${url}`)
	} else if (process.platform == "linux") {
		exec(`xdg-open ${url}`)
	} else if (process.platform == "darwin") {
		exec(`open ${url}`)
	}
}

export function random () {
	return randomBytes(16).toString("hex")
}

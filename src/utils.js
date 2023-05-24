import * as colors from "kleur/colors"
import { exec } from "child_process"
import { randomBytes } from "crypto"

/**
 * parse url
 * @param {import("node:http").IncomingMessage} message 
 * @returns 
 */
export function parse ({ url }) {
	const [ path = "/" ] = decodeURI(/** @type {string} */ (url)).split("?")
	return {
		raw: url,
		path: path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path
	}
}

/**
 * send 404 request
 * @param {import("node:http").ServerResponse} res 
 */
export function is404 ( res ) {
	res.writeHead(404)
	res.end()
}

/**
 * send response
 * @param {{ res: import("node:http").ServerResponse, content: Buffer, headers: Record<string, string | number> }} param0 
 */
export function send ({ res, content, headers }) {
	res.writeHead(200, headers)
	res.end(content)
}

/**
 * generate headers
 * @param {{ type: string, content: Buffer }} options options
 * @returns {Record<string, string | number>}
 */
export function toHeaders ({ type, content }) {
	return {
		"Content-Length": content.length,
		"Content-Type": type || "",
		"Cache-Control": "no-cache"
	}
}

/**
 * logging
 * @param {{ code: number, path: string }} options options
 */
export function log ({ code, path }) {
	const date = /** @type {string} */ (new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().split(/[T\.]/g)[1])
	const dateString = colors.magenta(date)
	const fn = code >= 400 ? "red" : code > 300 ? "yellow" : "green"

	console.log(`  [${dateString}] ${colors[fn](code)} - ${path}`)
}

/**
 * open in browser
 * @param {number} port port
 */
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

import colors from "kleur"

export function parse ({ url }) {
	if (!url) return {}

	const [ path ] = url.split("?")
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
	const date = colors.magenta(new Date().toISOString().split(/[T\.]/)[1])
	const fn = code >= 400 ? "red" : code > 300 ? "yellow" : "green"

	console.log(`  [${date}] ${colors[fn](code)} - ${path}`)
}

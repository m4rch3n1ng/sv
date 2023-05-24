import mime from "mime/lite.js"
import { scripts, styles } from "./extra.js"
import { routes, get } from "./routes.js"
import { toHeaders } from "./utils.js"

/**
 * generate html
 * @param {import("./private.js").HtmlOptions} options options 
 * @returns {Promise<import("./private.js").HtmlResponse>}
 */
export default async function html ({ dir, path, wsPort, statik, listDir }) {
	// hacky workaround, opened an issue on cheap-watch
	if (!statik && (!routes.has(path) || path == "/")) {
		const is = await get(dir, path.slice(1))
		if (!is) return { code: 404 }
	} else if (statik && !routes.has(path)) {
		return { code: 404 }
	}

	const route = /** @type {import("./private.js").Route} */ (routes.get(path))
	if (route.directory) {
		const { children } = route

		if (!listDir) {
			const index = children.filter(({ directory }) => !directory).find(({ path }) => path == "index.html" || path == "index.htm")
			if (index) return html({ dir, path: `${path}/${index.path}`.replace(/\/{2,}/g, "/"), wsPort, statik })
		}

		const content = doDirectory({ children, path, wsPort })
		const headers = toHeaders({ content, type: "text/html" })

		return {
			code: 200,
			content,
			headers
		}
	} else {
		let { content } = route
		const type = mime.getType(path) || "text/plain"

		switch (type) {
			case "text/html": {
				if (!statik) content = livereload({ content, wsPort })
				const headers = toHeaders({ content, type })

				return {
					code: 200,
					content,
					headers
				}
			}
			default: {
				const headers = toHeaders({ content, type })

				return {
					code: 200,
					content,
					headers
				}
			}
		}
	}
}

/**
 * inject live-reload script
 * @param {{ content: Buffer, wsPort: number }} options options
 * @returns {Buffer}
 */
function livereload ({ content, wsPort }) {
	const script = Buffer.from(scripts.livereload(wsPort))
	const contentBuffer = Buffer.from(content)
	return Buffer.concat([ contentBuffer, script ])
}

/**
 * generate directory html
 * @param {{ children: { path: string, directory: boolean }[], path: string, wsPort: number }} options options 
 * @returns {Buffer}
 */
function doDirectory ({ children, path, wsPort }) {
	const dir = path.slice(1).split(/\/+/g).filter(( dir ) => !!dir.length).map(( dir, i, pre ) => ({ name: dir, link: `/${pre.slice(0, i + 1).join("/")}` }))
	const links = children.map(({ path: p, directory }) => `<a href="${encodeURI(`/${path}/${p}`.replace(/\/+/g, "/"))}">${p}${directory ? "/" : ""}</a>`)

	return Buffer.from([
		"<!DOCTYPE html>",
		"<html>",
		"<head>",
			`<title>${dir[dir.length - 1]?.name || "/"}</title>`,
			scripts.livereload(wsPort),
			styles.directory,
		"</head>",
		"<body>",
		"<div class=\"main\">",
			"<div class=\"name\">",
				"<a href=\"/\">./</a>",
				dir.map(({ name, link }) => `<a href="${link}">${name}/</a>`).join(""),
			"</div>",
			"<div class=\"entries\">",
				links.join("\n"),
			"</div>",
		"</div>",
		"</body>",
		"</html>"
	].join(""))
}

import mime from "mime/lite.js"
import { join } from "path"
import { scripts, styles } from "./extra.js"
import { routes, get } from "./routes.js"
import { toHeaders } from "./utils.js"

export default async function html ({ dir, path, wsPort }) {
	// hacky workaround, opened an issue on cheap-watch
	if (!routes.has(path) || path == "/") {
		const is = await get(dir, path.slice(1))
		if (!is) return { code: 404 }
	}

	const { directory, ...stuff } = routes.get(path)
	if (directory) {
		const { children } = stuff

		const index = children.filter(({ directory }) => !directory).find(({ path }) => path == "index.html" || path == "index.htm")
		if (index) return html(dir, join(path, index.path).replace(/\\/g, "/"))

		const content = doDirectory({ children, path, wsPort })
		const headers = toHeaders({ content, type: "text/html" })

		return {
			code: 200,
			content,
			headers
		}
	} else {
		let { content } = stuff
		const type = mime.getType(path) || "text/plain"

		switch (type) {
			case "text/html": {
				content = livereload({ content, wsPort })
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

function livereload ({ content, wsPort }) {
	const script = Buffer.from(scripts.livereload(wsPort))
	return Buffer.concat([ content, script ])
}

function doDirectory ({ children, path: p, wsPort }) {
	const links = children.map(({ path, directory }) => `<a href="${encodeURI(`/${p}/${path}`.replace(/\/+/, "/"))}">${path}${directory ? "/" : ""}</a>`)

	return Buffer.from([
		"<!DOCTYPE html>",
		"<html>",
		"<head>",
		`<title>${p}</title>`,
		scripts.livereload(wsPort),
		styles.directory,
		"</head>",
		"<body>",
		"<div class=\"main\">",
			`<div class="folder">.${p}</div>`,
			links.join("\n"),
		"</div>",
		"</body>",
		"</html>"
	].join(""))
}

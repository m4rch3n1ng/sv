import mime from "mime/lite.js"
import { scripts, styles } from "./extra.js"
import { routes, get } from "./routes.js"
import { toHeaders } from "./utils.js"

export default async function html ({ dir, path, wsPort, statik }) {
	// hacky workaround, opened an issue on cheap-watch
	if (!statik && (!routes.has(path) || path == "/")) {
		const is = await get(dir, path.slice(1))
		if (!is) return { code: 404 }
	} else if (statik && !routes.has(path)) {
		return { code: 404 }
	}

	const { directory, ...stuff } = routes.get(path)
	if (directory) {
		const { children } = stuff

		const index = children.filter(({ directory }) => !directory).find(({ path }) => path == "index.html" || path == "index.htm")
		if (index) return html({ dir, path: `${path}/${index.path}`.replace(/\/{2,}/g, "/"), wsPort, statik })

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

function livereload ({ content, wsPort }) {
	const script = Buffer.from(scripts.livereload(wsPort))
	return Buffer.concat([ content, script ])
}

function doDirectory ({ children, path, wsPort }) {
	const dir = path.slice(1).split(/\/+/g).filter(( dir ) => !!dir.length).map(( dir, i, pre ) => ({ name: dir, link: `/${pre.slice(0, i + 1).join("/")}` }))
	const links = children.map(({ path: p, directory }) => `<a href="${encodeURI(`/${path}/${p}`.replace(/\/+/g, "/"))}">${p}${directory ? "/" : ""}</a>`)

	return Buffer.from([
		"<!DOCTYPE html>",
		"<html>",
		"<head>",
			`<title>${dir[dir.length - 1] && dir[dir.length - 1].name || "/"}</title>`,
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

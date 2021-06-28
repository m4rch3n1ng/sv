import mime from "mime/lite.js"
import { join } from "path"
import { routes, get } from "./routes.js"
import { port as wsPort } from "./livereload.js"
import { toHeaders } from "./utils.js"

export default async function html ( dir, path ) {
	if (!routes.has(path)) {
		const is = await get(dir, path.slice(1))
		if (!is) {
			// TODO
			return {
				code: 404,
				content: "",
				headers: {}
			}
		}
	}

	const { directory, ...stuff } = routes.get(path)
	if (directory) {
		const { children } = stuff

		const index = children.filter(({ directory }) => !directory).find(({ path }) => path == "index.html" || path == "index.htm")
		if (index) return html(dir, join(path, index.path).replace(/\\/g, "/"))

		// TODO
		return {
			code: 200,
			content: "",
			headers: {}
		}
	} else {
		let { content } = stuff
		const type = mime.getType(path) || "text/plain"

		switch (type) {
			case "text/html": {
				content = livereload(content)
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

function livereload ( html ) {
	let script = Buffer.from([
		"<script>",
		"\t(function () {",
		`\t\tconst ws = new WebSocket(\"ws://localhost:${wsPort}\");`,
		"\t\tws.addEventListener(\"message\", ({ data }) => data == \"reload\" && location.reload())",
		"\t}())",
		"</script>",
		""
	].join("\n"))

	return Buffer.concat([ html, script ])
}

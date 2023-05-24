import { createServer } from "http"
import { parse, send, log, is404 } from "./utils.js"
import { init as livereload } from "./livereload.js"
import { watch, recurse } from "./routes.js"
import html from "./html.js"

/**
 * serve file
 * @param {import("./private.js").ServeOptions} options options
 */
export default function serve ({ dir, port, wsPort, static: statik = false, listDir = false }) {
	const server = createServer(async ( req, res ) => {
		const { path } = parse(req)
		const render = await html({ dir, path, wsPort, statik, listDir })

		if (render.code != 404) {
			send({ res, content: render.content, headers: render.headers })
		} else {
			is404(res)
		}

		log({ code: render.code, path })
	})

	if (!statik) {
		livereload(wsPort)
		watch(dir)
	} else {
		recurse(dir, [])
	}

	server.listen(port)
}

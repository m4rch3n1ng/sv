import { createServer } from "http"
import { parse, send, log, is404 } from "./utils.js"
import { init as livereload } from "./livereload.js"
import { watch, recurse } from "./routes.js"
import html from "./html.js"

export default function serve ({ dir, port, wsPort, static: statik }) {
	const server = createServer(async ( req, res ) => {
		const { path } = parse(req)
		const { code, content, headers } = await html({ dir, path, wsPort, statik })

		if (code != 404) {
			send({ res, content, headers })
		} else {
			is404(res)
		}

		log({ code, path })
	})

	if (!statik) {
		livereload(wsPort)
		watch(dir)
	} else {
		recurse(dir)
	}

	server.listen(port)
}

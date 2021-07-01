import { createServer } from "http"
import { parse, send, log, is404 } from "./utils.js"
import { init as livereload } from "./livereload.js"
import { watch } from "./routes.js"
import html from "./html.js"

export default function serve ({ dir, port, wsPort }) {
	const server = createServer(async ( req, res ) => {
		const { path } = parse(req)
		const { code, content, headers } = await html({ dir, path, wsPort })

		if (code != 404) {
			send({ res, content, headers })
		} else {
			is404(res)
		}

		log({ code, path })
	})

	livereload(wsPort)
	watch(dir)

	server.listen(port)
}

import { inverse, green, yellow } from "kleur/colors"
import getPort from "get-port"
import { createServer } from "http"
import { join } from "path"
import { parse, send, log, is404 } from "./utils.js"
import { init as livereload } from "./livereload.js"
import { watch } from "./routes.js"
import html from "./html.js"

export default async function handler ( folder = ".", { p }) {
	const dir = join(process.cwd(), folder)
	const port = await getPort({ port: typeof p == "boolean" ? 4000 : +p })
	const wsPort = await getPort({ port: port + 1 })

	serve({ dir, port })
	livereload(wsPort)
	watch(dir)

	console.clear()
	console.log(green(`\n ::  serving ${yellow(folder.replace(/[\/\\]$/, "") + "/")}  ::\n`))
	console.log(` - local: http://localhost:${port}\n`)
	console.log(`${"─".repeat(15)} ${inverse(" LOGS ")} ${"─".repeat(15)}\n`)
}

function serve ({ dir, port }) {
	const server = createServer(async ( req, res ) => {
		const { path } = parse(req)
		const { code, content, headers } = await html(dir, path)

		if (code != 404) {
			send({ res, content, headers })
		} else {
			is404(res)
		}
		log({ code, path })
	})

	server.listen(port)
}

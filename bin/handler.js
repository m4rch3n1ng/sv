import { inverse, green, yellow } from "kleur/colors"
import getPort from "get-port"
import { join } from "path"
import { launch } from "../src/utils.js"
import serve from "../src/index.js"

export default async function handler ( folder = ".", { p, open, s } = {}) {
	const dir = join(process.cwd(), folder)
	const port = await getPort({ port: typeof p == "boolean" ? 4000 : +p })
	const wsPort = await getPort({ port: port + 1 })

	console.clear()
	console.log(`\n${green(" ::  serving ")}${yellow(`${folder}/`.replace(/[\\\/]+/g, "/"))}${green("  :: ")}\n`)
	console.log(` - local: http://localhost:${port}`)
	console.log(`\n${"─".repeat(15)} ${inverse(" LOGS ")} ${"─".repeat(15)}\n`)

	serve({ dir, port, wsPort, static: s })
	if (open) launch(port)
}

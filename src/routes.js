import CheapWatch from "cheap-watch"
import { lstat, readFile, readdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import { update } from "./livereload.js"

export const routes = new Map

export function watch ( dir ) {
	const watcher = new CheapWatch({ dir, debounce: 100 })
	watcher.init()

	watcher.on("+", async ({ path, stats }) => {
		const file = join(dir, path)
		update()

		if (stats.isDirectory()) {
			let children = await readdir(file)
			children = await Promise.all(
				children.map(async ( path ) => ({ path, directory: (await lstat(join(file, path))).isDirectory() }))
			)

			routes.set(`/${path}`, { directory: true, children })
		} else {
			const content = await readFile(file)
			routes.set(`/${path}`, { directory: false, content })
		}
	})

	watcher.on("-", ({ path }) => routes.has(`/${path}`) && routes.delete(`/${path}`))
}

export async function get ( dir, sub ) {
	const path = join(dir, sub)
	if (!existsSync(path)) return false

	const stats = await lstat(path)
	if (stats.isDirectory()) {
		let children = await readdir(path)
		children = await Promise.all(
			children.map(async ( p ) => ({ path: p, directory: (await lstat(join(path, p))).isDirectory() }))
		)

		routes.set(`/${sub}`, { directory: true, children })
	} else {
		const content = await readFile(path)
		routes.set(`/${sub}`, { directory: false, content })
	}

	return true
}

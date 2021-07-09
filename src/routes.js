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

		if (stats.isDirectory()) {
			let children = await readdir(file)
			children = (await Promise.all(
				children
					.sort(( el1, el2 ) => el1.toLowerCase().localeCompare(el2.toLowerCase()))
					.map(async ( path ) => ({ path, directory: (await lstat(join(file, path))).isDirectory() })).sort(( el1, el2 ) => el2.directory - el1.directory)
			)).sort(( el1, el2 ) => el2.directory - el1.directory)

			routes.set(`/${path}`, { directory: true, children })
		} else {
			const content = await readFile(file)
			routes.set(`/${path}`, { directory: false, content })
		}

		update()
	})

	watcher.on("-", ({ path }) => {
		if (routes.has(`/${path}`)) {
			routes.delete(`/${path}`)
			update()
		}
	})
}

export async function get ( dir, file ) {
	const path = join(dir, file)
	if (!existsSync(path)) return false

	const stats = await lstat(path)
	if (stats.isDirectory()) {
		let children = await readdir(path)
		children = (await Promise.all(
			children
				.sort(( el1, el2 ) => el1.toLowerCase().localeCompare(el2.toLowerCase()))
				.map(async ( p ) => ({ path: p, directory: (await lstat(join(path, p))).isDirectory() }))
		)).sort(( el1, el2 ) => el2.directory - el1.directory)

		routes.set(`/${file}`, { directory: true, children })
	} else {
		const content = await readFile(path)
		routes.set(`/${file}`, { directory: false, content })
	}

	return true
}

export async function recurse ( dir, route = "" ) {
	const children = await readdir(dir)
	get(dir, route)

	children.forEach(async ( file ) => {
		const path = join(dir, file)
		const stats = await lstat(path)

		if (stats.isDirectory()) {
			recurse(path, route.split(/\/+/g).concat(file).join("/"))
		} else {
			get(dir, `${route}/${file}`)
		}
	})
}

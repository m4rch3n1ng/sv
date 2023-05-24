import CheapWatch from "cheap-watch"
import { lstat, readFile, readdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import { update } from "./livereload.js"

/** @type {Map<string, import("./private.js").Route>} */
export const routes = new Map

/**
 * watch files
 * @param {string} dir dir
 */
export function watch ( dir ) {
	const watcher = new CheapWatch({ dir, debounce: 100 })
	watcher.init()

	watcher.on("+", async ({ path, stats }) => {
		const file = join(dir, path)

		const routeString = `/${file}`
		const route = await getChildren(path, stats)
		routes.set(routeString, route)

		update()
	})

	watcher.on("-", ({ path }) => {
		if (routes.has(`/${path}`)) {
			routes.delete(`/${path}`)
			update()
		}
	})
}

/**
 * 
 * @param {string} dir directory
 * @param {string} file file path
 * @returns {Promise<boolean>}
 */
export async function get ( dir, file ) {
	const path = join(dir, file)
	if (!existsSync(path)) return false

	const stats = await lstat(path)

	const routeString = `/${file}`
	const route = await getChildren(path, stats)
	routes.set(routeString, route)

	return true
}

/**
 * recurse directory
 * @param {string} dir directory
 * @param {string[]} route route
 */
export async function recurse ( dir, route = [] ) {
	get(dir, route.join("/"))

	const children = await readdir(join(dir, route.join("/")))
	children.forEach(async ( file ) => {
		const stats = await lstat(join(dir, route.join("/"), file))

		if (stats.isDirectory()) {
			recurse(dir, route.concat(file))
		} else {
			get(dir, route.concat(file).join("/"))
		}
	})
}

/**
 * get content
 * @param {string} path path
 * @param {import("node:fs").Stats} stats stats
 * @returns {Promise<import("./private.js").Route>}
 */
async function getChildren ( path, stats ) {
	if (stats.isDirectory()) {
		let children = await readdir(path)
		let nchildren = (await Promise.all(
			children
				.sort(( el1, el2 ) => el1.toLowerCase().localeCompare(el2.toLowerCase()))
				.map(async ( p ) => ({ path: p, directory: (await lstat(join(path, p))).isDirectory() }))
		)).sort(( el1, el2 ) => +el2.directory - +el1.directory)

		return { directory: true, children: nchildren }
	} else {
		const content = await readFile(path)
		return { directory: false, content }
	}
}

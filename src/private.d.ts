export interface HtmlOptions {
	dir: string,
	path: string,
	wsPort: number,
	statik: boolean,
	listDir?: boolean
}

export interface ServeOptions {
	dir: string,
	port: number,
	wsPort: number,
	static?: boolean,
	listDir?: boolean,
}

interface Html404Response {
	code: 404
}

interface Html200Response {
	code: 200,
	content: Buffer,
	headers: Record<string, string | number>
}

export type HtmlResponse = Html404Response | Html200Response

interface ContentRoute {
	directory: false,
	content: Buffer,
}

interface DirRoute {
	directory: true,
	children: { path: string, directory: boolean }[]
}

export type Route = ContentRoute | DirRoute

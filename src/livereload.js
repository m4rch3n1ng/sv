import WebSocket from "ws"
const { Server: WebSocketServer } = WebSocket
import { random } from "./utils.js"

export const websockets = new Map
export let port = null

export function init ( wsPort ) {
	port = wsPort
	const wss = new WebSocketServer({ port: wsPort })

	wss.on("connection", ( ws ) => {
		const id = random()
		websockets.set(id, ws)

		ws.on("close", () => websockets.delete(id))
	})
}

export function update () {
	[ ...websockets.values() ].forEach(( ws ) => ws.send("reload"))
}

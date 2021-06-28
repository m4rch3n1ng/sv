import { v4 as uuid } from "@lukeed/uuid/secure"
import WebSocket from "ws"
const { Server: WebSocketServer } = WebSocket

export const websockets = new Map
export let port = null

export function init ( wsPort ) {
	port = wsPort
	const wss = new WebSocketServer({ port: wsPort })

	wss.on("connection", ( ws ) => {
		// maybe a bit overkill
		const id = uuid()
		websockets.set(id, ws)

		ws.on("close", () => websockets.delete(id))
	})
}

export function update () {
	[ ...websockets.values() ].forEach(( ws ) => ws.send("reload"))
}

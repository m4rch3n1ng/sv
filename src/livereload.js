import WebSocket from "ws"
const { Server: WebSocketServer } = WebSocket
import { random } from "./utils.js"

export const websockets = new Map

export function init ( wsPort ) {
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

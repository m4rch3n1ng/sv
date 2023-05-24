import { WebSocketServer } from "ws"
import { random } from "./utils.js"

/** @type {Map<string, import("ws").WebSocket>} */
export const websockets = new Map

/**
 * initialize web socket
 * @param {number} wsPort websocket port
 */
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

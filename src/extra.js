export const scripts = {
	livereload: ( wsPort ) => [
		"<script>",
		"\t(function () {",
		`\t\tconst ws = new WebSocket(\"ws://localhost:${wsPort}\")`,
		"\t\tws.addEventListener(\"message\", ({ data }) => data == \"reload\" && location.reload())",
		"\t}())",
		"</script>",
		""
	].join("\n")
}

export const styles = {
	directory: [
		"<style>",
		"* {",
		"\tmargin: 0;",
		"}",
		".name {",
		"\tpadding-bottom: 15px;",
		"\tmargin-bottom: 20px;",
		"\tborder-bottom: 2px solid #cccccc;",
		"\tfont-family: monospace;",
		"\ttext-align: center;",
		"}",
		".name a {",
		"\tcolor: #3579bd;",
		"\tfont-size: 25px;",
		"\tfont-weight: 900;",
		"\ttext-decoration: none;",
		"}",
		".name a:hover {",
		"\tcolor: #3579bd;",
		"\ttext-decoration: underline;",
		"}",
		".main {",
		"\tmargin: 20px 25%;",
		"\tpadding: 20px;",
		"\tborder: 1px solid #cccccc;",
		"}",
		".entries > a {",
		"\tdisplay: block;",
		"\tpadding: 3px 10px;",
		"\tcolor: #3579bd;",
		"\tfont-size: 17px;",
		"\tfont-family: monospace;",
		"\ttext-decoration: none;",
		"}",
		".entries > a:hover {",
		"\ttext-decoration: underline;",
		"}",
		"</style>"
	].join("")
}

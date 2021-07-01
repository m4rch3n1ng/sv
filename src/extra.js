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
		".main {",
		"\tmargin: 20px 25%;",
		"\tborder: 1px solid #cccccc;",
		"\tpadding: 20px;",
		"}",
		"a {",
		"\tdisplay: block;",
		"\tpadding: 3px 10px;",
		"\tcolor: #4183c4;",
		"\ttext-decoration: none;",
		"\tfont-size: 17px;",
		"\tfont-family: monospace;",
		"}",
		"a:hover {",
		"\ttext-decoration: underline;",
		"}",
		".folder {",
		"\ttext-align: center;",
		"\tpadding-bottom: 15px;",
		"\tmargin-bottom: 20px;",
		"\tborder-bottom: 2px solid #cccccc;",
		"\tfont-size: 25px;",
		"\tfont-weight: 900;",
		"\tfont-family: monospace;",
		"}",
		"</style>"
	].join("")
}

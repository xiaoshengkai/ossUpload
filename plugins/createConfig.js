const fs = require('fs')
const path = require('path')

exports.createConfig = (host, port) => {
	const jsonFile = path.join(__dirname + '/../config.js')
	const template = `
	export default {
		host: '${host}',
		port: ${port}
	}`

	fs.writeFileSync(jsonFile, template)
}
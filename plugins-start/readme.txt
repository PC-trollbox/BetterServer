Welcome to plugin making!
You can create plugins for BetterServer.

But after creating a plugin, put it in plugins folder, (not plugins-start) otherwise it will be ignored.

What is a plugin?
It's a JavaScript file for a specific command.
Let me describe the commands from an original server:
	# in front of anything - Just a comment. Outputs nothing. This is the easiest way to hide something
server-side.
	DbVal.<value> - Reads a database value from the database and outputs the value. (If DB was read, of
course)
	readDB - The command to read a database. Without it, some commands are impossible.
	denyEveryone - Shows 403 error to EVERYONE (dumb command yeah?)
	denyIP <Multiple arguments separated by comma> - Literally bans an IP from your server. Example of
usage below:
		denyIP ::192.168.0.1
	allowOnly <Multiple arguments separated by comma> - This is like denyIP, but uno reversed. Whitelists
IPs on the server. Example of usage below:
		allowOnly ::1
	Redirect <URL> - Redirects the user to the URL in arguments.
	execJS <JavaScript> - Executes JavaScript serverside.
	basicAuth - (readDB first!!!) Prompts to enter the username and password. Soon we will support multiple
accounts.
	tcAuth - Prompts to enter the certificate code. The user must be "TCAuth".
	maintenancePg - Script will show the maintenance page from the errors directory.
	maintenance - Returns 503 and no answer.
	NodeJSVer - Shows the server Node.JS version. Used only for stats!!!!!
	OutputVanilla - Shows if there's any plugins. Used only for stats!!!!!
	UserAgentDesc - Shows OS and browser. Debug, used only for stats!!!!!
	IpPlaceHolder - Shows the IP.

Error pages to get this file too long :D
	maintenance.html - The maintenance page that will get shown by maintenancePg.
	noBasicAuth.html - Shown when the user denies to the basicAuth.
	noTCAuth.html - Shown when the user denies to the tcAuth.
	notFound.html - Required. 404 error.

Test example of a plugin is in test.js. Sometimes you would need request, response and arguments. They will
get passed to the plugin.


BetterServer
(c) PCsoft 2021

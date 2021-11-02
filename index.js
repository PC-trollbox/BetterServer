const app = require('express')();
const http = require('http').Server(app);
const fs = require("fs");
const fetch = require("node-fetch");
const config = require("./config.json");
app.use(function(req, res, next) {
	if ((req.originalUrl.split("?").shift() == "/" ? "/index.pc" : req.originalUrl.split("?").shift()).endsWith(".pc")) {
		fs.readFile(__dirname + "/files" + (req.originalUrl.split("?").shift() == "/" ? "/index.pc" : req.originalUrl.split("?").shift()), async function(err, txt) {
			if (err && err.code == "ENOENT") return res.status(404).sendFile(__dirname + "/errors/notFound.html");
			if (err && err.code != "ENOENT") return res.status(500).end();
			var results = "";
			var txt2 = txt.toString();
			var databaseValues = {};
			var arr = txt2.split("\r\n").length >= 2 ? txt2.split("\r\n") : txt2.split("\n");
			for (let line of arr) {
				if (line.startsWith("#")) {

				} else {
					if (line.includes("IpPlaceHolder")) {
						results = results + line.replace("IpPlaceHolder", req.ip) + "\n";
					} else if (line.includes("DbVal.")) {
						var arr2 = line.split(" ");
						for (let ind in arr2) {
							if (arr2[ind].startsWith("DbVal.")) {
								arr2[ind] = databaseValues[arr2[ind].replace("DbVal.", "")];
							}
						}
						results = results + arr2.join(" ") + "\n";
					} else if (line == "readDB") {
						databaseValues = JSON.parse(fs.readFileSync(__dirname + "/database.db").toString());
					} else if (line.startsWith("denyEveryone")) {
						return res.status(403).end();
					} else if (line.startsWith("denyIP ")) {
						var arr = line.replace("denyIP ", "").split(", ");
						if (arr.includes(req.ip)) {
							return res.status(403).end();
						} else {}
					} else if (line.startsWith("allowOnly ")) {
						var arr = line.replace("allowOnly ", "").split(", ");
						if (arr.includes(req.ip)) {} else {
							return res.status(403).end();
						}
					} else if (line.startsWith("Redirect ")) {
						return res.redirect(line.replace("Redirect ", ""));
					} else if (line.startsWith("execJS ")) {
						if (!config.js.noExecJS) {
							try {
								results = results + eval(line.replace("execJS ", "")) + "\n";
							} catch (err) {
								console.log(err.stack);
								return res.status(503).end();
							}
						} else {}
					} else if (line == "basicAuth") {
						const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
						const strauth = Buffer.from(b64auth, 'base64').toString();
						const splitIndex = strauth.indexOf(':');
						const login = strauth.substring(0, splitIndex);
						const password = strauth.substring(splitIndex + 1);
						if (login && password && ((login == databaseValues[(req.originalUrl.split("?").shift() == "/" ? "/index.pc" : req.originalUrl.split("?").shift())].login && password == databaseValues[(req.originalUrl.split("?").shift() == "/" ? "/index.pc" : req.originalUrl.split("?").shift())].pass) || (login == config.basicAuth.username && password == config.basicAuth.password))) {} else {
							res.set('WWW-Authenticate', 'Basic realm="Basic auth in BetterServer"');
							return res.status(401).sendFile(__dirname + "/errors/noBasicAuth.html");
						}
					} else if (line == "tcAuth") {
						const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
						const strauth = Buffer.from(b64auth, 'base64').toString();
						const splitIndex = strauth.indexOf(':');
						const login = strauth.substring(0, splitIndex);
						const password = strauth.substring(splitIndex + 1);
						var passResp = await fetch("https://toppatcodecheck.pcprojects.tk/api/" + password);
						if (login && password && login == "TCAuth" && passResp.ok) {} else {
							res.set('WWW-Authenticate', 'Basic realm="Basic auth in BetterServer"');
							return res.status(401).sendFile(__dirname + "/errors/noTCAuth.html");
						}
					} else if (line.startsWith("methodRest ")) {
						if (line == "methodRest " + req.method) {} else {
							return res.status(404).sendFile(__dirname + "/errors/notFound.html");
						}
					} else if (line == "maintenancePg") {
						return res.status(503).sendFile(__dirname + "/errors/maintenance.html");
					} else if (line == "maintenance") {
						return res.status(503).end();
					} else if (line.includes("NodeJSVer")) {
						results = results + line.replace("NodeJSVer", process.version) + "\n";
					} else if (line.includes("UserAgentDesc")) {
						var BrowserDetect = {
							init: function() {
								this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
								this.version = this.searchVersion(req.get("User-Agent")) || "an unknown version";
								this.OS = this.searchString(this.dataOS) || "an unknown OS";
							},
							searchString: function(data) {
								for (var i = 0; i < data.length; i++) {
									var dataString = data[i].string;
									var dataProp = data[i].prop;
									this.versionSearchString = data[i].versionSearch || data[i].identity;
									if (dataString) {
										if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
									} else if (dataProp) return data[i].identity;
								}
							},
							searchVersion: function(dataString) {
								var index = dataString.indexOf(this.versionSearchString);
								if (index == -1) return;
								return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
							},
							dataBrowser: [{
								string: req.get("User-Agent"),
								subString: "Chrome",
								identity: "Chrome"
							}, {
								string: req.get("User-Agent"),
								subString: "OmniWeb",
								versionSearch: "OmniWeb/",
								identity: "OmniWeb"
							}, {
								string: req.get("User-Agent"),
								subString: "Apple",
								identity: "Safari",
								versionSearch: "Version"
							}, {
								string: req.get("User-Agent"),
								subString: "iCab",
								identity: "iCab"
							}, {
								string: req.get("User-Agent"),
								subString: "KDE",
								identity: "Konqueror"
							}, {
								string: req.get("User-Agent"),
								subString: "Firefox",
								identity: "Firefox"
							}, {
								string: req.get("User-Agent"),
								subString: "Camino",
								identity: "Camino"
							}, { // for newer Netscapes (6+)
								string: req.get("User-Agent"),
								subString: "Netscape",
								identity: "Netscape"
							}, {
								string: req.get("User-Agent"),
								subString: "MSIE",
								identity: "Explorer",
								versionSearch: "MSIE"
							}, {
								string: req.get("User-Agent"),
								subString: "Gecko",
								identity: "Mozilla",
								versionSearch: "rv"
							}, { // for older Netscapes (4-)
								string: req.get("User-Agent"),
								subString: "Mozilla",
								identity: "Netscape",
								versionSearch: "Mozilla"
							}],
							dataOS: [{
								string: req.get("User-Agent"),
								subString: "Win",
								identity: "Windows"
							}, {
								string: req.get("User-Agent"),
								subString: "Mac",
								identity: "Mac"
							}, {
								string: req.get("User-Agent"),
								subString: "iPhone",
								identity: "iPhone/iPod"
							}, {
								string: req.get("User-Agent"),
								subString: "Linux",
								identity: "Linux"
							}]

						};
						BrowserDetect.init();
						results = results + line.replace("UserAgentDesc", (BrowserDetect.browser + " " + BrowserDetect.version + " on " + BrowserDetect.OS)) + "\n";
					} else if (line.includes("OutputVanilla")) {
						if (fs.existsSync(__dirname + "/plugins/") && !config.js.alwaysTrustOutput) {
							results = results + line.replace("OutputVanilla", "false") + "\n";
						} else {
							results = results + line.replace("OutputVanilla", "true") + "\n";
						}
					} else {
						if (fs.existsSync(__dirname + "/plugins/" + line.split(" ")[0] + ".js") && !config.js.alwaysTrustOutput) {
							try {
								var args = line.split(" ");
								args.splice(0, 1);
								var lineResult = require(__dirname + "/plugins/" + line.split(" ")[0] + ".js")(req, res, args);
								if (lineResult != undefined && lineResult != null) {
									results = results + lineResult + "\n";
								}
							} catch {
								return res.status(503).end();
							}
						} else {
							results = results + line + "\n";
						}
					}
				}
			}
			res.send(results);
		});
	} else {
		if (fs.existsSync(__dirname + "/files" + req.originalUrl.split("?").shift())) {
			res.sendFile(__dirname + "/files" + req.originalUrl.split("?").shift());
		} else {
			res.status(404).sendFile(__dirname + "/errors/notFound.html");
		}
	}
})
http.listen(3000, function() {
	console.log("Success!")
	console.log("=======")
	console.log("Server is started at http://localhost:3000. (SSL not included)")
})
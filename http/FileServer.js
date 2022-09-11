/*
	Lightnode web server platform. Author: Tim Lind (Next Generation Spinners)
*/

Ext('Ext.http.Server', 'Ext.http.File')

class FileServer extends Ext.http.Server {
	constructor(cfg) {
		super(cfg)

		this.path = Ext.path(this.cfg.path || this.name || '')

		if (this.path) {
			if (!this.name) {
				this.name = this.path
			}

			if (!this.fullName) {
				this.fullName = this.path
			}
		} else {
			throw new Error('No path given')
		}

		this.mimeTypes = Object.create(FileServer.MimeTypes)
		
		this.directoryIndices = [
			'index.html',
			'home.html',
			'index.js'
		]
	
		// file caching (class level)

		this.fileCache = {} // file path => exports.File
	}
		
	getFile(path) {
		if (!this.fileCache[path]) {
			this.fileCache[path] = new Ext.http.File(path)
		}
	
		return this.fileCache[path]
	}

	// hierarchy

	constructChild(name) {
		return new Ext.http.FileServer({
			parent:	this
			,path:	Ext.z.path.join(this.fullName, name)
		})
	}

	// delegation

	getNextPathElement(req, resp) {
		// TODO I think this relies on the fullName vs name properties, which prob aren't very reliable.
	}

	// TODO use the result of getNextPathElement as the default child scheme
	getChildName(req) {
		// TODO
		return null
	}

	// serving

	serveRequest(req, resp) {
		this.locate(req, resp)
	}

	// find the corresponding physical file based on the url as well as headers and file existance / characteristics
	locate(req, resp) {
		var filename = this.translateUrl(req, resp)
		
		Ext.log.info('lighthttp', "\t translating to filename " + filename)
		// check that the file requested is an existing, accessible file that can be served through this server. 
		
		// check that the resolved file is still within this file server's root
		if (filename.indexOf(this.fullName) != 0) {
			// assuming translateUrl would get rid of any '..' elements that hide the following security violation:
			// trying to access a file not within this file, could be an attempted security violation
			// call serve without setting the file property of the exchange, which means a 404 is served.
			Ext.log.info('lighthttp', "\t that file is outside of this file server")
			return this.sendFile(req, resp)
		}
		
		// check that the file exists
		var self = this
		var file = this.getFile(filename)
		file.stat(function(error, stat) {
			if (error) {
				// if it doesn't exist, serve nothing
				Ext.log.info('lighthttp', "\t requested file doesn't exist")
				return self.sendFile(req, resp)
			} else if (!stat.isDirectory()) {
				Ext.log.info('lighthttp', "\t serving " + filename)
				return self.sendFile(req, resp, file)
			} else if (stat.isDirectory()) {
				Ext.log.info('lighthttp', "\t request file is a directory, looking for index file  in " + JSON.stringify(self.directoryIndices) )
				// if it is a directory we find the index file here
				// (this method is called 'locate' after all ... and we want to encapsulate the creation of the File object that goes to sendFile())
				var a = 0, indexFilename, indexFile
				(function statNextFile() {
					if (a < self.directoryIndices.length) {
						indexFilename = Ext.z.path.join(filename, self.directoryIndices[a++])
						indexFile = self.getFile(indexFilename)
						indexFile.stat(function(error, stat) {
							if (error)
								statNextFile()
							else {
								Ext.log.info('lighthttp', "\t found an index file (" + indexFilename + ") for the directory")
								// found an index file, serve it
								// use set timeout to clear up the call stack a bit
								setTimeout(function() { self.sendFile(req, resp, indexFile) }, 0)
							}
						})
					} else {
						Ext.log.info('lighthttp', "\t no index file could be found for directory, tried " + a + " options")
						// no index found
						self.sendFile(req, resp)
					}
				})()
			}
		})
	}
		
	// translate the url to the corresponding file
	translateUrl(req, resp) {
		return Ext.z.path.join(this.fullName, decodeURI(Ext.z.url.parse(req.url).pathname))
	}

	sendFile(req, resp, file) { var self = this
		if (!file)
			return this.sendNone(req, resp)

		Ext.log.info('lighthttp', "\t sending file " + file.name)
		// TODO allow customization of caching procedure (expiration), and allow usage of caching aspect in non file servers.

		file.stat(function(statErr) {
			if (statErr)
				return self.sendNone(req, resp)

			// send headers
			var headers = {}
			var mimeTypes = self.mimeTypes
			var ext = Ext.z.path.extname(file.path)

			if (ext && '.' == ext[0]) {
				ext = ext.slice(1)
			}

			if (ext in mimeTypes) {
				headers['content-type'] = mimeTypes[ext]
			}
			
			headers['last-modified'] = new(Date)(file.header.mtime).toUTCString()
			headers['transfer-encoding'] = 'chunked'
			headers['server'] = 'lightnode'

			if (Date.parse(file.header.mtime) <= Date.parse(req.headers['if-modified-since'])) {
				resp.writeHead(304, headers)
				resp.end()
				return
			} else {
				resp.writeHead(200, headers)
				if (req.method == "HEAD") {
					resp.end()
				} else {
					// send contents
					file.readFile(function(err, data) {
						if (err)
							Ext.log.error('lighthttp', err)

						resp.write(data)
						resp.end()
					})
				}
			}
		})
	}
}

FileServer.MimeTypes = {
	'':	'text/plain'
	,html:	'text/html'
	,css:	'text/css'
	,jpeg:	'image/jpeg'
	,jpg:	'image/jpeg'
	,js:	'text/javascript'
	,json:	'application/json'
	,png:	'image/png'
	,svg:	'image/svg+xml'
	,swf:	'application/x-shockwave-flash'
	,tar:	'application/x-tar'
	,tgz:	'application/x-tar-gz'
	,txt:	'text/plain'
	,wav:	'audio/x-wav'
	,xml:	'text/xml'
	,zip:	'application/zip'
	,ico:	'image/x-icon'
	,flv:	'video/x-flv'
	,gif:	'image/gif'
}

Ext.http.FileServer = FileServer

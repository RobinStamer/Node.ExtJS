/*
	Lightnode web server platform. Author: Tim Lind (Next Generation Spinners)
*/

Ext('Ext.z').ns('Ext.http')

Ext.rq('fs')

// Provides an interface to the file system for one file with the given name.
// Will lazily fetch and cache the stat result for 0.5 seconds so you can just call stat() as frequently as needed from a frequently executed code block.
// More importantly, the file contents itself will be lazily fetched and cached on calling readFile(),
Ext.http.File = function(filename) {
	this.path = filename
	this.header = null
	this.contents = null
	
	var statLastCalled = null
	var statResult = null // 0: error, 1: stat
	var statWaitors = []
	
	var hasCalledReadFile = false
	var readFileWaitors = []
	var readFileResult = null
	
	this.stat = function(F) {
		var self = this
		
		// a 0.5 sec stat interval seems as efficient as a 5 second, it should be suitable for development and production.
		if (statLastCalled && statLastCalled > Date.now() - 500) {
			if (!statResult)
				statWaitors.push(F)
			else
				F(statResult[0], statResult[1])
		}
		else {
			statWaitors.push(F)
			statLastCalled = Date.now()
			statResult = null
			Ext.z.fs.stat(self.path, function() {
				statResult = [arguments[0], arguments[1]]
				if (arguments[1] && self.header && (arguments[1].mtime > self.header.mtime)) {
					// invalidate the file contents that have been read. TODO what if readfile has been called before this, but has not returned till after this, is it the new contents that stat reflects or old?
					hasCalledReadFile = false
					readFileResult = null
				}
				self.header = arguments[1]
				while(statWaitors.length > 0)
					statWaitors.pop().call(null, arguments[0], arguments[1])
			})
		}
	}
	
	this.readFile = function(F) {
		// TODO we don't want to cache files that are too big.
		var self = this
		self.stat(Ext.emptyFn)
		if (hasCalledReadFile) {
			if (!readFileResult)
				readFileWaitors.push(F)
			else
				F(readFileResult[0], readFileResult[1])
		} else {
			readFileWaitors.push(F)
			hasCalledReadFile = true
			Ext.z.fs.readFile(this.path, function() {
				hasCalledReadFile = true
				readFileResult = [arguments[0], arguments[1]]
				self.contents = arguments[1]
				while(readFileWaitors.length > 0)
					readFileWaitors.pop().call(null, arguments[0], arguments[1])
			})
		}
	}
}

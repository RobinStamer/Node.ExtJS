const	Ext	= require('Ext')('Ext.class')
	,fs	= require('fs')
	
Ext.ns('Ext.data')

/**
 * @class Ext.data.File
 * @extends fs.ReadStream
 *
 * Streams a file from the filesystem.
 *
 * @constructor
 * @param {Object} cfg
 */
class File extends fs.ReadStream {
	/**
	 * @cfg {String} name File path to read
	 */

	/**
	 * @cfg {String} encoding Encoding to use for reading the file, defaults to utf8
	 */
	constructor(cfg) {
		super(cfg.name, {
			encoding: cfg.encoding || 'utf8'
		})

		this.render = true
	}
}

Ext.reg('file', File)

Ext.data.File = File

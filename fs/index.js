var	path	= require('path'),
	fs	= require('fs');

Ext.ns('Ext.fs')

// Original: https://github.com/substack/node-mkdirp (Mit/X11)

/**
 * @class Ext.fs
 * @singleton
 */

/**
 * Creates a directory and all necessary parent directories, asynchronously.
 *
 * @method mkdirP
 * @param {String} p Path to create
 * @param {Number} mode Octal mode mask
 * @param {Function} f Callback, called with error on error, null or undefined on success
 */
Ext.fs.mkdirP = function(p, mode, f) {
    var cb = f || function () {};
    p = path.resolve(p);

	// 448 == 0700

    var ps = path.normalize(p).split('/');
    fs.exists(p, function (exists) {
        if (exists) cb(null)
        else Ext.fs.mkdirP(ps.slice(0,-1).join('/'), mode || 448, function (err) {
            if (err && err.code !== 'EEXIST') cb(err)
            else fs.mkdir(p, mode || 448, function (err) {
                if (err && err.code !== 'EEXIST') cb(err)
                else cb()
            })
        })
    })
}

/**
 * Loads a JSON-encoded object from a specified file.
 *
 * @method loadJSON
 * @param {String} filename Path to load the file from
 * @param {String} enc File encoding to use
 * @return {Any}
 */
Ext.fs.loadJSON = function(filename, enc) {
	return JSON.parse(fs.readFileSync((Ext.path || function(f) { return f })(filename), enc).toString())
}

/**
 * Writes an object to a given file, as JSON.
 *
 * @method saveJSON
 * @param {String} filename Path to save the file to
 * @param {Any} data Data to encode as JSON
 * @param {String} enc File encoding to use
 */
Ext.fs.saveJSON = function(filename, data, enc) {
	return fs.writeFileSync((Ext.path || function(f) { return f })(filename), JSON.stringify(data), enc)
}

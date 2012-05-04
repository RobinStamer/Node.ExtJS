var	path	= require('path'),
	fs	= require('fs');

Ext.ns('Ext.fs')

// Original: https://github.com/substack/node-mkdirp (Mit/X11)

Ext.fs.mkdirP = function(p, mode, f) {
    var cb = f || function () {};
    p = path.resolve(p);
    
    var ps = path.normalize(p).split('/');
    path.exists(p, function (exists) {
        if (exists) cb(null)
        else mkdirP(ps.slice(0,-1).join('/'), mode, function (err) {
            if (err && err.code !== 'EEXIST') cb(err)
            else fs.mkdir(p, mode, function (err) {
                if (err && err.code !== 'EEXIST') cb(err)
                else cb()
            })
        })
    })
}

Ext.fs.loadJSON = function(filename, enc) {
	return JSON.parse(fs.readFileSync(filename, enc).toString())
}

Ext.fs.saveJSON = function(filename, data, enc) {
	return fs.writeFileSync(filename, JSON.stringify(data), enc)
}

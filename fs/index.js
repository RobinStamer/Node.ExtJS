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

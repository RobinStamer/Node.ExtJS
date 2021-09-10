This port will handle the porting of Ext.data and Ext.util classes, as well as any functionality that doesn't depend on a DOM being present.  It does not handle the porting of the Grid, or any of the classes that require a DOM.  Porting is done with a least-effort basis, so the files are mostly the same, just with an added "var Ext = ..." line to make them work.  Do *not* require a sub-module (eg: Ext.util.MixedCollection) directly as none of them actually return anything.

There are extensions to the original layout, a rough outline as follows:

* Ext: is now a function that will load more modules, returns Ext
* Ext.game: a collection of modules that add classes and functions to deal with the mechanics of games
* Ext.ux.mongo: Children of Ext.data classes to handle access to MongoDB, requires the `mongo` module.

##Extensions

###Ext.xcreate() (From Ext('Ext.+'))

An extension of Ext.create() that will automatically load the xtype based on the information in var/registry.json.  This is populated with sbin/regCache.

##Examples

    var Ext = require('Ext')('Ext.util.MixedCollection')
   
    var mc = new Ext.util.MixedCollection
    mc.add({id:'x',foo:'bar'})
    mc.add({id:'y',foo:'baz'})
   
    mc.get(1) == mc.get('y') // true

###XTemplate


    var Ext = require('Ext')('Ext.XTemplate')
    
    var x = new Ext.XTemplate([
    	'{name}\n',
    	'<tpl for="array">',
    		'{#} {name}\n',
    	'</tpl>'
    ]), o = {
    	array: [{name: 'Joe'}, {name: 'Bob'}],
    	name: 'Demo'
    }
    
    console.log(x.apply(o))

Output:

    Demo
    1 Joe
    2 Bob


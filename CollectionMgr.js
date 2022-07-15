/*!
TODO: FIX copyright
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.isNode && Ext('Ext.util.MixedCollection')

/**
 * @class Ext.CollectionMgr
 * <p>Provides a registry of all Collections (instances of {@link Ext.data.MixedCollection} or any subclass
 * thereof) on a page so that they can be easily accessed by {@link Ext.data.MixedCollection collection}
 * {@link Ext.data.MixedCollection#id id} (see {@link #get}, or the convenience method {@link Ext#getCmp Ext.getCmp}).</p>
 * <p>This object also provides a registry of available Collection <i>classes</i>
 * indexed by a mnemonic code known as the Collection's {@link Ext.data.MixedCollection#xtype xtype}.
 * The <code>{@link Ext.data.MixedCollection#xtype xtype}</code> provides a way to avoid instantiating child Collections
 * when creating a full, nested config object for a complete Ext page.</p>
 * <p>A child Collection may be specified simply as a <i>config object</i>
 * as long as the correct <code>{@link Ext.data.MixedCollection#xtype xtype}</code> is specified so that if and when the Collection
 * needs rendering, the correct type can be looked up for lazy instantiation.</p>
 * <p>For a list of all available <code>{@link Ext.data.MixedCollection#xtype xtypes}</code>, see {@link Ext.Collection}.</p>
 * @singleton
 */
Ext.CollectionMgr = function() {
    var all = new Ext.util.MixedCollection(false, o => o.id)

    return {
        /**
         * Registers a collection
         * @param {Ext.data.MixedCollection} c The collection
         */
        register: function(c){
            all.add(c)
        },

        /**
         * Unregisters a collection.
         * @param {Ext.data.MixedCollection} c The collection
         */
        unregister: function(c){
            all.remove(c)
        },

        /**
         * Returns a collection by {@link Ext.data.MixedCollection#id id}.
         * For additional details see {@link Ext.util.MixedCollection#get}.
         * @param {String} id The collection {@link Ext.data.MixedCollection#id id}
         * @return Ext.data.MixedCollection The Collection, <code>undefined</code> if not found, or <code>null</code> if a
         * Class was found.
         */
        get: function(id) {
            return all.key(id)
        },

        /**
         * Registers a function that will be called when a Collection with the specified id is added to CollectionMgr. This will happen on instantiation.
         * @param {String} id The collection {@link Ext.data.MixedCollection#id id}
         * @param {Function} fn The callback function
         * @param {Object} scope The scope (<code>this</code> reference) in which the callback is executed. Defaults to the Collection.
         */
        onAvailable : function(id, fn, scope){
            all.on("add", function(index, o){
                if(o.id == id){
                    fn.call(scope || o, o);
                    all.un("add", fn, scope);
                }
            })
        },

        /**
         * The MixedCollection used internally for the collection cache. An example usage may be subscribing to
         * events on the MixedCollection to monitor addition or removal.  Read-only.
         * @type {MixedCollection}
         */
        all : all,
        
        /**
         * Checks if a Collection type is registered.
         * @param {Ext.data.MixedCollection} xtype The mnemonic string by which the Collection class may be looked up
         * @return {Boolean} Whether the type is registered.
         */
        isRegistered : function(xtype){
            return all.key(xtype) !== undefined;    
        }
    }
}()

/**
 * Shorthand for {@link Ext.CollectionMgr#registerType}
 * @param {String} xtype The {@link Ext.collection#xtype mnemonic string} by which the Collection class
 * may be looked up.
 * @param {Constructor} cls The new Collection class.
 * @member Ext
 * @method creg
 */
Ext.creg = Ext.CollectionMgr.register

Ext.cget = Ext.CollectionMgr.get

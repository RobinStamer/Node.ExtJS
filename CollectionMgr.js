/*!
TODO: FIX copyright
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

var Ext = require('Ext')('Ext.util.MixedCollection')

/**
 * @class Ext.ComponentMgr
 * <p>Provides a registry of all Components (instances of {@link Ext.Component} or any subclass
 * thereof) on a page so that they can be easily accessed by {@link Ext.Component component}
 * {@link Ext.Component#id id} (see {@link #get}, or the convenience method {@link Ext#getCmp Ext.getCmp}).</p>
 * <p>This object also provides a registry of available Component <i>classes</i>
 * indexed by a mnemonic code known as the Component's {@link Ext.Component#xtype xtype}.
 * The <code>{@link Ext.Component#xtype xtype}</code> provides a way to avoid instantiating child Components
 * when creating a full, nested config object for a complete Ext page.</p>
 * <p>A child Component may be specified simply as a <i>config object</i>
 * as long as the correct <code>{@link Ext.Component#xtype xtype}</code> is specified so that if and when the Component
 * needs rendering, the correct type can be looked up for lazy instantiation.</p>
 * <p>For a list of all available <code>{@link Ext.Component#xtype xtypes}</code>, see {@link Ext.Component}.</p>
 * @singleton
 */
Ext.CollectionMgr = function() {
    var all = new Ext.util.MixedCollection(false, o => o.id)

    return {
        /**
         * Registers a collection
         * @param {Ext.Collection} c The collection
         */
        register: function(c){
            all.add(c)
        },

        /**
         * Unregisters a component.
         * @param {Ext.Component} c The component
         */
        unregister: function(c){
            all.remove(c)
        },

        /**
         * Returns a component by {@link Ext.Component#id id}.
         * For additional details see {@link Ext.util.MixedCollection#get}.
         * @param {String} id The component {@link Ext.Component#id id}
         * @return Ext.Component The Component, <code>undefined</code> if not found, or <code>null</code> if a
         * Class was found.
         */
        get: function(id) {
            return all.key(id)
        },

        /**
         * Registers a function that will be called when a Component with the specified id is added to ComponentMgr. This will happen on instantiation.
         * @param {String} id The component {@link Ext.Component#id id}
         * @param {Function} fn The callback function
         * @param {Object} scope The scope (<code>this</code> reference) in which the callback is executed. Defaults to the Component.
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
         * The MixedCollection used internally for the component cache. An example usage may be subscribing to
         * events on the MixedCollection to monitor addition or removal.  Read-only.
         * @type {MixedCollection}
         */
        all : all,
        
        /**
         * Checks if a Component type is registered.
         * @param {Ext.Component} xtype The mnemonic string by which the Component class may be looked up
         * @return {Boolean} Whether the type is registered.
         */
        isRegistered : function(xtype){
            return all.key(xtype) !== undefined;    
        }
    }
}()

/**
 * Shorthand for {@link Ext.ComponentMgr#registerType}
 * @param {String} xtype The {@link Ext.component#xtype mnemonic string} by which the Component class
 * may be looked up.
 * @param {Constructor} cls The new Component class.
 * @member Ext
 * @method reg
 */
Ext.creg = Ext.CollectionMgr.register

Ext.cget = Ext.CollectionMgr.get

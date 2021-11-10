Ext.ns('Ext.ux')

/**
 * @class Ext.ux.UUID
 *
 * An easily accessible version of the node uuid library.
 */

/**
 * Creates a v4 (random) UUID.
 *
 * @method UUID
 * @return {String} random UUID
 */
Ext.ux.UUID = Ext.apply(function() {
	return Ext.ux.UUID.v4()
}, require('uuid'))

// Work around a documentation generator bug, otherwise MsgBus.js leaks into this file
/**
 * @class
 */

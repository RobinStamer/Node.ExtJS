Ext('Ext.Error')

/**
 * @class Ext.UserError
 * @extends Ext.Error
 */
Ext.UserError = Ext.extend(Ext.Error, function(message) {
	Ext.UserError.superclass.prototype.constructor.call(this)
})

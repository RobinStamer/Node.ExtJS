#!/usr/bin/env ext

Ext('Ext.opt.hyper.DHT')

class DHTBootstrap extends Hyper.DHT {
	constructor(cfg) {
		super(Ext.apply({
			bootstrap: []
			,id:	HDHT.getPeerId(cfg.host, cfg.port)
			,ephemeral:	false
			,firewalled:	true
			,anyPort:	true
		}, cfg || {}))
	}
}

Hyper.DHTBootstrap = HDHT

Ext.reg('HyperDHTBoot', Ext.opt.hyper.DHTBootstrap)
Ext.reg('HDHTBoot', Ext.opt.hyper.DHTBootstrap)

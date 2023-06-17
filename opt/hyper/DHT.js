#!/usr/bin/env ext

Ext('Ext.opt.hyper')

Hyper.lib.DHT	= require('hyperdht')
Hyper.lib.peer	= require('dht-rpc/lib/peer')

class HDHT extends Hyper.lib.DHT {
	constructor(cfg) {
		super(Ext.applyIf(cfg || {}, {
			host:	'0.0.0.0'
		}))
		this.cfg = cfg
	}

	static getPeerId(host, port) {
		return Hyper.lib.peer.id(host, port)
	}

	static bootstrap(host, port, cfg) {
		return Ext.xcreate(Ext.apply({
			xtype:	'HDHTBoot'
			,host
			,port
		}, cfg || {}))
	}

	get idString() {
		return this.id.toString('hex')
	}

	onAddNode(func) {
		// TODO: wrap PeerInfo object
		// node.id.toString('hex')
		return this.on('add-node', func)
	}

	// x.nodes.toArray().map(o => { return {host: o.host, port: o.port, id: o.id.toString('hex')} })
	//eachPeer(fn)
}

Hyper.DHT = HDHT

Ext.reg('HyperDHT', Ext.opt.hyper.DHT)
Ext.reg('HDHT', Ext.opt.hyper.DHT)

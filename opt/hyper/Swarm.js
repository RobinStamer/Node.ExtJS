#!/usr/bin/env ext

Ext('Ext.opt.hyper.DHT')

Hyper.load('Swarm', 'hyperswarm')

class Swarm extends Hyper.lib.Swarm {
	constructor(cfg) {
		super(cfg)
		this.cfg = cfg
	}

	static DHT(cfg) {
	}

	get publicKey() {
		return this.keyPair.publicKey
	}

	get publicKeyStr() {
		return this.publicKey.toString('hex')
	}

	get privateKey() {
		return this.keyPair.privateKey
	}

	get privateKeyStr() {
		return this.privateKey.toString('hex')
	}

	createServer() {
		return this.dht.createServer()
		// TODO: call srv.listen(keyPair)
	}

	connect(...args) {
		return this.dht.connect(...args)
	}

	listenTopic(topic) {
		this.join(this.validateTopic(topic), {server: true, client: false})
	}

	connectTopic(topic) {
		this.join(this.validateTopic(topic), {server: false, client: true})
	}

	validateTopic(topic) {
		// TODO: actually do the thing
		return topic
	}

	generateTopic(str) {
		return Buffer.alloc(32).fill(str)
	}
}

Hyper.Swarm = Swarm

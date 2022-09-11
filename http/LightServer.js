/*
	Lightnode web server platform. Author: Tim Lind (Next Generation Spinners)
*/

Ext('Ext.z', 'Ext.log').ns('Ext.http')

Ext.rq('fs', 'path', 'url', 'events')

// this emitter shows the receive / delegate / emit pattern,
// but in reality the pattern is hard coded for each event type as seen in Server.
// in future it may emit events that indicate event reception / delegation,
// so that the delegation logic can be applied through listeners as opposed requiring passage through hardcoded event reception functions,
// until then the delegation system is only relevant to http servers (they have the request event).
class EventEmitter extends Ext.z.events.EventEmitter {
	constructor(cfg) {
		super()
		this.cfg = cfg
	}

	// receive an event to emit, potentially delegating as opposed to emitting from this object
	receive(event, ...args) {
		this.delegate(event, ...args)
	}

	// will either pass the event on to another emitter or emit the event from itself.
	delegate(event, ...args) {
		this.emit(event, ...args)
	}

	// emit an event to all of the event's listeners on this emitter
	// this.emit = function(event /* , ... */) {
	//	return events.EventEmitter.prototype.emit.apply(this, arguments)
	// }
}

/* This is a general server type, it uses the pattern of receiving / delegating / emitting requests.
*/
class LightServer extends EventEmitter {
	constructor(cfg) {
		super(cfg)
	}

	// A request will be received through this function,
	// which will pass it to delegate,
	// which decides whether this server handles the request, 
	// otherwise it will be received by (delegated to) another server by the delegate function.
	receiveRequest(req, resp) {
		var delegateTo = this.delegateRequest(req, resp)
		
		if (!delegateTo)
			return
			
		if (delegateTo == this) {
			this.emitRequest(req, resp)
			return
		}

		if (delegateTo instanceof LightServer)
			delegateTo.receiveRequest(req, resp)
		else if (typeof delegateTo == 'function')
			delegateTo(req, resp)
		else
			Ext.log.error('lighthttp', 'Couldn\'t delegate the request to the specified object.')
	}

	// This function returns a Server object that the request should be delegated to, to not delegate it must return itself.
	// It can also a return a function instead, which will be executed with the same parameters as receiveRequest().
	delegateRequest(req, resp) {
		return this
	}

	// This function emits a request event with a given request and response pair.
	// It's presence reinforces the pattern of accepting a request to process, and enables easy hooking up from one request emitting to another.
	emitRequest(request, response) {
		this.emit('request', request, response)
	}

	init(http) {
		var self = this

		http.on('request', function(rq, rs) {
			self.receiveRequest(rq, rs)
		})
	}
}

Ext.http.LightServer = LightServer

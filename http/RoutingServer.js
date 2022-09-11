/*
	Lightnode web server platform. Author: Tim Lind (Next Generation Spinners)
*/

Ext('Ext.http.LightServer', 'Ext.util.MixedCollection')

/* A collection of custom named child servers is lazily created and maintained throughout the life of this server.
	- getting a child server with any name will create it if it does not exist
	- if you want to customize the serving of just a portion of the request, on initialization of this server, access a child server to create and customize it, then use delegation
*/
class PreRoutingServer extends Ext.http.LightServer {
	// should this accept a parent server?
	constructor(cfg) {
		super(cfg)
		this.name	= cfg.name || ''
		this.fullName	= cfg.fullName || ''
		this.parent	= cfg.parent || null
		this.children	= new Ext.util.MixedCollection(false, o => { return o.name })
	}

	// when getChild needs to create a child it calls this function, which can be a constructor itself,
	// or it can instantiate and return and object, there is no type requirement for the object returned.
	constructChild(name) {
		return new this.constructor({
			fullName:	this.fullName + name
			,parent:	this
			,name:	name
		})
	}

	/* Return the name of the child server for a given request. 
		It's recommended to keep a consistent means of naming child servers in a parent server,
		so that the same naming pattern is used for all children of one server, 
		this function can be overriden by external code or subclasses for that purpose.
		- This will be used by the delegation aspect to get the next server to delegate to.
		- Can also prevent any delegation by returning falsy.
		- Customize to delegate for example, based on the request host or based on the next folder name.
	*/
	getChildName(req) {
		return null
	}

	/* Lazily creates a child server and caches under the given name for the duration of this object's life.
		- This is used by the delegate function which will use getChildName as the parameter to this call.
		- Can be called publicly, but becareful that the name pattern used doesn't clash with what getChildName provides.
		- Not intended for overriding
	*/
	getChild(name) {
	/*	if (!this.children.get(name)) {
			this.children.add(this.constructChild(name))
		} //*/

		return this.children.get(name) || null
	}

	register(name, srv) {
		srv.name = name

		this.children.add(srv)
	}
}

/* 
*/
class RoutingServer extends PreRoutingServer {
	constructor(cfg) {
		super(cfg)
		// run the delegate function for each request
		// if we don't want the server to do any delegation, we can override the delegate function with a noop (it is already a noop anyway).
		// note: we make sure here that we lookup the delegate function for each request, so that it can be overriden.
	}

	// The delegate function accepts a request and either calls receiveRequest on some other server it delegates the request to,
	// or it calls emitRequest on this server if not delegated to another.
	// the getChildName function is used to decide on the delegation process, so this function need not be overriden.
	// This implementation will delegate if getChildName returns a non falsy value and a child already exists for that name
	// the desirably delegation settings are : 'no', 'all', 'preconfigured', and the default here is 'preconfigured'.
	delegateRequest(req, resp) {
		var name = this.getChildName(req)

		if (name && this.getChild(name)) {
			return this.getChild(name)
		} else {
			return this
		}
	}
}

Ext.http.PreRoutingServer = PreRoutingServer
Ext.http.RoutingServer = RoutingServer

/*
	Lightnode web server platform. Author: Tim Lind (Next Generation Spinners)
*/

Ext('Ext.http.RoutingServer')

class Server extends Ext.http.RoutingServer {
	constructor(cfg) {
		super(cfg)

		this.addListener('request', function(req, resp) {
			this.serveRequest(req, resp)
		})
	}

	// serving

	serveRequest(req, resp) {
		
	}

	// responding

	// these functions can be overriden to provide custom logic

	sendNone(req, resp) {
		resp.writeHead(404, { server: 'lightnode' })
		resp.end()
	}

	sendAuthorize(req, resp) {
		throw new Error("sendAuthorize is Not Implemented")
	}

	sendForbidden(req, resp) {
		resp.writeHead(403, { server: 'lightnode' })
		resp.end()
	}

	sendClientError(req, resp, error) {
		resp.writeHead(400)
		// TODO include error message
		resp.end()
	}

	sendServerError(req, resp, error) {
		resp.writeHead(500)
		resp.end()
	}
}

Ext.http.Server = Server

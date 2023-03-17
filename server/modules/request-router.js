
class UrlPart {
    constructor(value) {
        if (value[0] == ':') {
            this._name = value.substring(1);
        } else {
            this._value = value;
        }
    }
    get Value() { return this._value; }
    get ParamName() { return this._name; }

    isMatch(other) {
        return this._name != null || this._value == other.Value;
    }

    isParam() {
        return this._name != null;
    }


}

class Handler {
    constructor(method, urlMatch, handlerFunction) {
        this._method = method.toUpperCase();
        this._urlMatch = urlMatch;
        this._handlerFunction = handlerFunction;
        this._urlParts = this._parseUrl(urlMatch);
    }

    isMatch(req) {
        if (req.method.toUpperCase() != this._method) {
            return false;
        }
        const [url, query] = req.url.split('?');
        const urlParts = this._parseUrl(url);

        if (this._urlParts.length > urlParts.length) {
            return false;
        }
        for (let index = 0; index < this._urlParts.length; index++) {
            const handlerPart = this._urlParts[index];
            const requestPart = urlParts[index];
            if (!handlerPart.isMatch(requestPart)) {
                return false;
            }
        }
        return true;
    }

    async callHandlerFunction(req, res) {
        const params = {};
        const [url, query] = req.url.split('?');

        const urlParts = this._parseUrl(url);
        for (let index = 0; index < this._urlParts.length; index++) {
            const handlerPart = this._urlParts[index];
            const requestPart = urlParts[index];

            if (handlerPart.isParam()) {
                params[handlerPart.ParamName] = requestPart.Value;
            }
        }
        req.path = "/" + urlParts.slice(this._urlParts.length)
            .map(part => { return part.Value; })
            .join('/');

        if (query != null) {
            const qparams = query.split('&');
            for (let qp of qparams) {
                const [name, value] = qp.split('=');
                params[name] = value;
            }
        }
        req.params = params;
        this._handlerFunction(req, res);
    }

    _parseUrl(url) {
        if (url[0] == '/') {
            url = url.substring(1);
        }
        if (url.length == 0) {
            return [];
        }

        const parts = url.split('/');
        return parts.map(part => { return new UrlPart(part); });
    }
}

class RequestRouter {
    constructor() {
        this._handlers = [];
    }

    addHandler(method, urlMatch, handlerFunction) {
        if (Array.isArray(method)) {
            for (let m of method) {
                this.addHandler(m, urlMatch, handlerFunction);
            }
        } else {
            this._handlers.push(new Handler(method, urlMatch, handlerFunction));
        }
    }

    returnError(req, res) {
        const contentType = req.headers['content-type'];
        if (contentType == 'application/json') {
            res.end(JSON.stringify({ success: false }));
        } else {
            res.statusCode = 404;
            res.end("Not Found: " + req.url);
        }
    }
    async handle(req, res) {
        const handler = this._handlers.find(h => { return h.isMatch(req); });
        if (handler == null) {
            this.returnError(req, res);
        } else {
            req.body = await this.getBody(req);
            handler.callHandlerFunction(req, res);
        }
    }

    async getBody(req) {
        const buffers = [];

        for await (const chunk of req) {
            buffers.push(chunk);
        }

        const body = Buffer.concat(buffers).toString();
        if (req.headers['content-type'] == 'application/json') {
            return JSON.parse(body);
        }
        return body;
    }
}

const METHODS = {
    "POST": "post",
    "GET": "get",
    "DELETE": "delete",
    "PUT": "put"
};

function createRouter() {
    return new RequestRouter();
}

exports.METHODS = METHODS;
exports.createRouter = createRouter;


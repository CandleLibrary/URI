let fetch = (typeof window !== "undefined") ? window.fetch : null;

const uri_reg_ex = /(?:([a-zA-Z][\dA-Za-z\+\.\-]*)(?:\:\/\/))?(?:([a-zA-Z][\dA-Za-z\+\.\-]*)(?:\:([^\<\>\:\?\[\]\@\/\#\b\s]*)?)?\@)?(?:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|((?:\[[0-9a-f]{1,4})+(?:\:[0-9a-f]{0,4}){2,7}\])|([^\<\>\:\?\[\]\@\/\#\b\s\.]{2,}(?:\.[^\<\>\:\?\[\]\@\/\#\b\s]*)*))?(?:\:(\d+))?((?:[^\?\[\]\#\s\b]*)+)?(?:\?([^\[\]\#\s\b]*))?(?:\#([^\#\s\b]*))?/i;

const STOCK_LOCATION = {
    protocol: "",
    host: "",
    port: "",
    path: "",
    hash: "",
    query: "",
    search: "",
    hostname: "",
    pathname: ""
};

function getCORSModes(url) {
    const IS_CORS = (URL.GLOBAL.host !== url.host && !!url.host);
    return {
        IS_CORS,
        mode: IS_CORS ? "cors" : "same-origin", // CORs not allowed
        credentials: IS_CORS ? "omit" : "include",
    };
}

function fetchLocalText(url, m = "cors"): Promise<string> {

    return new Promise((res, rej) => {
        fetch(url + "", Object.assign({
            method: "GET"
        }, getCORSModes(url))).then(r => {

            if (r.status < 200 || r.status > 299)
                r.text().then(rej);
            else
                r.text().then(res);
        }).catch(e => rej(e));
    });
}

function fetchLocalJSON(url, m = "cors"): Promise<object> {
    return new Promise((res, rej) => {
        fetch(url + "", Object.assign({
            method: "GET"
        }, getCORSModes(url))).then(r => {
            if (r.status < 200 || r.status > 299)
                r.json().then(rej);
            else
                r.json().then(res).catch(rej);
        }).catch(e => rej(e));
    });
}

function submitForm(url, form_data, m = "same-origin") {
    return new Promise((res, rej) => {
        var form;

        if (form_data instanceof FormData)
            form = form_data;
        else {
            form = new FormData();
            for (let name in form_data)
                form.append(name, form_data[name] + "");
        }

        fetch(url + "", Object.assign({
            method: "POST",
            body: form
        }, getCORSModes(url))).then(r => {
            if (r.status < 200 || r.status > 299)
                r.text().then(rej);
            else
                r.json().then(res);
        }).catch(e => e.text().then(rej));
    });
}

function submitJSON(url, json_data, m = "same-origin") {
    return new Promise((res, rej) => {
        fetch(url + "", Object.assign({
            method: "POST",
            body: JSON.stringify(json_data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }, getCORSModes(url))).then(r => {
            if (r.status < 200 || r.status > 299)
                r.json().then(rej);
            else
                r.json().then(res);
        }).catch(e => e.text().then(rej));
    });
}



/**
 *  Used for processing URLs, handling `document.location`, and fetching data.
 */
class URL {

    static polyfill: () => void;
    static simulate: () => void;
    /**
     * A Global URL object that points to the current execution environment location.
     */
    static GLOBAL: URL;
    /**
     * Resource Cache
     */
    static RC: Map<string, any>;

    /**
     * URL protocol
     */
    protocol: string;

    /**
     * Username string
     */
    user: string;

    /**
     * Password string
     */
    pwd: string;

    /**
     * URL hostname
     */
    host: string;

    /**
     * URL network port number.
     */
    port: number;

    /**
     * URL resource path
     */
    path: string;

    /**
     * URL query string.
     */
    query: string;

    /**
     * Hashtag string
     */
    hash: string;

    /**
     * Map of the query data
     */
    map: Map<string, any>;

    /** Allows simulated resources to be added as a key value pair, were the key is a URI string and the value is string data.*/
    static addResource: (n: string, v: string) => void;

    /**
     * Resolves a URL relative to an original url. If the environment is NodeJS, 
     * then node_module resolution may be used if the relative path
     * does not begin with a ./ or ../.
     * @param URL_or_url_new 
     * @param URL_or_url_original 
     */
    static resolveRelative(
        URL_or_url_new: URL | string,
        URL_or_url_original: URL | string
            = (URL.GLOBAL)
                ? URL.GLOBAL
                : (typeof document != "undefined" && typeof document.location != "undefined")
                    ? document.location.toString()
                    : null
    ): URL | null {

        const
            URL_old = new URL(URL_or_url_original),
            URL_new = new URL(URL_or_url_new);

        if (!(URL_old + "") || !(URL_new + "")) return null;

        if (URL_new.path[0] != "/") {

            let a = URL_old.path.split("/");
            let b = URL_new.path.split("/");

            if (b[0] == "..") a.splice(a.length - 1, 1);
            for (let i = 0; i < b.length; i++) {
                switch (b[i]) {
                    case ".": a.splice(a.length - 1, 0);
                    case "..":
                        a.splice(a.length - 1, 1);
                        break;
                    default:
                        a.push(b[i]);
                }
            }
            URL_new.path = a.join("/");
        }
        return URL_new;
    }

    constructor(url: string | URL | Location = "", USE_LOCATION = false) {

        let
            IS_STRING = true,
            IS_LOCATION = false,
            location = (typeof (document) !== "undefined") ? document.location : STOCK_LOCATION;

        if (typeof (Location) !== "undefined" && url instanceof Location) {
            location = url;
            url = "";
            IS_LOCATION = true;
        }

        if ((!url || typeof (url) != "string") && !(<unknown>url instanceof URL)) {
            IS_STRING = false;

            IS_LOCATION = true;

            if (URL.GLOBAL && USE_LOCATION)
                return URL.GLOBAL;
        }

        /**
         * URL protocol
         */
        this.protocol = "";

        /**
         * Username string
         */
        this.user = "";

        /**
         * Password string
         */
        this.pwd = "";

        /**
         * URL hostname
         */
        this.host = "";

        /**
         * URL network port number.
         */
        this.port = 0;

        /**
         * URL resource path
         */
        this.path = "";

        /**
         * URL query string.
         */
        this.query = "";

        /**
         * Hashtag string
         */
        this.hash = "";

        /**
         * Map of the query data
         */
        this.map = null;


        if (url instanceof URL) {
            this.protocol = url.protocol;
            this.user = url.user;
            this.pwd = url.pwd;
            this.host = url.host;
            this.port = url.port;
            this.path = url.path;
            this.query = url.query;
            this.hash = url.hash;
        } else if (IS_STRING) {
            let part = (<string>url).match(uri_reg_ex);

            //If the complete string is not matched than we are dealing with something other 
            //than a pure URL. Thus, no object is returned. 
            if (part[0] !== url) return null;

            this.protocol = part[1] || ((USE_LOCATION) ? location.protocol : "");
            this.user = part[2] || "";
            this.pwd = part[3] || "";
            this.host = part[4] || part[5] || part[6] || ((USE_LOCATION) ? location.hostname : "");
            this.port = parseInt(part[7]) || ((USE_LOCATION) ? parseInt(location.port) : 0);
            this.path = part[8] || ((USE_LOCATION) ? location.pathname : "");
            this.query = part[9] || ((USE_LOCATION) ? location.search.slice(1) : "");
            this.hash = part[10] || ((USE_LOCATION) ? location.hash.slice(1) : "");

        } else if (IS_LOCATION && location) {
            this.protocol = location.protocol.replace(/\:/g, "");
            this.host = location.hostname;
            this.port = parseInt(location.port);
            this.path = location.pathname;
            this.hash = location.hash.slice(1);
            this.query = location.search.slice(1);
            this._getQuery_();

            if (USE_LOCATION) {
                URL.GLOBAL = this;
                return URL.GLOBAL;
            }
        }
        this._getQuery_();
    }


    /**
    URL Query Syntax
 
    root => [root_class] [& [class_list]]
         => [class_list]
 
    root_class = key_list
 
    class_list [class [& key_list] [& class_list]]
 
    class => name & key_list
 
    key_list => [key_val [& key_list]]
 
    key_val => name = val
 
    name => ALPHANUMERIC_ID
 
    val => NUMBER
        => ALPHANUMERIC_ID
    */

    /**
     * Pulls query string info into this.map
     * @private
     */
    _getQuery_() {
        if (this.query) {
            const data = this.query
                .split(/(?<!\\)\?/)
                .map(s => s.split("="))
                .map(s => (s[1] = s[1] || true, s));
            this.map = new Map<string, string>(data);
        }
    }

    setPath(path) {

        this.path = path;

        return new URL(this);
    }

    setLocation() {
        history.replaceState({}, "replaced state", `${this}`);
        //window.onpopstate();
    }

    toString() {
        let str = [];

        if (this.host) {

            if (this.protocol)
                str.push(`${this.protocol}://`);

            str.push(`${this.host}`);
        }

        if (this.port)
            str.push(`:${this.port}`);

        if (this.path)
            str.push(`${this.path[0] == "/" || this.path[0] == "." ? "" : "/"}${this.path}`);

        if (this.query)
            str.push(((this.query[0] == "?" ? "" : "?") + this.query));

        if (this.hash)
            str.push("#" + this.hash);


        return str.join("");
    }

    /**
     * Pulls data stored in query string into an object an returns that.
     * @param      {string}  class_name  The class name
     * @return     {object}  The data.
     */
    getData(class_name = "") {
        if (this.map) {
            let out = {};
            let _c = this.map.get(class_name);
            return _c;
        }
        return null;
    }

    /**
     * Sets the data in the query string. Wick data is added after a second `?` character in the query field, 
     * and appended to the end of any existing data.
     * @param     {object | Model | AnyModel}  data The data
     * @param     {string}  class_name  Class name to use in query string. Defaults to root, no class 
     */
    setData(data_name: string = "", value: any) {

        if (data_name) {

            let map = this.map = new Map();

            map.set(data_name, value);

            let str = [];

            for (const [key, value] of map.entries()) {
                if (!value) { }
                else if (value === true)
                    str.push(`${key}`);
                else
                    str.push(`${key}=${value}`);
            }

            this.query = str.join("?");
        } else {
            this.query = "";
        }

        return this;
    }


    /**
     * Fetch a string value of the remote resource. 
     * Just uses path component of URL. Must be from the same origin.
     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. 
     * If it is already cached, that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
     */
    fetchText(ALLOW_CACHE = false): Promise<string> {

        if (ALLOW_CACHE) {

            let resource = URL.RC.get(this.path);

            if (resource)
                return new Promise((res) => {
                    res(resource);
                });
        }

        return fetchLocalText(this).then(res => (URL.RC.set(this.path, res), res));
    }

    /**
     * Fetch a JSON value of the remote resource. 
     * Just uses path component of URL. Must be from the same origin.
     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. If it is already cached, 
     * that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
     */
    fetchJSON(ALLOW_CACHE = false): Promise<object> {

        if (ALLOW_CACHE) {

            let resource = URL.RC.get(this.path);

            if (resource)
                return new Promise((res) => {
                    res(resource);
                });
        }

        return fetchLocalJSON(this).then(res => (URL.RC.set(this.path, res), res));
    }

    /**
     * Cache a local resource at the value 
     * @param    {object}  resource  The resource to store at this URL path value.
     * @returns {boolean} `true` if a resource was already cached for this URL, false otherwise.
     */
    cacheResource(resource) {

        let occupied = URL.RC.has(this.path);

        URL.RC.set(this.path, resource);

        return occupied;
    }

    submitForm(form_data) {
        return submitForm(this, form_data);
    }

    submitJSON(json_data, mode) {
        return submitJSON(this, json_data, mode);
    }
    /**
     * Goes to the current URL.
     */
    goto() {
        return;
        //let url = this.toString();
        //history.pushState({}, "ignored title", url);
        //window.onpopstate();
        //URL.GLOBAL = this;
    }
    //Returns the last segment of the path
    get file() {
        return this.path.split("/").pop();
    }
    //returns the name of the file less the extension
    get filename() {
        return this.file.split(".").shift();
    }

    //Returns the all but the last segment of the path
    get dir() {
        return this.path.split("/").slice(0, -1).join("/") || "/";
    }

    get pathname() {
        return this.path;
    }

    get href() {
        return this.toString();
    }

    get ext() {
        const m = this.path.match(/\.([^\.]*)$/);
        return m ? m[1] : "";
    }

    get search() {
        return this.query;
    }
    /**
     * True if the path is a relative path. 
     * 
     * Path must begin with `../` or `./` to be
     * considered relative.
     */
    get IS_RELATIVE() {
        return this.path.slice(0, 3) == "../"
            || this.path.slice(0, 2) == "./";
        //|| this.path.slice(0, 1) != "/";
    }
}

/**
 * The fetched resource cache.
 */
URL.RC = new Map();

/**
 * The Default Global URL object. 
 */
URL.GLOBAL = (typeof location != "undefined") ? new URL(location) : new URL;


let SIMDATA = null;

/** Replaces the fetch actions with functions that simulate network fetches. Resources are added by the user to a Map object. */
URL.simulate = function () {
    SIMDATA = new Map;
    URL.prototype.fetchText = async d => ((d = this.toString()), SIMDATA.get(d)) ? SIMDATA.get(d) : "";
    URL.prototype.fetchJSON = async d => ((d = this.toString()), SIMDATA.get(d)) ? JSON.parse(SIMDATA.get(d).toString()) : {};
};

URL.addResource = (n, v) => (n && v && (SIMDATA || (SIMDATA = new Map())) && SIMDATA.set(n.toString(), v.toString));

type URLPolyfilledGlobal = NodeJS.Global & {
    document: {
        location: URL;
    };
    location: URL;

    fetch: (url: string, data: any) => Promise<any>;

};

let POLLYFILLED = false;

URL.polyfill = async function () {

    if (typeof (global) !== "undefined" && !POLLYFILLED) {

        POLLYFILLED = true;

        const
            fsr = (await import("fs")),
            fs = fsr.promises,
            path = (await import("path")),
            http = (await import("http")),
            //@ts-ignore
            g: URLPolyfilledGlobal = <unknown>global;

        URL.GLOBAL = new URL(process.cwd() + "/");
        g.document = g.document || <URLPolyfilledGlobal>{};
        g.document.location = URL.GLOBAL;
        g.location = URL.GLOBAL;

        const cached = URL.resolveRelative;

        URL.resolveRelative = function (new_url, old_url) {

            let
                URL_old = new URL(old_url),
                URL_new = new URL(new_url);

            const first_char = URL_new.path[0];

            if (first_char == "/") {

                //Prevent traversal outside the CWD for security purposes.
                URL_new.path = path.join(process.cwd(), URL_new.path);

                return URL_new;
            } else if (!URL_new.IS_RELATIVE) {
                //Attempt to resolve the file from the node_modules directories.

                /**
                 * TODO handle resolution of modules with a more general method. 
                 * See yarn Plug'n'Play: https://yarnpkg.com/features/pnp
                 */

                const
                    base_path = URL_old.path.split("/").filter(s => s !== ".."),
                    new_path = URL_new.path;

                let i = base_path.length;

                while (i-- >= 0) {
                    try {
                        let search_path = "";

                        if (base_path[i] == "node_modules")
                            search_path = path.join(base_path.slice(0, i + 1).join("/"), new_path);
                        else
                            search_path = path.join(base_path.slice(0, i + 1).join("/"), "node_modules", new_path);

                        const stats = fsr.statSync(search_path);

                        if (stats)
                            return new URL(search_path);

                    } catch (e) {
                        //Suppress errors - Don't really care if there is no file found. That can be handled by the consumer.
                    }
                }
            }

            return cached(URL_new, URL_old);
        };

        /**
         * Global `fetch` polyfill - basic support
         */
        fetch = g.fetch = async (url, data): Promise<any> => {

            if (data.IS_CORS) { // HTTP Fetch
                return new Promise((res, rej) => {
                    try {

                        http.get(url, data, req => {

                            let body = "";

                            req.setEncoding('utf8');

                            req.on("data", d => {
                                body += d;
                            });

                            req.on("end", () => {
                                res({
                                    status: 200,
                                    text: () => {
                                        return {
                                            then: (f) => f(body)
                                        };
                                    },
                                    json: () => {
                                        return {
                                            then: (f) => f(JSON.stringify(body))
                                        };
                                    }

                                });
                            });
                        });
                    } catch (e) {
                        rej(e);
                    }
                });


            } else { //FileSystem Fetch
                let
                    p = path.resolve(process.cwd(), "" + url),
                    d = await fs.readFile(p, "utf8");


                try {
                    return {
                        status: 200,
                        text: () => {
                            return {
                                then: (f) => f(d)
                            };
                        },
                        json: () => {
                            return {
                                then: (f) => f(JSON.parse(d))
                            };
                        }
                    };
                } catch (err) {
                    throw err;
                }
            }
        };
    }
};

Object.freeze(URL.RC);
Object.seal(URL);

export default URL;
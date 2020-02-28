/**
 * Used for processing URLs, handling `document.location`, and fetching data.
 * @param      {string}   url           The URL string to wrap.
 * @param      {boolean}  USE_LOCATION  If `true` missing URL parts are filled in with data from `document.location`.
 * @return     {URL}   If a falsy value is passed to `url`, and `USE_LOCATION` is `true` a Global URL is returned. This is directly linked to the page and will _update_ the actual page URL when its values are change. Use with caution.
 */
declare class URL {
    static polyfill: () => void;
    static simulate: () => void;
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
    port: string;
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
    static resolveRelative(URL_or_url_new: any, URL_or_url_original?: any): URL;
    constructor(url?: string, USE_LOCATION?: boolean);
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
    _getQuery_(): void;
    setPath(path: any): any;
    setLocation(): void;
    toString(): string;
    /**
     * Pulls data stored in query string into an object an returns that.
     * @param      {string}  class_name  The class name
     * @return     {object}  The data.
     */
    getData(class_name?: string): {};
    /**
     * Sets the data in the query string. Wick data is added after a second `?` character in the query field, and appended to the end of any existing data.
     * @param      {string}  class_name  Class name to use in query string. Defaults to root, no class
     * @param      {object | Model | AnyModel}  data        The data
     */
    setData(data?: any, class_name?: string): this;
    /**
     * Fetch a string value of the remote resource.
     * Just uses path component of URL. Must be from the same origin.
     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. If it is already cached, that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
     */
    fetchText(ALLOW_CACHE?: boolean): Promise<unknown>;
    /**
     * Fetch a JSON value of the remote resource.
     * Just uses path component of URL. Must be from the same origin.
     * @param      {boolean}  [ALLOW_CACHE=true]  If `true`, the return string will be cached. If it is already cached, that will be returned instead. If `false`, a network fetch will always occur , and the result will not be cached.
     * @return     {Promise}  A promise object that resolves to a string of the fetched value.
     */
    fetchJSON(ALLOW_CACHE?: boolean): Promise<unknown>;
    /**
     * Cache a local resource at the value
     * @param    {object}  resource  The resource to store at this URL path value.
     * @returns {boolean} `true` if a resource was already cached for this URL, false otherwise.
     */
    cacheResource(resource: any): any;
    submitForm(form_data: any): Promise<unknown>;
    submitJSON(json_data: any, mode: any): Promise<unknown>;
    /**
     * Goes to the current URL.
     */
    goto(): void;
    get file(): string;
    get filename(): string;
    get dir(): string;
    get pathname(): string;
    get href(): string;
    get ext(): string;
    get search(): string;
}
export default URL;

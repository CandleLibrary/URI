import URL from "../build/library/uri.js";

function assert(val){
    if(!val)
        throw new Error("Invalid")
}

await URL.server();

assert(URL.resolveRelative("./test", "/test/") + "" == "/test/test");assert(URL.resolveRelative("./test/", "/test/") + "" == "/test/test/");
assert(URL.resolveRelative("../testA/", "/testB/") + "" == "/testA/");
assert(URL.resolveRelative("../testA/", "/testB/test/") + "" == "/testB/testA/");
assert(URL.resolveRelative("./testA/", "/testB/test") + "" == "/testB/testA/");
assert(URL.resolveRelative("./././testA/", "/testB/testC/test") + "" == "/testB/testC/testA/");
assert(URL.resolveRelative(".//testA/", "/testB/test") + "" == "/testB/testA/");
assert(URL.resolveRelative("nameless", "/testB/test/t/a/b/c/d/e/g/") + "" == "nameless");
assert(URL.resolveRelative("worker_threads", "/a/b/c/d/e/f/j/h/i/j/k/l/m/") + "" == "worker_threads");
assert(URL.resolveRelative("../f/node_type_lu.js", "/a/b/c/d/e/env.js") + "" == "/a/b/c/d/f/node_type_lu.js");

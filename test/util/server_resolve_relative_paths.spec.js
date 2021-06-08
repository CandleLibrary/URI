/**[API]:testing
 * 
 * Resolve relative paths
 */

import URL from "@candlelib/uri";
import assert from "assert";

assert(URL.resolveRelative("./test", "/test/test/").path == "/test/test/test");
assert(URL.resolveRelative("../testA", "/test/test/").path == "/test/testA");
assert(URL.resolveRelative("../../testC", "/test/test/").path == "/testC");
assert(URL.resolveRelative("/test/test2", "/test/test/").path == "/test/test2");
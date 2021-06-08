/**[API]:testing
 * 
 * Utility that returns true if a given path is a subdirectory of 
 * another path.
 */

import URL from "@candlelib/uri";
import assert from "assert";

const
    root = new URL("/test/data/"),
    subA = new URL("/test/data/child/dir/"),
    subB = new URL("/test2/data/child/dir/"),
    subC = new URL("/test3/data/child/dir"),
    subE = new URL("/test/data/child/dir/test.txt"),
    subF = new URL("/test/data/test.txt"),
    same_as_root = new URL("/test/data/");

assert(subA.isSUBDIRECTORY_OF(root) == true);
assert(subB.isSUBDIRECTORY_OF(root) == false);
assert(subC.isSUBDIRECTORY_OF(root) == false);
assert(subE.isSUBDIRECTORY_OF(root) == true);
assert(subF.isSUBDIRECTORY_OF(root) == false);
assert(same_as_root.isSUBDIRECTORY_OF(root) == false);

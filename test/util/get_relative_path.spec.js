/**[API]:testing
 * 
 * Utility that creates relative path to another resource
 */

import URL from "@candlelib/uri";
import assert from "assert";

const
    rel1A = new URL("./make/some/noise/"),
    rel1B = new URL("../keep/a/lid/on/it/"),
    rel2A = new URL("/root/main/dir/my/file/"),
    rel2B = new URL("./main/my/other/file/"),
    rel3A = new URL("/root/the/jungle/main/dir/my/the/jungle/file/"),
    rel3B = new URL("./main/my/other/file/");

assert(rel1A.getRelativeTo(rel1B).path == "../../../../keep/a/lid/on/it/");
assert(rel2A.getRelativeTo(rel2B).path == "../../../my/other/file/");
assert(rel3A.getRelativeTo(rel3B).path == "../../../../../my/other/file/");

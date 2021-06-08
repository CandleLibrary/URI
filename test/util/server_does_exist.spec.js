/**[API]:testing
 * 
 * Async utility method DOES_THIS_EXISTS should return a boolean 
 * whether a filepath exits. File path can either be directory or 
 * a file. Cannot be a relative path. Only valid server side.
 */

import URL from "@candlelib/uri";
import assert from "assert";

const
    urlCWDshouldExist = URL.getCWDURL(),
    urlRelativeFileShouldNotExist = new URL("./test_dir/test_file.txt"),
    urlTestDirShouldExist = new URL.resolveRelative("./test_dir/"),
    urlTestFileShouldExist = new URL.resolveRelative("./test_dir/test_file.txt"),
    urlTestFileShouldNotExist = new URL("./test_dir/test_file_no_go.txt");

assert(await urlCWDshouldExist.DOES_THIS_EXIST() == true);
assert(await urlRelativeFileShouldNotExist.DOES_THIS_EXIST() == false);
assert(await urlTestDirShouldExist.DOES_THIS_EXIST() == true);
assert(await urlTestFileShouldExist.DOES_THIS_EXIST() == true);
assert(await urlTestFileShouldNotExist.DOES_THIS_EXIST() == false);
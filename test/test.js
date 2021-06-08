import URL from "../build/library/url.js";

import chai from "chai";

const assert = chai.assert;

if (typeof (Location) == "undefined") global.Location = class { };


'CandleLibrary URL Tests'; "#";
await URL.polyfill();

"Handles different incomplete forms of URIs"; "#";
SEQUENCE: {
    "https://www.ttt.localhost.tld.:80201/Fiesta/Free/Sunday?this=22&this=33#dataurl=sdf4f5464w32e1r32w1er54w3er1w1r3w24er5w31re21we12r14w684r36w1";
    "#";

    let uri1 = "https://www.ttt.localhost.tld.:80201/Fiesta/Free/Sunday?this=22&this=33#dataurl=sdf4f5464w32e1r32w1er54w3er1w1r3w24er5w31re21we12r14w684r36w1";

    const { protocol, host, port, path, query, hash } = new URL(uri1);

    ((protocol == "https"));
    ((host == "www.ttt.localhost.tld."));
    ((port == 80201));
    ((path == "/Fiesta/Free/Sunday"));
    ((query == "this=22&this=33"));
    ((hash == "dataurl=sdf4f5464w32e1r32w1er54w3er1w1r3w24er5w31re21we12r14w684r36w1"));
}

SEQUENCE: {
    "www.ttt.localhost.tld:80"; "#";

    let { protocol, host, port, path, query, hash } = new URL("www.ttt.localhost.tld:80");

    ((protocol == ""));

    ((host == "www.ttt.localhost.tld"));

    ((port == 80));

    ((path == ""));

    ((query == ""));

    ((hash == ""));
}

SEQUENCE: {
    "www.ttt.localhost.tld?tst=1258&more_good_toast=true"; "#";

    let uri3 = "www.ttt.localhost.tld?tst=1258&more_good_toast=true",
        { protocol, host, port, path, query, hash } = new URL(uri3);

    ((protocol == ""));

    ((host == "www.ttt.localhost.tld"));

    ((port == 0));

    ((path == ""));

    ((query == "tst=1258&more_good_toast=true"));

    ((hash == ""));
}

SEQUENCE: {

    "pop3://www.ttt.localhost.tld"; "#";

    let uri4 = "pop3://www.ttt.localhost.tld",
        { protocol, host, port, path, query, hash } = new URL(uri4);

    ((protocol == "pop3"));

    ((host == "www.ttt.localhost.tld"));

    ((port == 0));

    ((path == ""));

    ((query == ""));

    ((hash == ""));
}

SEQUENCE: {

    "/the/giver/of/toast#11235"; "#";

    let uri5 = "/the/giver/of/toast#11235",
        { protocol, host, port, path, query, hash } = new URL(uri5);


    ((protocol == ""));

    ((host == ""));

    ((port == 0));

    ((path == "/the/giver/of/toast"));

    ((query == ""));

    ((hash == "11235"));
}

{
    'Fetches local resources'; "#";

    "Gets: /test/data/test.txt";

    let url = new URL("./test/data/test.txt");

    ((await url.fetchText() == "this is the test text!"));
}

{
    "Maps data to query string"; "#";
    {
        `Maps: ?bar=foo&boo&roo=@$%^&bat=3`;

        let url = new URL("?bar=foo&boo&roo=@$%^&bat=3");

        let data = url.getData();

        ((data != undefined));

        ((data.roo != undefined));

        ((data.roo == "@$%^"));

        ((data.bat != undefined));

        ((data.bat === "3"));

        ((data != undefined));

        ((data.bar != undefined));

        ((data.bar == "foo"));
    }

    {
        `Maps: {data:"my_data"} to ?data=my_data`; "#";

        let url = new URL();

        url.setData({ data: "my_data" });

        ((url.query == "?data=my_data"));
    }

    {
        `Maps: {data:"my_data"} with class "roo" to ?roo&data=my_data`; "#";

        let url = new URL();

        url.setData({ data: "my_data", roo: true });

        ((url.query == "?data=my_data&roo"));
    }
}

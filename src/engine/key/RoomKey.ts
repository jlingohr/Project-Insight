import {Key} from "./Key";

export class RoomKey extends Key {

    protected table:string = "rooms";

    protected sKeys:{[key:string]:string} = {
        "fullname":"fullname",
        "shortname":"shortname",
        "number":"number",
        "name":"name",
        "address":"address",
        "type":"type",
        "furniture":"furniture",
        "href":"href"
    };

    protected mKeys:{[key:string]:string} = {
        "lat":"lat",
        "lon":"lon",
        "seats":"seats"
    };

    constructor() {
        super();
    }
}
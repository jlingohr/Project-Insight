import {FilterNode} from "./FilterNode";
import {Key} from "../key/Key";
import {CourseKey} from "../key/CourseKey";
import {RoomKey} from "../key/RoomKey";

export abstract class MComparisonNode extends FilterNode {

    protected table: string;
    protected key: string;
    protected value: number;
    protected keys: Key;

    constructor(query: any) {
        super();
        const tableAndKey = Object.keys(query)[0];
        const value = query[tableAndKey];
        const split = tableAndKey.split("_");
        this.table = split[0];
        this.key = split[1];
        this.value = value;
        if (this.table === "courses") {
            this.keys = new CourseKey();
        } else if (this.table === "rooms") {
            this.keys = new RoomKey();
        }
    }

    isValid(): boolean {
        if (this.table !== null && this.key !== null && this.value !== null && this.keys != null) {
            return this.keys.isValid(this.table, this.key, this.value)
        } else {
            return false;
        }
    }

    getTables():string {
        return this.table;
    }
}
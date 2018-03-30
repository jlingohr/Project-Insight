import {FilterNode} from "./FilterNode";
import {Key} from "../key/Key";
import {FilterCondition} from "./FilterCondition";
import {CourseKey} from "../key/CourseKey";
import {RoomKey} from "../key/RoomKey";

export class SComparisonNode extends FilterNode {

    private static validRegex = /^(?:\*)?(?:[^\*]*)(?:\*)?$/;

    private table:string;
    private key:string;
    private value: string;
    protected keys: Key;

    constructor(query: any) {
        super();
        const key = Object.keys(query)[0];
        const value = query[key];
        const split = key.split("_");
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
        if (this.table != null && this.key != null && this.value != null && this.keys != null) {
            return this.keys.isValid(this.table, this.key, this.value) && SComparisonNode.validRegex.test(this.value);
        } else {
            return false;
        }
    }

    buildFilter(): FilterCondition {
        const mappedKey = this.keys.mapSKeys(this.key);
        const regex = this.buildRegex();
        return (row:any):boolean => {
            return regex.test(row[mappedKey]);
        };
    }

    private buildRegex(): RegExp {
        const strippedValue = this.value.replace(/\*/g, "");
        if (this.value.startsWith("*")) {
            if (this.value.endsWith("*")) {
                return new RegExp(strippedValue); //contains string
            } else {
                return new RegExp(strippedValue + "$"); //ends with
            }
        } else if (this.value.endsWith("*")) {
            return new RegExp("^" + strippedValue); //starts with
        } else {
            return new RegExp("^" + strippedValue + "$"); //match exactly
        }
    }

    getTables():string {
        return this.table;
    }
}
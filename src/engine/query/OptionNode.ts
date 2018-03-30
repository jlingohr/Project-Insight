
import {ASTNode} from "./ASTNode";
import {Dataset} from "../../data/Dataset";
import {Key} from "../key/Key";
import {FilterCondition} from "./FilterCondition";
import {SelectCondition} from "./SelectCondition";
import {SortCondition} from "./SortCondition";
import {CourseKey} from "../key/CourseKey";
import {RoomKey} from "../key/RoomKey";

export class OptionNode extends ASTNode {
    private columns: Array<string>;
    private order?: any;

    private static OptionKey:string = "OPTIONS";
    private static ColumnKey:string = "COLUMNS";
    private static OrderKey:string = "ORDER";
    private static OrderDirections:Array<string> = ["UP","DOWN"];

    private keys: Key;

    constructor(query: any) {
        super();
        const options = query[OptionNode.OptionKey];
        const columns = options[OptionNode.ColumnKey];
        const order = options[OptionNode.OrderKey];
        this.columns = columns;
        if (order != null) {
            this.order = order;
        } else {
            this.order = undefined;
        }
        if (columns.length > 0) {
            const table = this.getTable();
            if (table === "courses") {
                this.keys = new CourseKey();
            } else if (table === "rooms") {
                this.keys = new RoomKey();
            }
        }

    }

    isValid(groupKeys?:Set<string>, applyKeys?:Set<string>): boolean {
        let isOrderValid = false;
        switch(typeof this.order) {
            case 'undefined':
                isOrderValid = true;
                break;
            case 'string':
                isOrderValid = this.columns.some((key:string) => {
                    return key == this.order;
                });
                break;
            case 'object':
                let hasProperties = this.order.hasOwnProperty('dir') && this.order.hasOwnProperty('keys');
                let hasValidDir = OptionNode.OrderDirections.some((dir:string) => {
                    return dir == this.order['dir'];
                });
                var hasAllKeys = true;
                this.order['keys'].forEach((element:string) => {
                    hasAllKeys = hasAllKeys && this.columns.some((key:string) => {
                        return key == element;
                    });
                });
                isOrderValid = hasProperties && hasValidDir && hasAllKeys;
                break;
        }

        if (groupKeys != null) {
            const validGroupLength = groupKeys.size > 0 && this.columns.length > 0;
            const isValid = this.columns.every((column:string) => {
                if (column.includes("_")) {
                    return groupKeys.has(column) && this.keys.validateAny(column);
                } else {
                    return applyKeys.has(column);
                }
            });

            return isOrderValid && validGroupLength && isValid;
        } else {

            const areColumnsValid = this.columns.length > 0 && !this.columns.some((key:string) => {
                return !this.keys.validateAny(key);
            });

            return this.columns.length > 0 && isOrderValid && areColumnsValid;
        }

    }

    buildSelect(): Array<string> {
        return this.columns.map((column:string) => {
            if (column.indexOf("_") != -1) {
                return this.keys.mapKeys(column.split("_")[1]);
            } else {
                return column;
            }
        });
    }

    buildSort(): SortCondition|undefined {
        var key:string;
        switch(typeof this.order) {
            case 'string':
                if (this.order.indexOf("_") != -1)
                    key = this.keys.mapKeys(this.order.split("_")[1]);
                else key = this.order;
                return (left:any, right:any):number => {
                    if (left[key] < right[key]) {
                        return -1;
                    } else if (left[key] > right[key]) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
            case 'object':
                return (left,right) => {
                    return this.order['keys']
                        .map((k: any) => {
                            if (k.indexOf("_") != -1)
                                key = this.keys.mapKeys(k.split("_")[1]);
                            else key = k;
                            var dir = (this.order['dir'] == "UP" ? 1 : -1);
                            if (left[key] > right[key]) return dir;
                            if (left[key] < right[key]) return -(dir);
                            else return 0;
                        })
                        .reduce((prev:any,next:any) => { // return first non-zero
                            return prev ? prev : next;
                        }, 0);
                };
            default:
                return undefined;
        }
    }

    format():Array<string> {
        return this.columns;
    }

    getTable():string {
        return this.columns[0].split("_")[0];
    }
}
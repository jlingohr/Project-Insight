import {MComparisonNode} from "./MComparisonNode";
import {Dataset} from "../../data/Dataset";
import {FilterCondition} from "./FilterCondition";
import {Key} from "../key/Key";

export class EQNode extends MComparisonNode {

    constructor(query: any) {
        super(query);
    }

    buildFilter(): FilterCondition {
        return (row:any):boolean => {
            return row[this.keys.mapMKey(this.key)] === this.value;
        };
    }
}
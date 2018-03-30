import {FilterFactory} from "./FilterFactory";
import {FilterNode} from "./FilterNode";
import {Dataset} from "../../data/Dataset";
import {FilterCondition} from "./FilterCondition";

export class NegationNode extends FilterNode {

    private filter: FilterNode;

    constructor(query:any) {
        super();
        this.filter = FilterFactory.getFilter(query);
    }

    isValid() : boolean {
        return this.filter != null && this.filter.isValid();
    }

    buildFilter(): FilterCondition {
        return (row:any):boolean => {
            return !this.filter.buildFilter()(row);
        }
    }

    getTables():string|Array<string> {
        return this.filter.getTables();
    }
}
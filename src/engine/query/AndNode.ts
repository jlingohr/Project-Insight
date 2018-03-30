import {LogicComparison} from "./LogicComparison";
import {FilterNode} from "./FilterNode";
import {FilterCondition} from "./FilterCondition";

export class AndNode extends LogicComparison {

    constructor(query: any) {
        super(query);
    }

    buildFilter(): FilterCondition {
        return this.filters.map((filter:FilterNode) => {
            return filter.buildFilter();
        }).reduce((acc: FilterCondition, cur: FilterCondition) => {
            return (row:any) => acc(row) && cur(row);
        });
    }

}
import {FilterNode} from "./FilterNode";
import {FilterCondition} from "./FilterCondition";

export class AllFilter extends FilterNode {

    buildFilter(): FilterCondition {
        return (row:any):boolean => true;
    }

    getTables(): string | Array<string> {
        return undefined;
    }

    isValid(): boolean {
        return true;
    }

}
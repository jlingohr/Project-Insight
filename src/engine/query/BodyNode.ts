import {ASTNode} from "./ASTNode";
import {FilterFactory} from "./FilterFactory";
import {FilterNode} from "./FilterNode";
import {Dataset} from "../../data/Dataset";
import {FilterCondition} from "./FilterCondition";
import {Key} from "../key/Key";
import {CourseKey} from "../key/CourseKey";
import {RoomKey} from "../key/RoomKey";

export class BodyNode extends ASTNode {

    private static key: string = "WHERE";
    private filter: FilterNode;


    constructor(query: any) {
        super();
        this.filter = FilterFactory.getFilter(query[BodyNode.key]);
    }

    isValid(): boolean {
        return this.filter != null && this.filter.isValid();
    }

    buildFilter(): FilterCondition {
        return this.filter.buildFilter();
    }

}
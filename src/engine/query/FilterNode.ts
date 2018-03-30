import {ASTNode} from "./ASTNode";
import {FilterCondition} from "./FilterCondition";

export abstract class FilterNode extends ASTNode {

    abstract buildFilter(): FilterCondition

    abstract getTables():string|Array<string>;

}
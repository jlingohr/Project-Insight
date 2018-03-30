import {Dataset} from "../../data/Dataset";
import {FilterCondition} from "./FilterCondition";

export abstract class ASTNode {

    abstract isValid(): boolean
}
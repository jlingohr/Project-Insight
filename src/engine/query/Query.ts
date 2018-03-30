import {BodyNode} from "./BodyNode";
import {ASTNode} from "./ASTNode";
import {OptionNode} from "./OptionNode";
import {FilterCondition} from "./FilterCondition";
import {SelectCondition} from "./SelectCondition";
import {SortCondition} from "./SortCondition";
import {Transformation} from "./Transformation";

export class Query extends ASTNode {

    private body: BodyNode;
    private options: OptionNode;
    private transformation?: Transformation;
    private table:string;

    constructor(query: any) {
        super();
        if (Object.keys(query).length >= 2) {
            this.options = new OptionNode(query);
            this.table = this.options.getTable();
            this.body = new BodyNode(query);
            if (query["TRANSFORMATIONS"] != null) {
                this.transformation = new Transformation(query, this.table);
            }

        }
    }

    isValid(): boolean {
        const isBodyValid = this.body != null && this.body.isValid();

        if (this.transformation != null) {
            const isTransformValid = this.transformation.isValid();
            // If a GROUP is present, all COLUMNS terms must correspond to either GROUP terms or to terms
            // defined in the APPLY block. COLUMNS terms with underscores must occur in GROUP while COLUMNS terms without underscores must be defined in APPLY
            const applyKeys = new Set(this.transformation.getApplyKeys());
            const groupKeys = new Set(this.transformation.getGroupKeys());
            const isOptionsValid = this.options != null && this.options.isValid(groupKeys, applyKeys);

            return isBodyValid && isTransformValid && isOptionsValid;
        } else {
            const isOptionsValid = this.options != null && this.options.isValid();
            return isBodyValid && isOptionsValid;
        }
    }

    apply():Transformation {
        return this.transformation;
    }

    buildFilter(): FilterCondition {
        return this.body.buildFilter();
    }

    buildSelect():Array<string> {
        return this.options.buildSelect();
    }

    buildSort():SortCondition {
        return this.options.buildSort();
    }

    format():Array<string> {
        return this.options.format()
    }

    getTable():string {
        return this.table;
    }


}
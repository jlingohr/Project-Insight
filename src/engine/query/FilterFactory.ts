import {FilterNode} from "./FilterNode";
import {AndNode} from "./AndNode";
import {OrNode} from "./OrNode";
import {NegationNode} from "./NegationNode";
import {LTNode} from "./LTNode";
import {GTNode} from "./GTNode";
import {EQNode} from "./EQNode";
import {SComparisonNode} from "./SComparisonNode";
import {AllFilter} from "./AllFilter";

export class FilterFactory {

    private static andKey: string = "AND";
    private static orKey: string = "OR";
    private static notKey: string = "NOT";
    private static lessThanKey: string = "LT";
    private static greaterThanKey: string = "GT";
    private static equalsKey: string = "EQ";
    private static isKey: string = "IS";

    public static getFilter(query: any): FilterNode {
        if (Object.keys(query).length == 0) {
            return new AllFilter();
        } else {
            const key = Object.keys(query)[0];
            const value = query[key];

            switch(key) {
                case this.andKey:
                    return new AndNode(value);

                case this.orKey:
                    return new OrNode(value);

                case this.notKey:
                    return new NegationNode(value);

                case this.lessThanKey:
                    return new LTNode(value);

                case this.greaterThanKey:
                    return new GTNode(value);

                case this.equalsKey:
                    return new EQNode(value);

                case this.isKey:
                    return new SComparisonNode(value);

                default:
                    return null;
            }
        }

    }
}
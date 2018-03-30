import {FilterNode} from "./FilterNode";
import {FilterFactory} from "./FilterFactory";

export abstract class LogicComparison extends FilterNode {

    protected filters: Array<FilterNode>;

    constructor(query: any) {
        super();
        this.filters = query.map((json:any) => {
            return FilterFactory.getFilter(json);
        });
    }

    isValid(): boolean {
        let findInvalid = (filter: FilterNode) => {
            return filter == null || !filter.isValid();
        };
        const tablesValid = new Set(this.getTables()).size == 1;

        return this.filters != null && this.filters.length > 0 && !this.filters.some(findInvalid) && tablesValid;
    }

    getTables():Array<string> {
        return [].concat.apply([], this.filters.map((filter:FilterNode) => {
            return filter.getTables();
        }));
    }
}
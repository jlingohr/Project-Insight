import {Query} from "./query/Query";
import {Dataset} from "../data/Dataset";
import {InsightResponse} from "../controller/IInsightFacade";

export class QueryProcessor  {

    private data: Dataset;
    private query: Query;

    constructor(query: Query, dataset: Dataset) {
        this.query = query;
        this.data = dataset;
    }

    execute(): Array<any> {
            return this.data.filter(this.query.buildFilter())
                .apply(this.query.apply()) //keys not mapped yet, so will need to translate
                .select(this.query.buildSelect())
                .orderBy(this.query.buildSort())
                .collect(this.query.format());//collect puts into format, which is different now
    }
}
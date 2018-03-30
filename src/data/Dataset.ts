import {Row} from "./Row";
import {FilterCondition} from "../engine/query/FilterCondition";
import {SelectCondition} from "../engine/query/SelectCondition";
import {SortCondition} from "../engine/query/SortCondition";
import {Key} from "../engine/key/Key";
import {CourseKey} from "../engine/key/CourseKey";
import {RoomKey} from "../engine/key/RoomKey";
import {Transformation} from "../engine/query/Transformation";
import {GroupedDataset} from "./GroupedDataset";

export class Dataset {
    /*
     * Dataset class carries out query operation on the specified data. For D1
     * we need to support:
     *  - filter
     *  - select
     *  - orderBy
     */

    protected data:Array<Row>;
    private size:number;
    private table:string;
    private keys:Key;

    constructor(id:string, data:Array<Row>) {
        this.data = data;
        this.size = data.length;
        this.table = id;
        if (id === "courses") {
            this.keys = new CourseKey();
        } else if (id === "rooms") {
            this.keys = new RoomKey();
        }
    }

    length(): number {
        return this.size;
    }

    select(columns:Array<string>):Dataset {
        const rows = this.data.map((row:any) => {
            return columns.reduce((a:any, e:any) => (a[e] = row[e], a), {})
        });

        return new Dataset(this.table, rows);
    }

    selectAll():Array<Row> {
        return this.data;
    }

    filter(filter:FilterCondition): Dataset {
        const filtered:Array<Row> = [];
        this.data.forEach((row:Row) => {
            if (filter(row)) {
                filtered.push(row);
            }
        });
        return new Dataset(this.table, filtered);
    }

    apply(transformation:Transformation):Dataset {
        //TODO keys not mapped yet
        if (transformation == null) {
            return this;
        } else {
            const aggregated = new GroupedDataset(this.data, transformation.getGroupKeys(), this.keys)
                .aggregate(transformation.getApply());
            return new Dataset(this.table, aggregated);
        }
    }

    orderBy(filter:SortCondition): Dataset {
        if (filter === undefined) {
            return this;
        } else {
            const sorted = this.data.sort(filter);
            return new Dataset(this.table, sorted);
        }

    }

    collect(format:Array<string>):Array<any> {
        //TODO if not a data key dont need to map
        return this.data.map((row:any) => {
            return format.reduce((a:any, e:any) => (a[e] = row[this.map(e)],a), {});
        });
    }

    private map(key:string):string {
        if (key.includes("_")) {
            return this.keys.mapKeys(key.split("_")[1])
        } else {
            return key;
        }

    }

}
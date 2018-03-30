import {Dataset} from "./Dataset";
import {Column} from "./Column";
import {Transform} from "../engine/query/transform/Transform";
import {Key} from "../engine/key/Key";

export class GroupedDataset{


    private data:Array<any>;
    private groupings: Array<string>;
    private keys:Key;

    constructor(data:Array<any>, groupings: Array<string>, keys?:Key) {
        this.data = data;
        this.groupings = groupings;
        this.keys = keys;
    }

    aggregate(transforms?: Array<Transform>):Array<any> {
        const mappings = new Map();
        const grouped = this.data.reduce((groups:any, row:any) => {
            const mapped:any = {};
            const key = this.groupings.map((group:string) => {
                const rowValue = row[this.map(group)];
                mapped[this.map(group)] = rowValue;
                return rowValue
            }).join("-");

            if (!mappings.has(key)) {
                mappings.set(key, mapped);
            }

            groups[key] = groups[key] || [];
            groups[key].push(row);
            return groups;
        }, {});

        const aggregates:any = [];
        if (transforms != null) {
            const aggregates:any = [];
            Object.keys(grouped).forEach((group:string) => {
                const acc:any = grouped[group]; //mappings.get(group);
                const mapped:any = mappings.get(group);
                transforms.forEach((transform:Transform) => {
                    const cell = transform.apply(acc);
                    mapped[cell.key] = cell.result;
                });
                aggregates.push(mapped);
            });
            return aggregates;
        } else {
            Object.keys(grouped).forEach((group:string) => {
                const acc = mappings.get(group);
                aggregates.push(acc);
            });
            return aggregates
        }
    }

    private map(col:string):string {
        if (this.keys != null && col.includes("_")) {
            const split = col.split("_");
            return this.keys.mapKeys(split[1]);
        } else {
            return col;
        }
    }


}
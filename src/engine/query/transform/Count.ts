import {Cell, Transform} from "./Transform";

export class Count extends Transform {

    constructor(applyKey:string, tKey: string) {
        super();
        this.groupName = applyKey;
        this.key = tKey;
    }

    apply(data:Array<any>):Cell {
        //TODO figure out what we're counting
        const counts =  data.reduce((acc:Set<any>, row:any) => {
            return acc.add(row[this.key]);
        }, new Set());

        return {key:this.groupName, result:counts.size};
    }
}
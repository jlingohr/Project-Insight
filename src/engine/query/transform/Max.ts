import {Cell, Transform} from "./Transform";

export class Max extends Transform {

    constructor(applyKey:string, tKey: string) {
        super();
        this.groupName = applyKey;
        this.key = tKey;
    }

    isValid():boolean {
        const hasValidmKey:boolean = this.key != null && this.validateMKey(this.key);
        return !this.groupName.includes("_") && hasValidmKey;
    }

    apply(data:Array<any>):Cell {
        const max =  data.reduce((acc:number, row:any) => {
            if (row[this.key] > acc) {
                return row[this.key];
            } else {
                return acc;
            }
        },Number.MIN_VALUE);

        return {key:this.groupName, result:max};
    }

}
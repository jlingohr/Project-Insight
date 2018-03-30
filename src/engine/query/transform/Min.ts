import {Cell, Transform} from "./Transform";

export class Min extends Transform {

    constructor(applyKey:string, tKey: string) {
        super();
        this.groupName = applyKey;
        this.key = tKey;
    }

    isValid():boolean {
        const hasValidmKey:boolean = this.key != null && this.validateMKey(this.key);
        return !this.groupName.includes("_") && hasValidmKey;
    }

    apply(data:any):Cell {
        const min =  data.reduce((acc:number, row:any) => {
            if (row[this.key] < acc) {
                return row[this.key];
            } else {
                return acc;
            }
        },Number.MAX_VALUE);

        return {key:this.groupName, result:min};
    }
}
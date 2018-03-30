import {Cell, Transform} from "./Transform";
let Decimal = require("decimal.js");

export class Sum extends Transform {

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
        const values: Array<any> = data.reduce((acc,row) => {
            acc.push(row[this.key]);
            return acc;
        }, []);
        const sum = Number(values
            .map(val => new Decimal(val))
            .reduce((a,b) => a.plus(b))
            .toNumber()
            .toFixed(2));

        return {key:this.groupName, result:sum};
    }
}
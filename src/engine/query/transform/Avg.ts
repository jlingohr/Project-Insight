import {Cell, Transform} from "./Transform";
import {Sum} from "./Sum";
let Decimal = require('decimal.js');


export class Avg extends Transform {

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
        const avg = Number((values
            .map(val => <any>new Decimal(val))
            .reduce((a,b) => a.plus(b))
            .toNumber() / values.length)
            .toFixed(2));
        return {key:this.groupName, result:avg};
    }
    
}
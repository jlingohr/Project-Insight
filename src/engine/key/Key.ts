
export abstract class Key {

    protected mKeys:{[key:string]:string};
    protected sKeys:{[key:string]:string};
    protected table:string;

    public isValid(table: string, key:string, value:any):boolean {
        if (this.table ==table) {
            if (typeof value === "number") {
                return Object.getOwnPropertyNames(this.mKeys).includes(key);
            } else if (typeof value == "string") {
                return Object.getOwnPropertyNames(this.sKeys).includes(key);
            }
        }
        return false;
    }

    public validateAny(key:string): boolean {
        const split = key.split("_");
        if (split.length > 1) {
            return Object.getOwnPropertyNames(this.mKeys).includes(split[1]) || Object.getOwnPropertyNames(this.sKeys).includes(split[1]);
        } else {
            return false;
        }
    }

    public mapMKey(key:string): string {
        return this.mKeys[key];
    }

    public mapSKeys(key:string): string {
        return this.sKeys[key];
    }

    public mapKeys(key:string): string {
        let mapped = this.mapMKey(key);
        if (mapped == null) {
            return this.mapSKeys(key);
        } else {
            return mapped;
        }

    }

    public isMappedMKey(key:string):boolean {
        const mValues = Object.keys(this.mKeys).map((k:string) => this.mKeys[k]);
        //const sValues = Object.keys(this.sKeys).map((k:string) => this.sKeys[k]);

        return mValues.includes(key); //|| sValues.includes(key);
    }
}

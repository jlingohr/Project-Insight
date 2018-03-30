import {Transform} from "./transform/Transform";
import {TransformFactory} from "./transform/TransformFactory";
import {Key} from "../key/Key";
import {CourseKey} from "../key/CourseKey";
import {RoomKey} from "../key/RoomKey";

export class Transformation {

    private static TRANSFORMATION = "TRANSFORMATIONS";
    private static GROUP = "GROUP";
    private static APPLY = "APPLY";

    private groups:Array<string>;
    private apply: Array<Transform>;
    private keys:Key;
    private table:string;

    constructor(query:any, table:string) {
        //TODO this should be used as a param
        const transformations = query[Transformation.TRANSFORMATION];
        this.groups = Transformation.getGroups(transformations);
        this.apply = Transformation.getApply(transformations);
        this.table = table;
        if (table === "courses") {
            this.keys = new CourseKey();
        } else if (table === "rooms") {
            this.keys = new RoomKey();
        }
    }

    public isValid():boolean {
        if (this.groups != undefined && this.groups.length > 0) {
            const areGroupsValid = this.areGroupsValid();
            const areTransformsValid = this.areTransformsValid();
            return areGroupsValid && areTransformsValid;
        } else {
            return false;
        }
    }

    public getApplyKeys():Array<string> {
        return this.apply.map((transform:Transform) => {
            return transform.getName();
        });
    }

    public getGroupKeys():Array<string> {
        return this.groups;
    }

    getApply():Array<Transform> {
        return this.apply;
    }

    private areGroupsValid():boolean {
        return this.groups.every((group:string) => {
            const split = group.split("_",2);
            const key = split[0];
            const value = split[1];
            return this.keys.isValid(this.table, value, key);
        });
    }

    private areTransformsValid():boolean {
        const areApplysValid = this.apply.every((apply:Transform) => {
            return apply.isValid();
        });
        const areTransformsUnique = new Set(this.apply.map((apply: Transform) => apply.getName())).size == this.apply.length;

        return areApplysValid && areTransformsUnique;
    }

    private static getGroups(transformation:any): Array<string> {
        return transformation[Transformation.GROUP];
        //return Object.keys(groups).map((key:string) => {return key});
    }

    private static getApply(transformation:any): Array<Transform> {
        const apply = transformation[Transformation.APPLY];
        return apply.map((transformObj:any) => {
            return TransformFactory.newTransform(transformObj);
        });
    }
}
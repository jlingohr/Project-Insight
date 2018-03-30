import {CourseKey} from "../../key/CourseKey";
import {RoomKey} from "../../key/RoomKey";
export abstract class Transform {

    protected groupName:string;
    protected key:string;
    protected courseKey: CourseKey;
    protected roomKey: RoomKey;

    getName():string {
        return this.groupName;
    }

    isValid():boolean {
        return !this.groupName.includes("_");
    }

    protected validateMKey(key:string):boolean {
        return this.courseKey.isMappedMKey(key) || this.roomKey.isMappedMKey(key);
    }

    abstract apply(data:any):Cell;

    constructor() {
        this.courseKey = new CourseKey();
        this.roomKey = new RoomKey();
    }
}

export interface Cell {
    key:string;
    result:number|string;
}
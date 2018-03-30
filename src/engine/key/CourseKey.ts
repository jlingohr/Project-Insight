import {Key} from "./Key";

export class CourseKey extends Key {

    protected table:string = "courses";

    protected sKeys:{[key:string]:string} = {
        "dept":"Subject",
        "id":"Course",
        "instructor":"Professor",
        "title":"Title",
        "uuid":"id"
    };

    protected mKeys:{[key:string]:string} = {
        "avg":"Avg",
        "pass":"Pass",
        "fail":"Fail",
        "audit":"Audit",
        "year":"Year"
    };

    constructor() {
        super();
    }

}
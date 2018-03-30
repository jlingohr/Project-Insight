import {Transform} from "./Transform";
import {Avg} from "./Avg";
import {Count} from "./Count";
import {Max} from "./Max";
import {Min} from "./Min";
import {Sum} from "./Sum";
import {RoomKey} from "../../key/RoomKey";
import {CourseKey} from "../../key/CourseKey";

export class TransformFactory {

    private static MAX = "MAX";
    private static AVG = "AVG";
    private static COUNT = "COUNT";
    private static MIN = "MIN";
    private static SUM = "SUM";

    private static roomKeysMap = new RoomKey();
    private static courseKeysMap = new CourseKey();

    public static newTransform(transform:any): Transform {
        const key = Object.keys(transform);
        if (key != null) {
            const applyKey = key[0];
            const applyObj = transform[applyKey];
            const applyType = Object.keys(applyObj)[0];
            var applyTo = applyObj[applyType];
            if (applyTo.indexOf("_") != -1) {
                const split = applyTo.split("_");
                if (split[0] == "courses") {
                    applyTo = TransformFactory.courseKeysMap.mapKeys(applyTo.split("_")[1]);
                } else {
                    applyTo = TransformFactory.roomKeysMap.mapKeys(applyTo.split("_")[1]);
                }

            }

            switch(applyType) {
                case this.AVG:
                    return new Avg(applyKey, applyTo);

                case this.COUNT:
                    return new Count(applyKey, applyTo);

                case this.MAX:
                    return new Max(applyKey, applyTo);

                case this.MIN:
                    return new Min(applyKey, applyTo);

                case this.SUM:
                    return new Sum(applyKey, applyTo);

                default:
                    return null;
            }

        }
    }
}
import {Dataset} from "../data/Dataset";
import {SpillManager} from "../data/SpillManager";

export class Session {

    private static instance: Session;

    private datasets:Map<string, Dataset>;
    private cachePath:string;

    public constructor() {
        this.datasets = new Map<string,Dataset>();
    }

    addData(id:string, data:Array<any>):void {
        this.datasets.set(id, new Dataset(id, data));
    }

    removeData(id:string):Promise<boolean> {
        this.datasets.delete(id);
        return SpillManager.getInstance().deleteCache(id);
    }

    getData(id:string):Promise<Dataset> {
        let that = this;
        return new Promise((fulfill, reject) => {
            var data = that.datasets.get(id);
            if (data === undefined) {
                SpillManager.getInstance().loadData().then((cached:Array<[string, Array<any>]>) => {
                    cached.forEach((value:[string, Array<any>]) => {
                        const cacheData = new Dataset(id, value[1]);
                        that.datasets.set(value[0], cacheData);
                    });
                    data = that.datasets.get(id);
                    if (data != null) {
                        fulfill(data);
                    } else {
                        reject("Dataset unavailable");
                    }
                }).catch((err) => {
                    reject(err);
                })
            } else {
                fulfill(data);
            }
        })
    }

    dataExists(id:string):boolean {
        return this.datasets.get(id) !== undefined || SpillManager.getInstance().isDataCached(id);
    }

}
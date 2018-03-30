import {Dataset} from "./Dataset";
import Log from "../Util";
import {lstatSync} from "fs";

const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");
export class SpillManager {

    private static instance: SpillManager;
    private cachePath:string = this.cachePath = path.join(__dirname,"../data/resource");

    public static getInstance() {
        if (!SpillManager.instance) {
            SpillManager.instance = new SpillManager();
        }
        return SpillManager.instance;
    }

    private constructor() {

    }

    public loadData(): Promise<Array<[string, Array<any>]>> {
        const that = this;
        return new Promise((fulfill, reject) => {
            fs.readdir(that.cachePath, (err:any, files:Array<string>) => {
                const promises: Array<Promise<[string, Array<any>]>> = [];
                files.forEach((id:string) => {
                    if (id != ".gitkeep") {
                        promises.push(new Promise((fulfill, reject) => {
                            const filePath = path.join(that.cachePath, id);
                            if (lstatSync(filePath).isFile()) {
                                try {
                                    const inputStr = fs.readFileSync(filePath, "utf8");
                                    const data = JSON.parse(inputStr);
                                    fulfill([id.split(".")[0], data]);
                                } catch (err) {
                                    reject(err);
                                }
                            }
                        }));
                    }});
                Promise.all(promises).then((data:Array<[string, Array<any>]>) => {
                    fulfill(data);
                }).catch((err:any) => {
                    reject(err);
                });
            });
        });
    }

    public isDataCached(id:string): boolean {
        return fs.existsSync(path.join(this.cachePath, id + ".txt"));
    }

    public deleteCache(id:string):Promise<boolean> {
        let that = this;
        return new Promise((fulfill, reject) => {
            const filePath = path.join(that.cachePath, id + ".txt");
            fs.unlink(filePath, (err:any) => {
                if (err) {
                    reject(false);
                } else {
                    fulfill(true);
                }
            });
        });

        //fs.unlinkSync(filePath);
        //return true;
    }

    private parseJsonWithId (id: string, json: string): Array<Object> {
        // Dataset Row rules should be put here
        let jsonArr = [];
        try {
            let jsonObj = JSON.parse(json);
            if (id === "courses") {
                let result = jsonObj["result"];
                for (let r in result) {
                    if ((result.hasOwnProperty(r)) && ("Section" in result[r])) {
                        jsonArr.push(result[r]);
                    }
                }
            }
            return jsonArr;
        }
        catch (err) {
            throw {"error": "JSON failed to parse string"};
        }
    }

    public spillToDisk(id:string, data:Array<any>):Promise<boolean> {
        let that = this;
        return new Promise((fulfill, reject) => {
            const filePath = path.join(that.cachePath, id + ".txt");
            let strData = JSON.stringify(data);
            //return fs.writeFileSync(filePath, strData, {flag:'w'});
            fs.writeFile(filePath, strData, {flag:'w'}, (err:any) => {
                if(err) {
                    reject(false);
                } else {
                    fulfill(true)
                }
            });
        });

    }
}
import {Dataset} from "./Dataset";
import {WebParser} from "../parsing/WebParser";
import {ValidBuilding} from "../parsing/ValidBuilding";
import {RoomDetail} from "../parsing/RoomDetail";
var JSZip = require("jszip");

export class DataProcessor {

    private parser: WebParser;
    constructor() {
        this.parser = new WebParser();
    }

    public processData(id:string, content: string): Promise<Array<Object>> {
        let zip = new JSZip();
        return new Promise((fulfill, reject) => {
            zip.loadAsync(content,{base64:true}).then( (zipObj: JSZip) => {
                if (id === "courses") {
                    this.processCourses(zipObj).then((data:Array<Object>) => {
                        fulfill(data);
                    }).catch((err:any) => {
                        reject(err);
                    })
                } else if (id === "rooms") {
                    this.processRooms(zipObj).then((data:Array<Object>) => {
                        fulfill(data);
                    }).catch((err:any) => {
                        reject(err);
                    })
                }
                else {
                    reject("Unknown data id given");
                }
            }).catch((err:any) => {
                reject(err);
            })
        })
    }

    public processCourses(zipObj: JSZip): Promise<Array<Object>> {

        const self = this;
        return new Promise((fulfill, reject) => {
            let jsonPromises: Promise<Array<Object>>[] = [];
            zipObj.forEach(function(filePath, file) {
                if (file.dir == false) {
                    jsonPromises.push(new Promise(function (fulfill, reject) {
                        zipObj.file(filePath).async("string").then(function (jsonString: string) {
                            try {
                                let jsonRows = self.parseJsonWithId(jsonString);
                                fulfill(jsonRows);
                            }
                            catch (err) {
                                // either the file had invalid json or there were no sections; skip
                            }
                        }).catch(function (err: any) {
                            reject(err);
                        })
                    }));
                }
            });
            Promise.all(jsonPromises).then((jsonsArr:any) => {
                fulfill(jsonsArr);
            }).catch((err:any) => {
                reject(err);
            })
        });

    }

    private parseJsonWithId (json: string): Array<Object> {
        // Dataset Row rules should be put here
        let jsonArr = [];
        try {
            let jsonObj = JSON.parse(json);
            let result = jsonObj["result"];
            for (let r in result) {
                if ((result.hasOwnProperty(r)) && ("Section" in result[r])) {
                    // if section is overall, set year property to 1900
                    if (result[r]["Section"] == "overall") {
                        result[r]["Year"] = 1900;
                    } else {
                        result[r]["Year"] = Number(result[r]["Year"]);
                    }
                    jsonArr.push(result[r]);
                }
            }
            return jsonArr;
        }
        catch (err) {
            throw "Error: JSON failed to parse string";
        }
    }

    /**
     * Assume file is the directory of an unzipped dataset
     * @param {string} file
     * @returns {Promise<Dataset>}
     */
    public processRooms(unzipped:JSZip):Promise<Array<Object>> {
        const parser = this.parser;
        return new Promise((fulfill, reject) => {
            // Go through directory
            // Read index.htm
            // Read rooms
            // lat/lon and shortname + number
            // Combine into dataset

            const index = unzipped.folder("").file("index.htm");
            if (index != null) {
                index.async("string")
                    .then((data:string) => parser.getValidBuildings(data))
                    .then((validRooms: Array<ValidBuilding>) => {
                        let promises:Array<Promise<Array<RoomDetail>>> = [];
                        validRooms.forEach((building:ValidBuilding) => {
                            let regex = new RegExp(building.shortname);
                            let matched = unzipped.folder("").file(regex);
                            if (matched.length > 0) {
                                promises.push(new Promise((fulfill, reject) => {
                                    let file = matched[0]; //
                                    file.async("string")
                                        .then((data:string) => {
                                            return parser.getRoomData(data, building);
                                        })
                                        .then((data1:Array<RoomDetail>) => {
                                            fulfill(data1)
                                        })
                                        .catch((err:any) => {
                                            reject(err)
                                        });
                                }));
                            }
                        });

                        Promise.all(promises).then((rooms: Array<any>) => {
                            console.log(rooms.length);
                            fulfill(rooms);
                        }).catch((err: any) => {
                            console.log(err.message);
                            reject(err);
                        })
                    }).catch((err:any) => {
                        reject(err.message)
                    })

            } else {
                reject("No index.htm found in zip object");
            }
        })
    }
}
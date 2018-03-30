/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, Row} from "./IInsightFacade";
import {Dataset} from "../data/Dataset";

import Log from "../Util";
import {QueryProcessor} from "../engine/QueryProcessor";
import {Query} from "../engine/query/Query";
import {Session} from "../Session/Session";
import {DataProcessor} from "../data/DataProcessor";
import {SpillManager} from "../data/SpillManager";
var JSZip = require("jszip");

export default class InsightFacade implements IInsightFacade {

    private processor: DataProcessor;
    private session: Session;

    constructor() {
        Log.trace('InsightFacadeImpl::init()');

        //Session.getInstance(); // TODO delete later, initializing session so tests work
        this.processor = new DataProcessor();
        this.session = new Session();
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let zip = new JSZip();
        let self = this;
        //session.initializeData();
        return new Promise(function (fulfill, reject) {
            let newIdFound: boolean = !(self.session.dataExists(id));

            self.processor.processData(id, content).then((jsonsArr:Array<any>) => {
                //TODO write to spill manager
                let jsons = [].concat.apply([], jsonsArr);
                if (jsons.length != 0) {
                    SpillManager.getInstance().spillToDisk(id, jsons)
                        .then((success:boolean) => {
                            self.session.addData(id,jsons);
                            if (newIdFound) {
                                fulfill({code: 204, body: {"message": "Dataset was added and ID was new"}});
                            }
                            else {
                                fulfill({code: 201, body: {"message": "Dataset was added and ID already existed"}});
                            }
                        }).catch((err:any) => {
                        reject({code:400,body:{"error":"Problem writing data to disk"}});
                    })
                }
                else {reject({code:400,body:{"error":"No valid JSON found in dataset"}});}
            }).catch(function (err:any) {
                reject({code:400,body:{"error":"Couldn't read one or more of the files in the zip"}});
            });
        })
    }

    removeDataset(id: string): Promise<InsightResponse> {
        const that = this;
        return new Promise((fulfill, reject) => {
            that.session.removeData(id).then((success:boolean) => {
                if (success) {
                    fulfill({"code": 204, "body": {"message": "Dataset was successfully removed"}});
                } else {
                    reject("Error removing dataset");
                }
            }).catch((err:any) => {
                reject({"code": 404, "body": {"message": "Dataset does not exist"}});
            });
        });
    }

    performQuery(query: any): Promise <InsightResponse> {
        const that = this;
        //session.initializeData();
        return new Promise((fulfill, reject) => {
            const parsed = new Query(query);
            if (!parsed.isValid()) {
                const body = {"error":"Invalid Query"};
                return reject({"code":400, body});
            } else {
                that.session.getData(parsed.getTable()).then((data:Dataset) => {
                    const processor = new QueryProcessor(parsed, data);
                    const result = processor.execute();
                    fulfill({"code":200, "body":{result}});
                }).catch((err:any) => {
                    const body = {"error":"Dataset missing"};
                    return reject({"code":424, body});
                })
            }

        });
    }
}

import {expect} from 'chai';

import fs = require('fs');
import {DataProcessor} from "../src/data/DataProcessor";
const path = require('path');
import JSZip = require('jszip');
import {Dataset} from "../src/data/Dataset";
import {WebParser} from "../src/parsing/WebParser";
import {ValidBuilding} from "../src/parsing/ValidBuilding";
import {RoomDetail} from "../src/parsing/RoomDetail";
describe("DataProcessorSpec", () => {

    //const zip = new JSZip();
    //let zipped = null;
    let zippedRooms = new Promise((fulfill, reject) => {
        const p = path.join(__dirname, "data", "rooms.zip");
        const zipped = new Buffer(fs.readFileSync(p)).toString('base64');
        const zip = new JSZip();
        zip.loadAsync(zipped, {base64:true}).then((zip:JSZip) => {
            fulfill(zip);
        }).catch((err:any) => {
            reject(err);
        })
    });

    let zippedCourses = new Promise((fulfill, reject) => {
        const p = path.join(__dirname, "data", "courses_all_all.zip");
        const zipped = new Buffer(fs.readFileSync(p)).toString('base64');
        const zip = new JSZip();
        zip.loadAsync(zipped, {base64:true}).then((zip:JSZip) => {
            fulfill(zip);
        }).catch((err:any) => {
            reject(err);
        })
    });


    describe("Testing ability to process rooms dataset", () => {

        const processor = new DataProcessor();
        /*it.only("Should properly create the rooms dataset", () => {
            return zipped.then((unzipped:JSZip) => processor.processRooms(unzipped)
                .then ((data: Array<any>) => {
                expect(data.length).to.equal(74);
                }))
                .catch((err:any) => {
                    console.log(err);
                    expect.fail();
                })
        });*/

        it("Should correctly read both", () => {
            const parser = new WebParser();
            return zippedRooms
                .then((unzipped:JSZip) => {
                    let this_unzipped = zippedRooms;
                    return unzipped.folder("").file("index.htm").async("string")
                        .then((data:string) => parser.getValidBuildings(data))
                        .then((value:Array<ValidBuilding>) => {
                            expect(value.length).to.equal(74);
                            expect(value[0]["shortname"]).to.equal("ACU");
                            expect(value[0]["fullname"]).to.equal("Acute Care Unit");
                            expect(value[0]["address"]).to.equal("2211 Wesbrook Mall");

                            expect(value[73]["shortname"]).to.equal("WOOD");
                            expect(value[73]["fullname"]).to.equal("Woodward (Instructional Resources Centre-IRC)");
                            expect(value[73]["address"]).to.equal("2194 Health Sciences Mall");
                            let regex = RegExp(value[0].shortname); // ACU
                            let matched = unzipped.folder("").file(regex);
                            let file = matched[0];
                            return new Promise((fulfill,reject) => {
                                file.async("string")
                                    .then((data) => {
                                    // Building does not contain rooms, so return empty and ignore
                                        return parser.getRoomData(data, value[0]).then((value:Array<RoomDetail>) => {
                                            expect(value.length).to.equal(0);
                                        }).catch((err:any) => {
                                            expect.fail();
                                        })
                                });
                            })
                        }).then ((roomDetail:Array<RoomDetail>) => {
                            console.log(roomDetail.length);
                        })

                }).catch((err:any) => {
                    console.log(err);
                    expect.fail(err);
                })
        });

    })
});
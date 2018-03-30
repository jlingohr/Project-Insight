import {expect} from 'chai';
import {WebParser} from "../src/parsing/WebParser";
import {ValidBuilding} from "../src/parsing/ValidBuilding";
import {RoomDetail} from "../src/parsing/RoomDetail";

const path = require('path');
const fs = require('fs');

describe("WebParserSpec", () => {

    describe("Testing reading an html page", () => {

        it("Should correctly read the index html", () => {
            const parser = new WebParser();
            const p = path.join(__dirname, "data", "index.htm");
            let data = fs.readFileSync(p);
            return parser.getValidBuildings(data).then((value:Array<ValidBuilding>) => {
                expect(value.length).to.equal(74);
                expect(value[0]["shortname"]).to.equal("ACU");
                expect(value[0]["fullname"]).to.equal("Acute Care Unit");
                expect(value[0]["address"]).to.equal("2211 Wesbrook Mall");

                expect(value[73]["shortname"]).to.equal("WOOD");
                expect(value[73]["fullname"]).to.equal("Woodward (Instructional Resources Centre-IRC)");
                expect(value[73]["address"]).to.equal("2194 Health Sciences Mall");
            }).catch((err:any) => {
                expect.fail();
            })
        })
    });

    /*describe("Testing reading room info", () => {
        it("Should correctly parse ALRD page", () => {
            const p = path.join(__dirname, "data", "ALRD");
            let data = fs.readFileSync(p);
            return WebParser.getRoomData(data).then((value:Array<RoomDetail>) => {
                expect(value.length).to.equal(5);
            }).catch((err:any) => {
                expect.fail();
            })
        });

    });*/

});
/*
import {expect} from 'chai';
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

const path = require('path');
const fs = require('fs');
const Util_1 = require("../src/Util");

describe("PerformQuerySpec", () => {

    let facade: InsightFacade;

    before((done) => {
        let p = path.join(__dirname,"data", "courses_all_all.zip");
        facade = new InsightFacade();
        return Util_1.default.zipToBase64String(p)
            .then((value:string) => {
                facade.addDataset("courses", value)
                    .then((response:InsightResponse) => {
                        console.log("Data loaded");
                    })
            }).catch((err:any) => {
                console.log("Error loading data");
                expect.fail();
            });
    });

    after(() => {

    });

    describe("Testing sample queries", () => {

        it("Should return the correct result for a simple query with full data", (done) => {
            const q = path.join(__dirname,"resource", "valid_1.json");
            const r = path.join(__dirname, "resource", "simple_response.json");

            const queryJson = fs.readFileSync(q);
            const queryObj = JSON.parse(queryJson);
            const responseJson = fs.readFileSync(r);
            const responseObj = JSON.parse(responseJson);
            facade.performQuery(queryObj).then((value:InsightResponse) => {
                expect(value.code).to.equal(200);
                expect(value.body).to.deep.equal(responseObj);
                done();
            }).catch((err:any) => {
                expect.fail(err);
                done();
            });
        });

        it("Should return the correct result for a compex query with full data", (done) => {
            const q = path.join(__dirname,"resource", "valid_2.json");
            const r = path.join(__dirname, "resource", "complex_response.json");
            const queryJson = fs.readFileSync(q);
            const queryObj = JSON.parse(queryJson);
            const responseJson = fs.readFileSync(r);
            const responseObj = JSON.parse(responseJson);
            facade.performQuery(queryObj).then((value:InsightResponse) => {
                expect(value.code).to.equal(200);
                expect(value.body).to.deep.equal(responseObj);
                done();
            }).catch((err:any) => {
                expect.fail(err);
                done();
            });
        });

    });

    it("Should return a 400 error if the query is invalid", () => {
        const q = path.join(__dirname,"resource", "invalid_1.json");

        const queryJson = fs.readFileSync(q);
        const queryObj = JSON.parse(queryJson);
        return facade.performQuery(queryObj).then((value:InsightResponse) => {
            expect.fail();
        }).catch((err:any) => {
            expect(err).to.deep.equal({code:400,body:{"error":"Invalid Query"}});
        });
    });

    it("Should return a 424 if data is missing", () => {
        const q = path.join(__dirname,"resource", "valid_1.json");

        const queryJson = fs.readFileSync(q);
        const queryObj = JSON.parse(queryJson);
        return facade.removeDataset("courses").then((success:any) => {
            facade.performQuery(queryObj).then((value:InsightResponse) => {
                expect.fail();
            }).catch((err:any) => {
                expect(err).to.deep.equal({code:424,body:{"error":"Dataset missing"}});
            });
        });
    });
});*/
//TODO problem with beforeAll hook
import {Query} from "../src/engine/query/Query";
import {expect} from 'chai';
import {FilterCondition} from "../src/engine/query/FilterCondition";

const path = require('path');
const fs = require('fs');
describe("QuerySpec", () => {

    describe("Testing query validation", () => {

        it("Should return true for a simple GT query", () => {
            const p = path.join(__dirname, "resource", "valid_1.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });


        it("Should return true for a complex logic query", () => {
            const p = path.join(__dirname, "resource", "valid_2.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });

        it("Should return true for a simple GT query with ORDER", () => {
            const p = path.join(__dirname, "resource", "valid_3.json");
            fs.readFile(p, (err:any, data:any) => {
                const json = JSON.parse(data);
                const query = new Query(json);
                expect(query.isValid()).to.equal(true);
            });
        });

        it("Should return false for an invalid key in the query", () => {
            const p = path.join(__dirname, "resource", "invalid_1.json");
            fs.readFile(p, (err:any, data:any) => {
                const json = JSON.parse(data);
                const query = new Query(json);
                expect(query.isValid()).to.equal(false);
            });
        });

        it("Should return false if there is an extra key in the query", () => {
            const p = path.join(__dirname, "resource", "invalid_2.json");
            fs.readFile(p, (err:any, data:any) => {
                const json = JSON.parse(data);
                const query = new Query(json);
                expect(query.isValid()).to.equal(false);
            });
        });

        it("Should return false if there is an invalid option", () => {
            const p = path.join(__dirname, "resource", "invalid_3.json");
            fs.readFile(p, (err:any, data:any) => {
                const json = JSON.parse(data);
                const query = new Query(json);
                expect(query.isValid()).to.equal(false);
            });
        });

        it("Should return false if th ORDER key is not in COLUMNS", () => {
            const p = path.join(__dirname, "resource", "invalid_4.json");
            fs.readFile(p, (err:any, data:any) => {
                const json = JSON.parse(data);
                const query = new Query(json);
                expect(query.isValid()).to.equal(false);
            });
        });

        it("Should return false when query has a table_key mismatch", () => {
            const p = path.join(__dirname,"resource", "invalid_5.json");
            let d = fs.readFileSync(p);
            const json = JSON.parse(d);
            const query  = new Query(json);
            expect(query.isValid()).to.be.false;
        });

        it("Should return false when query is a mix of courses and rooms keys", () => {
            const p = path.join(__dirname,"resource", "invalid_6.json");
            let d = fs.readFileSync(p);
            const json = JSON.parse(d);
            const query  = new Query(json);
            expect(query.isValid()).to.be.false;
        });

        it("Should return true for an empty WHERE body", () => {
            const p = path.join(__dirname,"resource", "valid_transformation_2.json");
            let d = fs.readFileSync(p);
            const json = JSON.parse(d);
            const query  = new Query(json);
            expect(query.isValid()).to.be.true;
        })

    });

    describe("Testing Query.filter returns a useable filter", () => {
        const data = [
            { "Subject": 'zzzz', "Course": '329', "Avg": 90.02 },
            { "Subject": 'adhe', "Course": '412', "Avg": 90.18 },
            { "Subject": 'econ', "Course": '516', "Avg": 95 }
        ];


        it("Should return true if department and average conditions are met", () => {
            const p = path.join(__dirname, "resource", "valid_2.json");
            let query: Query;
            let func: FilterCondition;
            let d = fs.readFileSync(p);
            const json = JSON.parse(d);
            query = new Query(json);
            func = query.buildFilter();
            // Should return true if department and average conditions are met
            expect(func(data[1])).to.equal(true);
            // Should return true if course average is 95 regardless of department
            expect(func(data[1])).to.equal(true);
            // Should return false if course department and course average are not met
            expect(func(data[0])).to.equal(false);

        });
    });

    describe("Testing validity of transformations", () => {

        it("Should return true for the first example", () => {
            const p = path.join(__dirname, "resource", "valid_transformation_1.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });

        it("Should return true for the second example", () => {
            const p = path.join(__dirname, "resource", "valid_transformation_2.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });

        it("Should return false when transformation keys are duplicated", () => {
            const p = path.join(__dirname, "resource", "invalid_transformation_1.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(false);
        });

        it("Should return false when there is an APPLY without a GROUP", () => {
            const p = path.join(__dirname, "resource", "invalid_transformation_3.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(false);
        });

        it("Should not be able to maximize the furniture", () => {
            const p = path.join(__dirname, "resource", "invalid_transformation_2.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(false);
        });

        it("Should be able to apply MIN on a numeric field", () => {
            const p = path.join(__dirname, "resource", "valid_min_query.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });

        it("Should not be able to apply MIN on a string field", () => {
            const p = path.join(__dirname, "resource", "invalid_min_query.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(false);
        });

        it("Should be able to average a numeric field", () => {
            const p = path.join(__dirname, "resource", "valid_avg_query.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });

        it("Should not be able to average a string field", () => {
            const p = path.join(__dirname, "resource", "invalid_avg_query.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(false);
        });

        it("Should be able to sum a numeric field", () => {
            const p = path.join(__dirname, "resource", "valid_sum_query.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });

        it("Should not be able to sum a string field", () => {
            const p = path.join(__dirname, "resource", "invalid_sum_query.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(false);
        });

        it("Should be able to count a string field", () => {
            const p = path.join(__dirname, "resource", "valid_count_string.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });

        it("Should be able to count a number field", () => {
            const p = path.join(__dirname, "resource", "valid_count_numeric.json");
            let data: string = fs.readFileSync(p);
            const json = JSON.parse(data);
            const query = new Query(json);
            expect(query.isValid()).to.equal(true);
        });

    })

});

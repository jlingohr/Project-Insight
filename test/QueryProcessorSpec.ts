import {expect} from 'chai';
import {Dataset} from "../src/data/Dataset";
import {QueryProcessor} from "../src/engine/QueryProcessor";
import {Query} from "../src/engine/query/Query";

const path = require('path');
const fs = require('fs');
describe("QueryProcessorSpec", () => {

    const rows_courses = [
        {"Subject":'math', "Avg": 51.00,"Course":"221A"},
        {"Subject":'math', "Avg": 51.00,"Course":"221B"},
        {"Subject":'math', "Avg": 55.00,"Course":"121C"},
        {"Subject":'math', "Avg": 98.09 },
        {"Subject":"adhe", "Avg":89.9,"Course":""},
        {"Subject":"cpsc", "Avg":97,"Course":"101A"},
        {"Subject":"cpsc", "Avg":95,"Course":""},
        {"Subject":"adhe", "Avg":97.2,"Course":"101C"}
    ];

    const rows_rooms = [
        {"address":"6363 Agronomy Road","name": "ORCH_4074","seats":100},
        {"address":"6363 Agronomy Road","name": "ORCH_4068","seats":50},
        {"address":"6363 Agronomy Road","name": "ORCH_4058","seats":110},
        {"address":"6245 Agronomy Road V6T 1Z4","name": "DMP_310","seats":300},
    ];

    const courses = "courses";
    const rooms = "rooms";
    const data_courses = new Dataset(courses, rows_courses);
    const data_rooms = new Dataset(rooms, rows_rooms);

    it("Should return a valid response when data and query are valid for courses data", () => {
        const p = path.join(__dirname,"resource", "valid_1.json");
        let d = fs.readFileSync(p);
        const json = JSON.parse(d);
        const processor = new QueryProcessor(new Query(json), data_courses);
        const result = processor.execute();
        const expected =
            [
                {courses_dept:"adhe", courses_avg:97.2},
                {courses_dept:"math", courses_avg: 98.09}
            ];
        expect(result).to.deep.equal(expected);

    });

    it("Should return a valid response when data and query are valid for rooms data", () => {
        const p = path.join(__dirname,"resource", "valid_4.json");
        let d = fs.readFileSync(p);
        const json = JSON.parse(d);
        const processor = new QueryProcessor(new Query(json), data_rooms);
        const result = processor.execute();
        const expected =
            [
                {rooms_name: "DMP_310"}
            ];
        expect(result).to.deep.equal(expected);
    });




    it("Should return a valid response for a complex query", () => {
        const p = path.join(__dirname, "resource", "valid_2.json");
        let d = fs.readFileSync(p);
        const json = JSON.parse(d);
        const processor = new QueryProcessor(new Query(json), data_courses);
        const result = processor.execute();
        const expected =
            [
                {courses_dept:"cpsc", courses_avg:95, courses_id:""},
                {courses_dept:"adhe", courses_avg:97.2,courses_id:"101C"}
            ];
        expect(result).to.deep.equal(expected);

    });

    it("Should return a valid response twice if making two queries on the same data", () => {
        const p = path.join(__dirname, "resource", "valid_2.json");
        let d = fs.readFileSync(p);
        const json = JSON.parse(d);
        const processor = new QueryProcessor(new Query(json), data_courses);
        const result1 = processor.execute();
        const result2 = processor.execute();
        const expected =
            [
                {courses_dept: "cpsc", courses_avg: 95, courses_id: ""},
                {courses_dept: "adhe", courses_avg: 97.2, courses_id: "101C"}
            ];
        expect(result1).to.deep.equal(expected);
        expect(result2).to.deep.equal(expected);
    });

    it("Should return the ordered data for object order", () => {
        const p = path.join(__dirname, "resource", "valid_sort_1.json");
        let d = fs.readFileSync(p);
        const json = JSON.parse(d);
        const processor = new QueryProcessor(new Query(json), data_courses);
        const result1 = processor.execute();
        const result2 = processor.execute();
        const expected =
            [
                {courses_dept:"math", courses_avg: 98.09},
                {courses_dept:"adhe", courses_avg:97.2}
            ];
        expect(result1).to.deep.equal(expected);
        expect(result2).to.deep.equal(expected);
    });

    it("Should return the ordered data for object order multiple keys #1", () => {
        const p = path.join(__dirname, "resource", "valid_sort_2.json");
        let d = fs.readFileSync(p);
        const json = JSON.parse(d);
        const processor = new QueryProcessor(new Query(json), data_courses);
        const result1 = processor.execute();
        const result2 = processor.execute();
        const expected =
            [
                {courses_dept:"math", courses_avg: 55.00, courses_id:"121C"},
                {courses_dept:"math", courses_avg: 51.00, courses_id:"221B"},
                {courses_dept:"math", courses_avg: 51.00, courses_id:"221A"}
            ];
        expect(result1).to.deep.equal(expected);
        expect(result2).to.deep.equal(expected);
    });

    it("Should return the ordered data for object order multiple keys #2", () => {
        const p = path.join(__dirname, "resource", "valid_sort_3.json");
        let d = fs.readFileSync(p);
        const json = JSON.parse(d);
        const processor = new QueryProcessor(new Query(json), data_courses);
        const result1 = processor.execute();
        const result2 = processor.execute();
        const expected =
            [
                {courses_dept:"math", courses_avg: 51.00, courses_id:"221B"},
                {courses_dept:"math", courses_avg: 51.00, courses_id:"221A"},
                {courses_dept:"math", courses_avg: 55.00, courses_id:"121C"}
            ];
        expect(result1).to.deep.equal(expected);
        expect(result2).to.deep.equal(expected);
    });

    describe("Testing with new apply query", () => {
        const data = [
            {"address":"6363 Agronomy Road","name": "ORCH_4074","seats":400, "shortname":"ORCH", "furniture":"Classroom-Fixed Tables/Fixed Chairs"},
            {"address":"6363 Agronomy Road","name": "ORCH_4068","seats":350, "shortname":"ORCH","furniture":"Classroom-Fixed Tables/Fixed Chairs"},
            {"address":"6363 Agronomy Road","name": "ORCH_4058","seats":310, "shortname":"ORCH","furniture":"Classroom-Fixed Tables/Movable Chairs"},
            {"address":"6245 Agronomy Road V6T 1Z4","name": "DMP_310","seats":600, "shortname":"DMP","furniture":'Classroom-Fixed Tables/Moveable Chairs'},
        ];

        it("Should return the correct data for the first example query", () => {
            const p = path.join(__dirname, "resource", "valid_transformation_1.json");
            let d = fs.readFileSync(p);
            const json = JSON.parse(d);
            const dataset = new Dataset("rooms", data);
            const processor = new QueryProcessor(new Query(json), dataset);
            const result1 = processor.execute();
            const result2 = processor.execute();
            const expected =
                [
                    {rooms_shortname: "DMP", maxSeats:600},
                    {rooms_shortname:"ORCH", maxSeats:400}

                ];
            expect(result1).to.deep.equal(expected);
            expect(result2).to.deep.equal(expected);
        });

        it("Should return the correct data for the second example query", () => {
            const p = path.join(__dirname, "resource", "valid_transformation_2.json");
            let d = fs.readFileSync(p);
            const json = JSON.parse(d);
            const dataset = new Dataset("rooms", data);
            const processor = new QueryProcessor(new Query(json), dataset);
            const result1 = processor.execute();
            const result2 = processor.execute();
            const expected =
                [
                    {rooms_furniture:"Classroom-Fixed Tables/Fixed Chairs"},
                    {rooms_furniture: "Classroom-Fixed Tables/Movable Chairs"},
                    {rooms_furniture: "Classroom-Fixed Tables/Moveable Chairs"}
                ];
            expect(result1).to.deep.equal(expected);
            expect(result2).to.deep.equal(expected);
        });

        it("Should return the correct average number of seats", () => {
            const p = path.join(__dirname, "resource", "valid_transformation_3.json");
            let d = fs.readFileSync(p);
            const json = JSON.parse(d);
            const dataset = new Dataset("rooms", data);
            const processor = new QueryProcessor(new Query(json), dataset);
            const result1 = processor.execute();
            const result2 = processor.execute();
            const expected =
                [
                    {rooms_shortname: "DMP", avgSeats:600},
                    {rooms_shortname:"ORCH", avgSeats:353.33}

                ];
            expect(result1).to.deep.equal(expected);
            expect(result2).to.deep.equal(expected);
        });

        it("Should return the ordered data on group with d1/d2 style sort", () => {
            const p = path.join(__dirname, "resource", "valid_sort_4.json");
            let d = fs.readFileSync(p);
            const json = JSON.parse(d);
            const dataset = new Dataset("rooms", data);
            const processor = new QueryProcessor(new Query(json), dataset);
            const result1 = processor.execute();
            const result2 = processor.execute();
            const expected =
                [
                    {rooms_shortname:"ORCH", avgSeats:353.33},
                    {rooms_shortname: "DMP", avgSeats:600}
                ];
            expect(result1).to.deep.equal(expected);
            expect(result2).to.deep.equal(expected);
        });
    })
});
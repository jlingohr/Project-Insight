import {OptionNode} from "../src/engine/query/OptionNode";

import {expect} from 'chai';
describe("OptionNodeSpec", () => {

    it("Should return true for a valid option node", () => {
        const query:any = {"OPTIONS":{"COLUMNS":["courses_avg"], "ORDER":"courses_avg"}};
        const node = new OptionNode(query);
        expect(node.isValid()).to.equal(true)
    });

    it("Should return true when multiple columns", () => {
        const query:any = {"OPTIONS":{"COLUMNS":["courses_dept","courses_avg"], "ORDER":"courses_avg"}};
        const node = new OptionNode(query);
        expect(node.isValid()).to.equal(true)
    });

    it("Should return true if there is no order key", () => {
        const query:any = {"OPTIONS":{"COLUMNS":["courses_avg"]}};
        const node = new OptionNode(query);
        expect(node.isValid()).to.equal(true)
    });

    it ("Should return false if columns are empty", () => {
        const query:any = {"OPTIONS":{"COLUMNS":[]}};
        const node = new OptionNode(query);
        expect(node.isValid()).to.equal(false);
    })

    it("Should return true when order has direction and single key", () => {
        const query:any = {"OPTIONS":{"COLUMNS":["courses_dept","courses_avg"], "ORDER":{"dir":"DOWN", "keys":["courses_avg"]}}};
        const node = new OptionNode(query);
        expect(node.isValid()).to.equal(true)
    });

    it("Should return true when order has direction and multiple key", () => {
        const query:any = {"OPTIONS":{"COLUMNS":["courses_dept","courses_avg"], "ORDER":{"dir":"DOWN", "keys":["courses_avg","courses_dept"]}}};
        const node = new OptionNode(query);
        expect(node.isValid()).to.equal(true)
    });

    it("Should return false when order has key not in columns", () => {
        const query:any = {"OPTIONS":{"COLUMNS":["courses_dept","courses_avg"], "ORDER":{"dir":"DOWN", "keys":["courses_avg","courses_id"]}}};
        const node = new OptionNode(query);
        expect(node.isValid()).to.equal(false)
    });
});
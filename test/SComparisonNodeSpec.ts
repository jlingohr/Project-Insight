import {expect} from 'chai';
import {SComparisonNode} from "../src/engine/query/SComparisonNode";

describe("SComparisonNodeSpec", () => {

    describe("Testing isValid", () => {
        it("Should be invalid if there is an invalid sKey prefix", () => {
            let query = {"course_dept" : "asdf"};
            let node = new SComparisonNode(query);
            expect(node.isValid()).to.equal(false);
        });

        it("Should be invalid there is an invalid sKey suffix", () => {
            let query = {"courses_dep" : "asdf"};
            let node = new SComparisonNode(query);
            expect(node.isValid()).to.equal(false);
        });

        it("Should be invalid if the string contains * in the middle", () => {
            let query = {"courses_dept" : "*as*df*"};
            let node = new SComparisonNode(query);
            expect(node.isValid()).to.equal(false);
        });

        it("Should be valid the the string starts with an *", () => {
            let query = {"courses_dept" : "*asdf"};
            let node = new SComparisonNode(query);
            expect(node.isValid()).to.equal(true);
        });

        it("Should be valid if the string ends with an *", () => {
            let query = {"courses_dept" : "asdf*"};
            let node = new SComparisonNode(query);
            expect(node.isValid()).to.equal(true);
        });

        it("Should be valid if the string starts and ends with an *", () => {
            let query = {"courses_dept" : "*asdf*"};
            let node = new SComparisonNode(query);
            expect(node.isValid()).to.equal(true);
        });
    });

    describe("Testing the regEx returned works", () => {

        it("Should match against a string that contains the regex", () => {
            let data = {"Subject":"blah cpsc 123"};
            let query = {"courses_dept" : "*cpsc*"};
            let node = new SComparisonNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false if the match is not exactly", () => {
            let data = {"Subject":"cps"};
            let query = {"courses_dept" : "*cpsc*"};
            let node = new SComparisonNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should match against a string that only ends with the regex", () => {
            let data = {"Subject":"asdf_cpsc"};
            let query = {"courses_dept" : "*cpsc"};
            let node = new SComparisonNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false if the match is not at the end", () => {
            let data = {"Subject":"cpsc_123"};
            let query = {"courses_dept" : "*cpsc"};
            let node = new SComparisonNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should match against a string that only starts with the regex", () => {
            let data = {"Subject":"cpsc_123"};
            let query = {"courses_dept" : "cpsc*"};
            let node = new SComparisonNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false if the match is not at the start", () => {
            let data = {"Subject":"asdf_cpsc"};
            let query = {"courses_dept" : "cpsc*"};
            let node = new SComparisonNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should match against a string that matches exactly", () => {
            let data = {"Subject":"cpsc"};
            let query = {"courses_dept" : "cpsc"};
            let node = new SComparisonNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false if the match is not exact", () => {
            let data = {"Subject":"cpsc "};
            let query = {"courses_dept" : "cpsc"};
            let node = new SComparisonNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });
    });
});
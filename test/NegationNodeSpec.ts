import {expect} from 'chai';
import {NegationNode} from "../src/engine/query/NegationNode";

describe("NegationNodeSpec", () => {


    describe("Testing negation of GTNode", () => {

        it("Should return a filter that evaluates to true if == 90", () => {
            const data = {'Avg':90};
            const json = {"GT":{"courses_avg":90}};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return a filter that evaluates to true if value < 90", () => {
            const data = {'Avg':89};
            const json = {"GT":{"courses_avg":90}};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return a filter that evaluates to false if value > 90", () => {
            const data = {'Avg':91};
            const json = {"GT":{"courses_avg":90}};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });
    });

    describe("Testing negation of LTNode", () => {
        it("Should return a filter that evaluates to true if == 90", () => {
            const data = {'Avg':90};
            const json = {"LT":{"courses_avg":90}};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return a filter that evaluates to false if value < 90", () => {
            const data = {'Avg':89};
            const json = {"LT":{"courses_avg":90}};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return a filter that evaluates to true if value > 90", () => {
            const data = {'Avg':91};
            const json = {"LT":{"courses_avg":90}};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });
    });

    describe("Testing negation of ANDNode", () => {

        it("Should return true if not AND is true == not A or not B", () => {
            const data = {'Avg':90, "Subject":"asdf"};
            const json = {"AND":[{"LT":{"courses_avg":90}, "IS":{"Subject":"cpsc"}}]};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return true if either is not true", () => {
            const data = {'Avg':90, "Subject":"cpsc"};
            const json = {"AND":[{"LT":{"courses_avg":90}, "IS":{"Subject":"cpsc"}}]};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false otherwise", () => {
            const data = {'Avg':89, "Subject":"cpsc"};
            const json = {"AND":[{"LT":{"courses_avg":90}, "IS":{"Subject":"cpsc"}}]};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });
    });

    describe("Testing negation of ORNode", () => {

        it("Should return true if not OR == not A and not B", () => {
            const data = {'Avg':90, "Subject":"asdf"};
            const json = {"OR":[{"LT":{"courses_avg":90}, "IS":{"Subject":"cpsc"}}]};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false if not A and not B is false", () => {
            const data = {'Avg':89, "Subject":"cpsc"};
            const json = {"OR":[{"LT":{"courses_avg":90}, "IS":{"Subject":"cpsc"}}]};
            const node = new NegationNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });
    });

    describe("Testing of SNode", () => {

        it("Should not match against a string that contains the regex", () => {
            let data = {"Subject":"cpsc"};
            let query = {"IS":{"courses_dept" : "*cpsc*"}};
            let node = new NegationNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return true if the match is not exactly", () => {
            let data = {"Subject":"cps"};
            let query = {"IS":{"courses_dept" : "*cpsc*"}};
            let node = new NegationNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should not match against a string that only ends with the regex", () => {
            let data = {"Subject":"asdf_cpsc"};
            let query = {"IS":{"courses_dept" : "*cpsc"}};
            let node = new NegationNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return true if the match is not at the end", () => {
            let data = {"Subject":"cpsc_123"};
            let query = {"IS":{"courses_dept" : "*cpsc"}};
            let node = new NegationNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should not match against a string that only starts with the regex", () => {
            let data = {"Subject":"cpsc_123"};
            let query = {"IS":{"courses_dept" : "cpsc*"}};
            let node = new NegationNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return true if the match is not at the start", () => {
            let data = {"Subject":"asdf_cpsc"};
            let query = {"IS":{"courses_dept" : "cpsc*"}};
            let node = new NegationNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should not match against a string that matches exactly", () => {
            let data = {"Subject":"cpsc"};
            let query = {"IS":{"courses_dept" : "cpsc"}};
            let node = new NegationNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return true if the match is not exact", () => {
            let data = {"Subject":"cpsc "};
            let query = {"IS":{"courses_dept" : "cpsc"}};
            let node = new NegationNode(query);
            let func = node.buildFilter();
            expect(func(data)).to.equal(true);
        })
    });


});
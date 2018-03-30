import {expect} from 'chai';
import {FilterFactory} from "../src/engine/query/FilterFactory";
import {OptionNode} from "../src/engine/query/OptionNode";


describe("LComparisonNodeSpec", () => {

    describe("Testing validating", () => {
       it("Should be invalid if empty AND", () => {
           const query:any = {"AND":[]};
           const node = FilterFactory.getFilter(query);
           expect(node.isValid()).to.equal(false)
       });

       it("Should be invalid if empty OR", () => {
           const query:any = {"OR":[]};
           const node = FilterFactory.getFilter(query);
           expect(node.isValid()).to.equal(false)
       });

        it("Should be invalid if empty columns", () => {
            const query:any = {"OPTIONS":{"COLUMNS":[], "ORDER":"courses_avg"}};
            const node = new OptionNode(query);
            expect(node.isValid()).to.equal(false)
        });
    });

    describe("Testing ANDNode with only M nodes", () => {
        const query = {"AND":[{"GT":{"courses_avg":90}}, {"LT":{"courses_pass":5}}]};

        it("Should return true if avg > 90 and pass < 5", () => {
            const data = {"Avg":91,"Pass":0};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false if avg <= 90 and pass < 5", () => {
            const data = {"Avg":90,"Pass":0};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return false if avg > 90 and pass >= 5", () => {
            const data = {"Avg":91,"Pass":5};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        })
    });

    describe("Testing ANDNode with M and S nodes", () => {
        const query = {"AND":[{"GT":{"courses_avg":90}}, {"IS":{"courses_dept":"adhe"}}]};

        it("Should return true if two AND conditions are met", () => {
            const data = {"Avg":91,"Subject":"adhe"};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false if the first AND condition is not met", () => {
            const data = {"Avg":90,"Subject":"adhe"};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return false if the second AND condition is not met", () => {
            const data = {"Avg":91,"Subject":"adh"};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return false if neither condition is met", () => {
            const data = {"Avg":90,"Subject":"adh"};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });
    });

    describe("Testing ORNode", () => {
        const query = {"OR":[{"GT":{"courses_avg":90}}, {"IS":{"courses_dept":"adhe"}}]};
        it("Should return true if only the first condition is met", () => {
            const data = {"Avg":91,"Subject":"adh"};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return true if only the second condition is met", () => {
            const data = {"Avg":90,"Subject":"adhe"};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return true if both conditions are met", () => {
            const data = {"Avg":91,"Subject":"adhe"};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return false if neither condition is met", () => {
            const data = {"Avg":90,"Subject":"ade"};
            const node = FilterFactory.getFilter(query);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });
    });
});
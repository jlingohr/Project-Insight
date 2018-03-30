import {expect} from 'chai';
import {GTNode} from "../src/engine/query/GTNode";

describe("MComparisonNodeSpec", ()=> {

    describe("Testing isValid", () => {
        it("Should be invalid if there is an invalid m_key prefix", () => {
            let value = 1;
            let query = {"course_avg" : value};
            let node = new GTNode(query);
            expect(node.isValid()).to.equal(false);
        });

        it("Should be invalid if there is an invalid m_key suffix", () => {
            let value = 1;
            let query = {"courses_av" : value};
            let node = new GTNode(query);
            expect(node.isValid()).to.equal(false);
        });

        it("Should be valid if there is a valid m_key", () => {
            let value = 1;
            let query = {"courses_audit":value};
            const node = new GTNode(query);
            expect(node.isValid()).to.equal(true);
        });
    });

    describe("Testing buildSelect", () => {
        it("Should return a GT function that evaluates to true", () => {
            const data = {'Avg':91};
            const json = {'courses_avg':90};
            const node = new GTNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(true);
        });

        it("Should return a GT function that evaluates to false", () => {
            const data = {'Avg':89};
            const json = {'courses_avg':90};
            const node = new GTNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });

        it("Should return a GT function that evaluates false when equality", () => {
            const data = {'Avg':90};
            const json = {'courses_avg':90};
            const node = new GTNode(json);
            const func = node.buildFilter();
            expect(func(data)).to.equal(false);
        });
    });
});
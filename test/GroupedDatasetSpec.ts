import {expect} from 'chai';
import {GroupedDataset} from "../src/data/GroupedDataset";
import {Count} from "../src/engine/query/transform/Count";
import {Max} from "../src/engine/query/transform/Max";
import {Min} from "../src/engine/query/transform/Min";
import {Sum} from "../src/engine/query/transform/Sum";
import {Avg} from "../src/engine/query/transform/Avg";

describe("GroupedDatasetSpec", () => {

    describe("Testing counting by name", () => {
        //TODO add tests for multiple groups and transofmrations

        it("Should be able to group by a single column", () => {
            const data = [
                {"id":0, "name":"a", "value":1},
                {"id":1, "name":"a", "value":2},
                {"id":2, "name":"b", "value":2},
                {"id":3, "name":"a", "value":4},
            ];

            const groupings = ["value"];
            const transform = new Count("nameCounts", "name");
            const grouped = new GroupedDataset(data, groupings).aggregate([transform]);
            expect(grouped.length).to.equal(3);
            expect(grouped[0]).to.deep.equal({value:1, nameCounts:1});
            expect(grouped[1]).to.deep.equal({value:2, nameCounts:2});
            expect(grouped[2]).to.deep.equal({value:4, nameCounts:1});
        });

        it("Should be able to aggregate by room and find max value", () => {
            const data = [
                {"id":0, "name":"a", "value":1},
                {"id":1, "name":"a", "value":2},
                {"id":2, "name":"b", "value":2},
                {"id":3, "name":"a", "value":4},
            ];

            const groupings = ["name"];
            const transform = new Max("maxValue", "value");
            const grouped = new GroupedDataset(data, groupings).aggregate([transform]);
            expect(grouped.length).to.equal(2);
            expect(grouped[0]).to.deep.equal({name:"a", maxValue:4});
            expect(grouped[1]).to.deep.equal({name:"b", maxValue:2});
        });

        it("Should be able to aggregate by room and find min value", () => {
            const data = [
                {"id":0, "name":"a", "value":1},
                {"id":1, "name":"a", "value":2},
                {"id":2, "name":"b", "value":2},
                {"id":3, "name":"a", "value":4},
            ];

            const groupings = ["name"];
            const transform = new Min("minValue", "value");
            const grouped = new GroupedDataset(data, groupings).aggregate([transform]);
            expect(grouped.length).to.equal(2);
            expect(grouped[0]).to.deep.equal({name:"a", minValue:1});
            expect(grouped[1]).to.deep.equal({name:"b", minValue:2});
        });

        it ("Should be able to sum aggregate values", () => {
            const data = [
                {"id":0, "name":"a", "value":1},
                {"id":1, "name":"a", "value":2},
                {"id":2, "name":"b", "value":2},
                {"id":3, "name":"a", "value":4},
            ];

            const groupings = ["name"];
            const transform = new Sum("sumValue", "value");
            const grouped = new GroupedDataset(data, groupings).aggregate([transform]);
            expect(grouped.length).to.equal(2);
            expect(grouped[0]).to.deep.equal({name:"a", sumValue:7});
            expect(grouped[1]).to.deep.equal({name:"b", sumValue:2});
        });

        it("Should be able to aggregate averages", () => {
            const data = [
                {"id":0, "name":"a", "value":1},
                {"id":1, "name":"a", "value":2},
                {"id":2, "name":"b", "value":2},
                {"id":3, "name":"a", "value":4},
            ];

            const groupings = ["name"];
            const transform = new Avg("avgValue", "value");
            const grouped = new GroupedDataset(data, groupings).aggregate([transform]);
            expect(grouped.length).to.equal(2);
            expect(grouped[0]).to.deep.equal({name:"a", avgValue:2.33});
            expect(grouped[1]).to.deep.equal({name:"b", avgValue:2});
        });

        it("Should be able to aggregate without applying any functions", () => {
            const data = [
                {"id":0, "name":"a", "value":1},
                {"id":1, "name":"a", "value":2},
                {"id":2, "name":"b", "value":2},
                {"id":3, "name":"a", "value":4},
            ];

            const groupings = ["name"];
            const grouped = new GroupedDataset(data, groupings).aggregate();
            expect(grouped.length).to.equal(2);
            expect(grouped[0]).to.deep.equal({name:"a"});
            expect(grouped[1]).to.deep.equal({name:"b"});
        });

        it("Should be able to aggregate multiple groups", () => {
            const data = [
                {"id":0, "course":"a", "dept":"cpsc", "avg":1},
                {"id":1, "course":"b", "dept":"cpsc", "avg":2},
                {"id":2, "course":"b", "dept":"math", "avg":2},
                {"id":3, "course":"a", "dept":"cpsc", "avg":1},
            ];

            const groupings = ["dept", "course"];
            const grouped = new GroupedDataset(data, groupings).aggregate();
            const expected = [
                {"dept":"cpsc", "course":"a"},
                {"dept":"cpsc", "course":"b"},
                {"dept":"math", "course":"b"}
            ];

            expect(grouped).to.deep.equal(expected);
        })
    });
});
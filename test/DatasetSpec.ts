import {expect} from 'chai';
import {Dataset} from "../src/data/Dataset";

describe("DatasetSpec", () => {

    const rows = [
        {"Subject":'math', "Avg": 98.09, "Professor":"A" },
        {"Subject":"adhe", "Avg":97.1,"Course":"", "Professor":""}
    ];

    const id = "courses";

    const dataset = new Dataset(id, rows);

    it("Should return the correct size of the dataset", () => {
        expect(dataset.length()).to.equal(2);
    });

    it("Should return the selected rows as a new dataset", () => {
        const result = dataset.select(["Subject"]);
        expect(result).to.deep.equal(new Dataset(id, [{Subject:"math"},{Subject:"adhe"}]));
    });

    it("Should properly filter the data", () => {
        const func = (row:any) => {
            return row["Subject"] === "math";
        };
        const result = dataset.filter(func);
        expect(result).to.deep.equal(new Dataset(id, [{Subject:"math", Avg:98.09, Professor:"A"}]));
    });

    it("Should return the collected rows", () => {
        const result = dataset.collect(["courses_dept"]);
        expect(result).to.deep.equal([{courses_dept:"math"},{courses_dept:"adhe"}]);
    });
});
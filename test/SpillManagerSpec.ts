import {expect} from 'chai';
import {SpillManager} from "../src/data/SpillManager";
const path = require('path');
const fs = require('fs');

describe("SpillManagerSpec", ()=> {

    before(() => {
        const cacheDir = path.join(__dirname, "../src/data/resource/");
        fs.readdirSync(cacheDir).forEach((file:string) => {
            fs.unlinkSync(cacheDir + file);
        })
    });

    after(() => {
        const cacheDir = path.join(__dirname, "../src/data/resource/");
        fs.readdirSync(cacheDir).forEach((file:string) => {
            fs.unlinkSync(cacheDir + file);
        })
    });

    describe("Testing writing and reading cached datasets", () => {
        const data = [
            {"key": 1}
        ];
        const id = "test";

        it("Should be able to write a dataset", () => {

            return SpillManager.getInstance().spillToDisk(id, data)
                .then((success:boolean) => {
                    expect(success).to.equal(true);
                    expect(SpillManager.getInstance().isDataCached(id)).to.equal(true);
                }).catch((err:any) => {
                    expect.fail();
                });
        });

        /*it("Should be be able to read the specified dataset", () => {
            return SpillManager.getInstance().loadTable(id)
                .then((read:Array<any>) => {
                    expect(read).to.deep.equal(data);
                }).catch((err:any) => {
                    expect.fail();
                });
        });*/

        it("Should be able to rewrite a saved disk cache", () => {
            const updated = [
                {"A":1},
                {"B":2}
            ];
            return SpillManager.getInstance().spillToDisk(id, updated)
                .then((success:boolean) => {
                    expect(success).to.equal(true);
                    expect(SpillManager.getInstance().isDataCached(id)).to.equal(true);
                }).catch((err:any) => {
                    expect.fail();
                });
        });

        /*it("Should be able to read the updated disk cache", () => {
            const updated = [
                {"A":1,
                    "B":2}
            ];
            return SpillManager.getInstance().loadTable(id)
                .then((read:Array<any>) => {
                    expect(read).to.deep.equal(updated);
                }).catch((err:any) => {
                    expect.fail();
                });
        });*/

        it("Should be able to write a second disk cache", () => {
            const second = "test_second";
            return SpillManager.getInstance().spillToDisk(second, data)
                .then((success:boolean) => {
                    expect(success).to.equal(true);
                    expect(SpillManager.getInstance().isDataCached(second)).to.equal(true);
                }).catch((err:any) => {
                    expect.fail();
                });
        });

        it("Should be able to load all datasets", () => {
            const updated = [
                {"A":1},
                {"B":2}
            ];
            return SpillManager.getInstance().loadData()
                .then((cached:Array<[string, Array<any>]>) => {
                    expect(cached.length).to.equal(2);
                    const resultA = cached.find((value:[string, Array<any>]) => {
                        return value[0] == id;
                    });
                    expect(resultA[1]).to.deep.equal(updated);
                    const resultB = cached.find((value:[string, Array<any>]) => {
                        return value[0] == "test_second";
                    });
                    expect(resultB[1]).to.deep.equal(data);
                }).catch((err:any) => {
                    expect.fail();
                });
        });

        it("Should be able to delete a cached dataset", () => {
            return SpillManager.getInstance().deleteCache(id)
                .then((success:boolean) => {
                    expect(success).to.equal(true);
                    expect(SpillManager.getInstance().isDataCached(id)).to.equal(false);
                }).catch((err:any) => {
                    expect.fail();
                });
        });

        it("Should reject when trying to delete a cache that does not exists", () => {
            return SpillManager.getInstance().deleteCache(id)
                .then((success:boolean) => {
                    expect.fail();
                }).catch((err:any) => {
                    expect(err).to.equal(false);
                });
        });
    })
});
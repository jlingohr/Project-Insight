import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import {expect} from 'chai';
import {Session} from "../src/Session/Session";
const Util_1 = require("../src/Util");
var path = require('path');
var fs = require('fs');
var courses_path = path.join(__dirname,"../src/data/resource", "courses.txt");
var rooms_path = path.join(__dirname,"../src/data/resource", "rooms.txt");

describe("InsightFacadeSpec", function() {
    var ifacade:InsightFacade = null;
    beforeEach(function () {
        // delete cache if it exists
        try {
            fs.unlinkSync(courses_path);
            /*Session.getInstance().removeData("courses")
                .then((success:boolean) => {
                    console.log("Cleared cache")
                }).catch((err:any) => {
                    console.log("No cache to clear");
            })*/
        }
        catch (err) {
            try {
                fs.unlinkSync(rooms_path);
            }
            catch (err) {
                if (err.code == 'ENOENT') {
                    // cache hasn't been created yet, ignore
                }
            }
            if (err.code == 'ENOENT') {
                // cache hasn't been created yet, ignore
            }
            else {
                Util_1.default.test('Error: ' + err);
                expect.fail();
            }
        }
        // confirm cache has been removed
        //expect(Session.getInstance().dataExists("courses")).to.be.false;
        ifacade = new InsightFacade();
        // need to init data explicitly because session may have been created in earlier test
        //Session.getInstance().initializeData();
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });
    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        ifacade = null;
    });


    it("New InsightFacade with previously created cache file should leave cache alone", function () {
        ifacade = null;
        fs.writeFileSync(courses_path, "hey leave this alone", { flag: 'w' });
        ifacade = new InsightFacade();
        let data: string = fs.readFileSync(courses_path);
        expect(data.toString()).to.deep.equal("hey leave this alone");
    });

    it("Util zipToBase64String should return a string", function () {
        let p = path.join(__dirname,"data", "courses_0_1.zip");
        return Util_1.default.zipToBase64String(p).then(function (value: any) {
            Util_1.default.test('Value: ' + value);
            expect(value).to.be.a('string');
        }).catch(function (err: any) {
            Util_1.default.test('Error: ' + err);
            expect.fail();
        });
    });

    it("addDataset with non-base64 string should reject with error", function () {
        return ifacade.addDataset("courses","not a base64 string").then(function (value: InsightResponse) {
            Util_1.default.test('Value: ' + value.body);
            expect.fail();
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err.body["error"]);
            expect(err.code).to.deep.equal(400);
            //expect(err.body).to.deep.equal({"error":"Invalid base64 zip file as input to addDataset"});
            // expect(Object.keys(ifacade.data).length).to.deep.equal(0);
        });
    });

    it("addDataset with invalid zip file should reject with error", function () {
        let p = path.join(__dirname,"data", "not_a_zip_file.txt");

        return Util_1.default.zipToBase64String(p)
            .then((value: string) => ifacade.addDataset("courses", value))
            .then((value: string) => {
                Util_1.default.test('Value: ' + value);
                expect.fail();
            })
            .catch((err: any) => {
                Util_1.default.test('Error: ' + err.body["error"]);
                expect(err.code).to.deep.equal(400);
                //expect(err.body).to.deep.equal({"error":"Invalid base64 zip file as input to addDataset"});
                // expect(Object.keys(ifacade.data).length).to.deep.equal(0);
            });
    });

    it("addDataset with only invalid course file should reject with error", function () {
        let p = path.join(__dirname,"data", "courses_0_1.zip");

            return Util_1.default.zipToBase64String(p)
                .then((value: string) => ifacade.addDataset("courses", value))
                .then((value: any) => {
                    Util_1.default.test('Value: ' + JSON.stringify(value));
                    expect.fail();
                })
                .catch((err: any) => {
                    Util_1.default.test('Error: ' + err);
                    expect(err.code).to.deep.equal(400);
                    //expect(err.body).to.deep.equal({"error": "No valid JSON found in dataset"});
                    // expect(Object.keys(ifacade.data).length).to.deep.equal(0);
                });

    })

    it("addDataset with valid zip file with new id should add valid json to dataset in memory and on disk", function () {
        let p = path.join(__dirname,"data", "courses_1_0.zip");

        return Util_1.default.zipToBase64String(p)
            .then((value: string) => ifacade.addDataset("courses", value))
            .then((value: InsightResponse) => {
                Util_1.default.test('Value: ' + value);
                expect(value.code).to.deep.equal(204);
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                expect.fail();
            });
    });

    it("Remove dataset should remove data in cache and memory", function () {
        let p = path.join(__dirname,"data", "courses_all_all.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p)
            .then((value: string) => ifacade.addDataset("courses", value))
            .then((value: InsightResponse) => {
                return ifacade.removeDataset("courses");
            })
            .then ((value: InsightResponse) => {
                expect(value.code).to.deep.equal(204);
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                expect.fail();
            });
    });

    it("Adding the same dataset twice should result in a 201 code", function () {
        let p = path.join(__dirname,"data", "courses_1_0.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    return ifacade.addDataset("courses",str);
                })
            })
            .then((value: InsightResponse) => {
                expect(value.code).to.deep.equal(201);
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                expect.fail();
            });
    });

    it("Add dataset, remove from disk, add again, return 201 code", function () {
        let p = path.join(__dirname,"data", "courses_1_0.zip");
        return Util_1.default.zipToBase64String(p)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    fs.unlinkSync(courses_path);
                    return ifacade.addDataset("courses",str);
                })
            })
            .then((value: InsightResponse) => {
                expect(value.code).to.deep.equal(201);
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                expect.fail();
            });
    });


    it("Adding two different datasets with the same id should result in a 201 and saving the second dataset", function () {
        let p1 = path.join(__dirname,"data", "courses_1_0.zip");
        let p2 = path.join(__dirname,"data", "courses_2_2.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p1)
            .then((str: string) => {
            //expect(Session.getInstance().dataExists("courses")).to.equal(false);
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("courses").length())
                })
            })
            .then((value: InsightResponse) => Util_1.default.zipToBase64String(p2))
            .then((str:string) => {
                //expect(Session.getInstance().dataExists("courses")).to.equal(true);
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(201);
                    //console.log(session.getData("courses").length())
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                expect.fail();
            });
    });

    it("Adding courses_1_1 then adding courses_1_0 should result in the same data", function () {
        let p1 = path.join(__dirname,"data", "courses_1_1.zip");
        let p2 = path.join(__dirname,"data", "courses_1_0.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p1)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("courses").length())
                })
            })
            .then((value: InsightResponse) => Util_1.default.zipToBase64String(p2))
            .then((str:string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(201);
                    //console.log(session.getData("courses").length())
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                expect.fail();
            });
    });

    it("Adding courses_1_1 then adding courses_2_2 should result in one more class", function () {
        let p1 = path.join(__dirname,"data", "courses_1_1.zip");
        let p2 = path.join(__dirname,"data", "courses_2_2.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p1)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("courses").length())
                })
            })
            .then((value: InsightResponse) => Util_1.default.zipToBase64String(p2))
            .then((str:string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(201);
                    //console.log(session.getData("courses").length())
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                expect.fail();
            });
    });

    it("Adding, removing, removing, adding, adding should result in 204 204 404 204 201", function () {
        let p1 = path.join(__dirname,"data", "courses_1_0.zip");
        let p2 = path.join(__dirname,"data", "courses_all_all.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p1)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("courses").length())
                })
            })
            .then ((value: InsightResponse) => {
                return ifacade.removeDataset("courses").then ((val) => {
                    expect(val.code).to.deep.equal(204);
                    //expect(session.dataExists("courses")).to.be.false;
                    //let tmp = Session.getInstance().getData("courses");
                })
            })
            .then ((value: InsightResponse) => {
                return ifacade.removeDataset("courses").then ((val) => {
                    console.log(val.code);
                    expect.fail();
                })
                    .catch((err) => {
                        expect(err.code).to.deep.equal(404);
                        //expect(session.dataExists("courses")).to.be.false;
                    })
            })
            .then((value: InsightResponse) => Util_1.default.zipToBase64String(p2))
            .then((str:string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    return ifacade.addDataset("courses",str);
                })
            })
            .then ((val: InsightResponse) => {
                expect(val.code).to.deep.equal(201);
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });


    it("Adding valid, invalid, valid should return 204 400 201", function () {
        let p1 = path.join(__dirname,"data", "courses_1_0.zip");
        let p2 = path.join(__dirname,"data", "courses_0_1.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p1)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("courses").length())
                })
            })
            .then((value: InsightResponse) => Util_1.default.zipToBase64String(p2))
            .then((str:string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect.fail();
                })
                    .catch((err) => {
                        expect(err.code).to.deep.equal(400);
                    })
            })
            .then((value: InsightResponse) => Util_1.default.zipToBase64String(p1))
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(201);
                    //console.log(session.getData("courses").length())
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });



    it("Adding dataset, performing query returns 204 200", function () {
        let p1 = path.join(__dirname,"data", "courses_all_all.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p1)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("courses").length())
                })
            })
            .then ((value: InsightResponse) => {
                let query = "{\n" +
                    "  \"WHERE\":{\n" +
                    "    \"GT\":{\n" +
                    "      \"courses_avg\":97\n" +
                    "    }\n" +
                    "  },\n" +
                    "  \"OPTIONS\":{\n" +
                    "    \"COLUMNS\":[\n" +
                    "      \"courses_dept\",\n" +
                    "      \"courses_avg\"\n" +
                    "    ],\n" +
                    "    \"ORDER\":\"courses_avg\"\n" +
                    "  }\n" +
                    "}";
                return ifacade.performQuery(JSON.parse(query)).then ((val) => {
                    let tmp = val;
                    expect(val.code).to.deep.equal(200);
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Adding dataset, removing dataset, performing query returns 204, 204, 424", function () {
        let p1 = path.join(__dirname,"data", "courses_all_all.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p1)
            .then((str: string) => {
                return ifacade.addDataset("courses", str);
            })
            .then((value: InsightResponse) => {
                expect(value.code).to.deep.equal(204);
                //console.log(session.getData("courses").length())
                return ifacade.removeDataset("courses");
            })
            .then((value: InsightResponse) => {
                //let tmp0 = session.getData("courses");
                expect(value.code).to.deep.equal(204);
                let query = "{\n" +
                    "  \"WHERE\":{\n" +
                    "    \"GT\":{\n" +
                    "      \"courses_avg\":97\n" +
                    "    }\n" +
                    "  },\n" +
                    "  \"OPTIONS\":{\n" +
                    "    \"COLUMNS\":[\n" +
                    "      \"courses_dept\",\n" +
                    "      \"courses_avg\"\n" +
                    "    ],\n" +
                    "    \"ORDER\":\"courses_avg\"\n" +
                    "  }\n" +
                    "}";
                return ifacade.performQuery(JSON.parse(query));
            }).then ((val:InsightResponse) => {
                //let tmp1 = session.getData("courses");
                expect.fail();
            })
            .catch((err: any) => {
                let tmp = err;
                expect(err.code).to.deep.equal(424);
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Adding, removing, adding, adding, performing query returns 204, 204, 204, 201, 204", function () {
        let p1 = path.join(__dirname,"data", "courses_all_all.zip");
        //let session = Session.getInstance();
        return Util_1.default.zipToBase64String(p1)
            .then((str: string) => {
                return ifacade.addDataset("courses", str);
            })
            .then((value: InsightResponse) => {
                expect(value.code).to.deep.equal(204);
                //console.log(session.getData("courses").length())
                return ifacade.removeDataset("courses");
            })
            .then((value: InsightResponse) => {
                expect(value.code).to.deep.equal(204);
                return Util_1.default.zipToBase64String(p1);
            })
            .then((str: string) => {
                return ifacade.addDataset("courses", str);
            })
            .then((value: InsightResponse) => {
                expect(value.code).to.deep.equal(204);
                return Util_1.default.zipToBase64String(p1);
            })
            .then((str: string) => {
                return ifacade.addDataset("courses", str);
            })
            .then((value: InsightResponse) => {
                //let tmp0 = session.getData("courses");
                expect(value.code).to.deep.equal(201);
                let query = "{\n" +
                    "  \"WHERE\":{\n" +
                    "    \"GT\":{\n" +
                    "      \"courses_avg\":97\n" +
                    "    }\n" +
                    "  },\n" +
                    "  \"OPTIONS\":{\n" +
                    "    \"COLUMNS\":[\n" +
                    "      \"courses_dept\",\n" +
                    "      \"courses_avg\"\n" +
                    "    ],\n" +
                    "    \"ORDER\":\"courses_avg\"\n" +
                    "  }\n" +
                    "}";
                return ifacade.performQuery(JSON.parse(query));
            }).then ((val:InsightResponse) => {
                //let tmp1 = session.getData("courses");
                expect(val.code).to.deep.equal(200);
            })
            .catch((err: any) => {
                let tmp = err;
                expect.fail();
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Add rooms dataset and perform query", function () {
        const data_p = path.join(__dirname,"data", "rooms.zip");
        const query_p = path.join(__dirname, "resource", "valid_7.json");
        const resp_p = path.join(__dirname,"resource","complex_response_rooms.json");
        const resp_obj = JSON.parse(fs.readFileSync(resp_p));
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("rooms", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    expect(val.code).deep.equal(200);
                    //expect(val.body).to.deep.equal(resp_obj);
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Add rooms dataset, remove rooms dataset and attempt perform query", function () {
        const data_p = path.join(__dirname,"data", "rooms.zip");
        const query_p = path.join(__dirname, "resource", "valid_4.json");
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("rooms", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("rooms").length())
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.removeDataset("rooms").then((val) => {
                    expect(val.code).to.deep.equal(204);
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    expect.fail();
                }).catch((err) => {
                    expect(err.code).deep.equal(424);
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Add courses dataset, add rooms dataset, remove courses courses and perform query on rooms", function () {
        const rooms_p = path.join(__dirname,"data", "rooms.zip");
        const courses_p = path.join(__dirname,"data", "courses_all_all.zip");
        const query_p = path.join(__dirname, "resource", "valid_4.json");
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(courses_p)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                })
            })
            .then((val: InsightResponse) => Util_1.default.zipToBase64String(rooms_p))
            .then((str: string) => {
                return ifacade.addDataset("rooms", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.removeDataset("courses").then((val) => {
                    expect(val.code).to.deep.equal(204);
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    expect(val.code).to.deep.equal(200);
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Add courses and query on year 1900", function () {
        const data_p = path.join(__dirname,"data", "courses_all_all.zip");
        const query_p = path.join(__dirname, "resource", "valid_5.json");
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("rooms").length())
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    expect(val.code).deep.equal(200);
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Add courses and query on year greater than 2015", function () {
        const data_p = path.join(__dirname,"data", "courses_all_all.zip");
        const query_p = path.join(__dirname, "resource", "valid_6.json");
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("rooms").length())
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    expect(val.code).deep.equal(200);
                })
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Should add courses and query on an empty where body", () => {
        const data_p = path.join(__dirname,"data", "courses_all_all.zip");
        const query_p = path.join(__dirname, "resource", "empty_where.json");
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("rooms").length())
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    const expected_p = path.join(__dirname, "resource", "empty_where_response.json");
                    const expected = JSON.parse(fs.readFileSync(expected_p));
                    expect(val.body).to.deep.equal(expected);
                });
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Should correctly query when using mutiple groups", () => {
        const data_p = path.join(__dirname,"data", "courses_all_all.zip");
        const query_p = path.join(__dirname, "resource", "multiple_groups_request.json");
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("rooms").length())
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    const expected_p = path.join(__dirname, "resource", "multiple_groups_response.json");
                    const expected = JSON.parse(fs.readFileSync(expected_p));
                    expect(val.body).to.deep.equal(expected);
                });
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Should query on empty where body then query on multiple groups", () => {
        const data_p = path.join(__dirname,"data", "courses_all_all.zip");
        const query_p1 = path.join(__dirname, "resource", "empty_where.json");
        const query_p2 = path.join(__dirname, "resource", "multiple_groups_request.json");
        let query1: string = JSON.parse(fs.readFileSync(query_p1));
        let query2: string = JSON.parse(fs.readFileSync(query_p2));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("courses", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("rooms").length())
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query1).then((val) => {
                    const expected_p = path.join(__dirname, "resource", "empty_where_response.json");
                    const expected = JSON.parse(fs.readFileSync(expected_p));
                    expect(val.body).to.deep.equal(expected);
                });
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query2).then((val) => {
                    const expected_p = path.join(__dirname, "resource", "multiple_groups_response.json");
                    const expected = JSON.parse(fs.readFileSync(expected_p));
                    expect(val.body).to.deep.equal(expected);
                });
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    });

    it("Should be able to do multipe aggregates on the rooms dataset", () => {
        const data_p = path.join(__dirname,"data", "rooms.zip");
        const query_p = path.join(__dirname, "resource", "valid_transformation_4.json");
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("rooms", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("rooms").length())
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    const expected_p = path.join(__dirname, "resource", "valid_transformation_4_response.json");
                    const expected = JSON.parse(fs.readFileSync(expected_p));
                    expect(val.body).to.deep.equal(expected);
                });
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    })

    it("Should be able to do multipe aggregates on the rooms dataset and sort on multiple keys", () => {
        const data_p = path.join(__dirname,"data", "rooms.zip");
        const query_p = path.join(__dirname, "resource", "valid_sort_5.json");
        let query: string = JSON.parse(fs.readFileSync(query_p));
        return Util_1.default.zipToBase64String(data_p)
            .then((str: string) => {
                return ifacade.addDataset("rooms", str).then((val) => {
                    expect(val.code).to.deep.equal(204);
                    //console.log(session.getData("rooms").length())
                })
            })
            .then((value: InsightResponse) => {
                return ifacade.performQuery(query).then((val) => {
                    const expected_p = path.join(__dirname, "resource", "valid_sort_5_response.json");
                    const expected = JSON.parse(fs.readFileSync(expected_p));
                    expect(val.body).to.deep.equal(expected);
                });
            })
            .catch((err: any) => {
                Util_1.default.test(err);
                console.log(err);
                expect.fail();
            });
    })

})
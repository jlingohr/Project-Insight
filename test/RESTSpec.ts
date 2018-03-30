import {InsightResponse} from "../src/controller/IInsightFacade";
import Log from "../src/Util";
import {expect} from 'chai';
import Server from "../src/rest/Server";
import chai = require('chai');
import chaiHttp = require('chai-http');
import Response = ChaiHttp.Response;
import restify = require('restify');
var path = require('path');
var fs = require('fs');

describe("RESTSpec", function() {
    const courses_zip = path.join(__dirname, "data", "courses_all_all.zip");
    const rooms_zip = path.join(__dirname, "data", "rooms.zip");
    const courses_cache = path.join(__dirname,"../src/data/resource", "courses.txt");
    const rooms_cache = path.join(__dirname,"../src/data/resource", "rooms.txt");
    const URL = "http://127.0.0.1:4321";
    var server: Server = null;

    beforeEach(function () {
        chai.use(chaiHttp);
        server = new Server(4321);
        // delete cache if it exists
        try {
            fs.unlinkSync(courses_cache);
        }
        catch (err) {
            try {
                fs.unlinkSync(rooms_cache);
            }
            catch (err) {
                if (err.code == 'ENOENT') {}
            }
            if (err.code == 'ENOENT') {}
            else {
                expect.fail();
            }
        }
    });
    afterEach(function () {
        server.stop().then((res) => {return});
    });

    it("PUT rooms.zip then POST query", function () {
        return server.start().then((bool: boolean) => chai.request(URL)
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync(rooms_zip), "rooms.zip")
            .then((res: Response) => {
                expect(res.status).to.be.equal(204);
                const p = path.join(__dirname,"resource", "valid_4.json");
                let d = fs.readFileSync(p);
                const json = JSON.parse(d);
                return chai.request(URL)
                    .post('/query')
                    .send(json);
            })
            .then ((res: Response) => {
                expect(res.status).to.be.equal(200);
            })
            .catch(function (err) {
                console.log(err);
                expect.fail();
            })
        )
    });

    it("PUT rooms.zip then DELETE data", function () {
        return server.start().then((bool: boolean) => chai.request(URL)
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync(rooms_zip), "rooms.zip")
            .then((res: Response) => {
                return chai.request(URL)
                    .del('/dataset/rooms')
            })
            .then ((res: Response) => {
                expect(res.status).to.be.equal(204);
            })
            .catch(function (err) {
                console.log(err);
                expect.fail();
            })
        )
    });

    it("PUT rooms.zip, DELETE data, POST query should fail", function () {
        return server.start().then((bool: boolean) => chai.request(URL)
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync(rooms_zip), "rooms.zip")
            .then((res: Response) => {
                return chai.request(URL)
                    .del('/dataset/rooms')
            })
            .then ((res: Response) => {
                expect(res.status).to.be.equal(204);
                const p = path.join(__dirname,"resource", "valid_4.json");
                let d = fs.readFileSync(p);
                const json = JSON.parse(d);
                return chai.request(URL)
                    .post('/query')
                    .send(json);
            })
            .then((res: Response) => {
                expect.fail();
            })
            .catch(function (err) {
                expect(err.status).to.be.equal(424);
            })
        )
    });

    it("PUT rooms.zip, POST valid query then invalid query should return 400", function () {
        return server.start().then((bool: boolean) => chai.request(URL)
            .put('/dataset/courses')
            .attach("body", fs.readFileSync(courses_zip), "courses.zip")
            .then((res: Response) => {
                expect(res.status).to.be.equal(204);
                const p = path.join(__dirname,"resource", "empty_where.json"); //empty_where.json valid_4.json
                let d = fs.readFileSync(p);
                const json = JSON.parse(d);
                return chai.request(URL)
                    .post('/query')
                    .send(json);
            })
            .then ((res: Response) => {
                expect(res.status).to.be.equal(200);
                const expected_p = path.join(__dirname, "resource", "empty_where_response.json");
                const expected = JSON.parse(fs.readFileSync(expected_p));
                expect(res.body).to.deep.equal(expected);
                const p = path.join(__dirname,"resource", "invalid_transformation_2.json");
                let d = fs.readFileSync(p);
                const json = JSON.parse(d);
                return chai.request(URL)
                    .post('/query')
                    .send(json);
            })
            .then((res: Response) => {
                expect.fail();
            })
            .catch(function (err) {
                expect(err.status).to.be.equal(400);
            })
        )
    });

});


import {expect} from 'chai';
import {LocationService} from "../src/parsing/LocationService";
import {GeoResponse} from "../src/data/GeoResponse";

describe("LocationServiceSpec", () => {

    describe("Testing getting longitude and latitude", () => {

        it("Should return the correct Georesponse", () => {
            const service = new LocationService();
            const address = "2211 Wesbrook Mall";
            return service.getGeoResponse(address).then((response:GeoResponse) => {
                expect(response.lat).to.equal(49.26408);
                expect(response.lon).to.equal(-123.24605);
            }).catch((err:any) => {
                expect.fail();
            })
        });

        it("Should not return a location for improper address", () => {
            const service = new LocationService();
            const address = "2211 Wesbrook Mall ";
            return service.getGeoResponse(address).then((response:GeoResponse) => {
                expect(response.lon).to.equal(undefined);
                expect(response.lat).to.equal(undefined);
            }).catch((err:any) => {
                expect.fail();
            })
        })
    })
});
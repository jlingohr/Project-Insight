import {GeoResponse} from "../data/GeoResponse";

const request = require('request');
export class LocationService {

    private static teamNumber = 121;
    private static http = "http://skaha.cs.ubc.ca:11316/api/v1/team";

    constructor() {

    }

    public getGeoResponse(address:string):Promise<GeoResponse> {
        const uri = encodeURI(address);
        const url = LocationService.http + LocationService.teamNumber + "/" + uri;
        return this.makeRequest(url);
    }

    private makeRequest(url:string): Promise<GeoResponse> {
        return new Promise((fulfill, reject) => {
            request(url, (err:any, response:any, body:any) => {
                if (err) {
                    reject(err);
                } else {
                    response.destroy()
                    fulfill(JSON.parse(body));
                }
            })
        })
    }
}
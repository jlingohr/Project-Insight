import {expect} from 'chai';
import {Transformation} from "../src/engine/query/Transformation";

describe("TransformationSpec", () => {

    describe("Testing validity", () => {

        it("Should return true for a valid transformation", () => {
            const json =
                {
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "maxSeats": {
                                "MAX": "rooms_seats"
                            }
                        }]
                    }
                };

            const transformation = new Transformation(json, "rooms");
            expect(transformation.isValid()).to.equal(true);
        });

        it("Should return true even if apply is empty", () => {
            const json:any =
                {
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_furniture"],
                    "APPLY": []
                }
            };

            const transformation = new Transformation(json, "rooms");
            expect(transformation.isValid()).to.equal(true);
        });

        it("Should return false if group size is less than 1", () => {
            const json:any =
                {
                    "TRANSFORMATIONS": {
                        "GROUP": [],
                        "APPLY": []
                    }
                };

            const transformation = new Transformation(json, "rooms");
            expect(transformation.isValid()).to.equal(false);
        });

        it("Should return false if there are duplicate keys in apply", () => {
            const json =
                {
                    "TRANSFORMATIONS": {
                        "GROUP": ["rooms_shortname"],
                        "APPLY": [{
                            "maxSeats": {
                                "MAX": "rooms_seats"
                            }
                        },
                            {
                                "maxSeats": {
                                    "MAX": "rooms_seats"
                                }
                            }]
                    }
                };

            const transformation = new Transformation(json, "rooms");
            expect(transformation.isValid()).to.equal(false);
        })
    });
});
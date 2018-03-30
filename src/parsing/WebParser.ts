//import * as parse5 from "parse5";
import {ASTAttribute, ASTNode} from 'parse5/index';
import {TreeAdapter} from "parse5/index";
import {dateParser} from "restify";
import {ValidBuilding} from "./ValidBuilding";
import {RoomDetail} from "./RoomDetail";
import {LocationService} from "./LocationService";
import {GeoResponse} from "../data/GeoResponse";
const parse5 = require('parse5');
const fs = require('fs');
const assert = require('assert');

export class WebParser {

    private service: LocationService;

    constructor() {
        this.service = new LocationService();
    }

    private static invalidNodes: Set<string> = new Set([
        "#text", "script", "#comment", "meta", "link", "head", "noscript", "header", "footer", "ui", "button"
    ]);

    private static indexHeaders:Set<string> = new Set([
        "code", "building", "address"
    ]);

    public getValidBuildings(content:string): Promise<Array<ValidBuilding>> {
        return new Promise((fulfill, reject) => {
            WebParser.readFile(content).then((doc:ASTNode) => {
                const table = WebParser.findNode(doc);
                if (table == null) {
                    reject("Invalid index.htm")
                } else {
                    const validRooms = WebParser.processIndex(table);
                    fulfill(validRooms);
                }

            }).catch((err:any) => reject(err));
        });
    }

    public getRoomData(content:string, building: ValidBuilding): Promise<Array<any>> {
        const that = this;
        return new Promise((fulfill, reject) => {
            WebParser.readFile(content).then((doc:ASTNode) => {
                const table = WebParser.findNode(doc);
                if (table == null) { //Possible no rooms. Just skip
                    fulfill([]);
                } else {
                    const data = WebParser.processPage(table);
                    that.mergeData(building, data).then((rows:Array<any>) => fulfill(rows));
                }

            }).catch((err) => {
                reject(err);
            });
        })
    }

    private mergeData(building:ValidBuilding, rooms:Array<RoomDetail>): Promise<Array<any>> {
        const data:Array<any> = [];
        const that = this;
        return new Promise((fulfill, reject) => {
            that.service.getGeoResponse(building.address)
                .then((response:GeoResponse) => {
                    //{building.fullname, building.shortname, }
                    rooms.forEach((room:RoomDetail) => {
                        const name = building.shortname + "_" + room.number;
                        const row = Object.assign({name}, building, room, response);
                        data.push(row);
                    });
                    fulfill(data);
                }).catch((err:any) => {
                 fulfill([]);
            });
        });

    }

    private static readFile(data:string): Promise<ASTNode> {
        var parse5 = require('parse5');
        return new Promise((fulfill, reject) => {
            try {
                fulfill(parse5.parse(data.toString()));
            } catch (err) {
                reject(err);
            }
        });
    }

    private static findNode(doc:ASTNode):any {
        const body:ASTNode = WebParser.findBody(doc); // 31 for class full-width-container
        const table = WebParser.findTable(body);
        return table;
    }

    private static findBody(doc:ASTNode):ASTNode {
        const stack = Array.from(doc.childNodes);
        while (stack.length > 0) {
            const currentNode = stack.pop();
            if (currentNode.nodeName === "body") {
                return currentNode;
            } else if (currentNode.childNodes != null) {
                Array.from(currentNode.childNodes).forEach((node:ASTNode) => {
                    if (!WebParser.invalidNodes.has(node.nodeName)) {
                        stack.push(node);
                    }
                });
            }
        }
        return null;
    }

    private static findTable(body: ASTNode): any {
        const queue:Array<ASTNode> = Array.from(body.childNodes);
        while (queue.length > 0) {
            const currentNode = queue.shift();
            if (currentNode.attrs != null) {
                if (currentNode.attrs.some((value:ASTAttribute) => value.value.includes("table"))) {
                    return currentNode;
                } else {
                    Array.from(currentNode.childNodes).forEach((node:ASTNode) => {
                        if (!WebParser.invalidNodes.has(node.nodeName)) {
                            queue.push(node);
                        }
                    });
                }

            }
        }
        return null;
    }

    private static processIndex(table:ASTNode):Array<ValidBuilding> {
        const validRooms:Array<ValidBuilding> = [];
        const regex = /code$|title$|address$/;
        const headers = WebParser.getTableHeaders(table, regex, 3);
        const body = table.childNodes.find((node:ASTNode) => node.nodeName == "tbody");
        body.childNodes.forEach((tableNode:ASTNode) => {
            if (tableNode.nodeName == "tr") {
                const shortname = WebParser.getData(tableNode, headers[0]);
                const fullname = WebParser.getData(tableNode, headers[1]);
                const address = WebParser.getData(tableNode, headers[2]);
                const validRoom = {fullname, shortname, address};
                validRooms.push(validRoom);
            }
        });
        return validRooms;
    }

    private static processPage(table:ASTNode):Array<RoomDetail> {
        const roomData:Array<RoomDetail> = [];
        const regex = /number$|capacity$|furniture$|type$|nothing$/;
        const headers = WebParser.getTableHeaders(table, regex, 5);
        const body = table.childNodes.find((node:ASTNode) => node.nodeName == "tbody");
        body.childNodes.forEach((tableNode:ASTNode) => {
            if (tableNode.nodeName == "tr") {
                try {
                    const number = WebParser.getData(tableNode, headers[0]);
                    const seats = Number.parseInt(WebParser.getData(tableNode, headers[1])); //TODO could throw an exception
                    const furniture = WebParser.getData(tableNode, headers[2]);
                    const type = WebParser.getData(tableNode, headers[3]);
                    const href = WebParser.getData(tableNode, headers[4]);
                    roomData.push({number, seats, type, furniture, href});
                } catch (err) {
                    console.log(err);
                }
            }
        });
        return roomData;
    }

    private static getTableHeaders(table:ASTNode, regex: RegExp, expected:number): Array<string> {
        const nodeName = "thead";
        const headers = table.childNodes.find((node:ASTNode) => {
            return node.nodeName == nodeName;
        });
        const queue:Array<ASTNode> = headers.childNodes;
        const mappedHeaders = [];

        while (queue.length > 0) {
            const currentNode = queue.shift();
            if (currentNode.attrs != null) {
                const attr = currentNode.attrs.find((value:ASTAttribute) => {
                    return regex.test(value.value)
                });
                if (attr != null) {
                    mappedHeaders.push(attr.value);
                    if (mappedHeaders.length == expected) break;
                } else {
                    currentNode.childNodes.forEach((node:ASTNode) => {
                        queue.push(node);
                    });
                }
            }
        }
        return mappedHeaders;
    }

    private static getData(node: ASTNode, value:string):string {
        const length = node.childNodes.length;
        for (let i = 0; i < length; i++) {
            const currentNode = node.childNodes[i];
            if (currentNode.attrs != null) {
                for (let j = 0; j < currentNode.attrs.length; j++) {
                    const attr = currentNode.attrs[j];
                    if (attr.value == value) {
                        if (currentNode.childNodes.length > 1) {
                            const properNode = currentNode.childNodes.find((node:ASTNode) => {
                                if (node.attrs != null) {
                                    return node.attrs.some((attr:ASTAttribute) => {
                                        if (value.includes("nothing")) {
                                            return attr.name == "href";
                                        } else {
                                            return attr.name == "title";
                                        }

                                    })
                                } else {
                                    return false;
                                }
                            });
                            if (value.includes("nothing")) {
                                return properNode.attrs[0].value; //not sure if always true
                            } else {
                                return properNode.childNodes[0].value.trim();
                            }
                        } else {
                            return currentNode.childNodes[0].value.trim();
                        }
                    }
                }
            }
        }
        return null;
    }


}
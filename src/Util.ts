/**
 * Collection of logging methods. Useful for making the output easier to read and understand.
 *
 * @param msg
 */
/* tslint:disable:no-console */
var fs = require("fs");
var JSZip = require("jszip");

export default class Log {

    public static trace(msg: string) {
        console.log("<T> " + new Date().toLocaleString() + ": " + msg);
    }

    public static info(msg: string) {
        console.log("<I> " + new Date().toLocaleString() + ": " + msg);
    }

    public static warn(msg: string) {
        console.error("<W> " + new Date().toLocaleString() + ": " + msg);
    }

    public static error(msg: string) {
        console.error("<E> " + new Date().toLocaleString() + ": " + msg);
    }

    public static test(msg: string) {
        console.log("<X> " + new Date().toLocaleString() + ": " + msg);
    }

    public static zipToBase64String(path:string): Promise<string> {
        return new Promise(function(fulfill,reject) {
            new Promise(function (fulfill, reject) {
                fs.readFile(path, function (err:any, data:any) {
                    if (err) {
                        reject("Error: could not read file as input to zipToBase64String");
                    } else {
                        fulfill(data);
                    }
                })
            }).then(function (data:any) {
                fulfill(data.toString("base64"));
            }).catch(function (err:any) {
                reject("Error: invalid zip file as input to zipToBase64String");
            })
        })

    }
}

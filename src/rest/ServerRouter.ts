import {InsightResponse} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";

import restify = require('restify');
import Log from "../Util";

export class ServerRouter {
    private ifacade: InsightFacade;

    public constructor() {
        this.ifacade = new InsightFacade();
    }

    public put(req: restify.Request, res: restify.Response, next: restify.Next): void{
        let id = req.params.id;
        let data = new Buffer(req.params.body).toString('base64');
        this.ifacade.addDataset(id,data).then((resp:InsightResponse) => {
            res.json(resp.code,resp.body);
            next();
        }).catch((err) => {
            res.json(err.code,err.body)
            next();
        })
    }

    public post(req: restify.Request, res: restify.Response, next: restify.Next): void{
        let query = req.body;
        this.ifacade.performQuery(query).then((resp:InsightResponse) => {
            res.json(resp.code,resp.body);
            next();
        }).catch((err) => {
            res.json(err.code,err.body)
            next();
        })
    }

    public del(req: restify.Request, res: restify.Response, next: restify.Next): void{
        let id = req.params.id;
        this.ifacade.removeDataset(id).then((resp:InsightResponse) => {
            res.json(resp.code,resp.body);
            next();
        }).catch((err) => {
            res.json(err.code,err.body)
            next();
        })
    }

    public echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            let result = this.performEcho(req.params.msg);
            Log.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        } catch (err) {
            Log.error('Server::echo(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public performEcho(msg: string): InsightResponse {
        if (typeof msg !== 'undefined' && msg !== null) {
            return {code: 200, body: {message: msg + '...' + msg}};
        } else {
            return {code: 400, body: {error: 'Message not provided'}};
        }
    }
}
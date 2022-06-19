import 'dotenv/config';

import http, {
  Server,
} from "http";
import { RequestListenerWithOptions } from '../types';

import Router from "./router";

const defaultPort = process.env.PORT || 3000;

export default class ServerApp {
  private _router: Router;
  private _server: Server;

  constructor(server?: Server, router?: Router) {
    this._server = server || http.createServer();;
    this._router = router || new Router();

    this._server.on("request", this._router.handleRequest);

    process.on("exit", this._server.close);
  }

  public close(cb: () => void): void {
    this._server.close(cb);
  }

  public listen(PORT = defaultPort, cb: () => void) {
    return this._server.listen(PORT, cb);
  }

  public get(path: string, cb: RequestListenerWithOptions): void {
    this._router.get(path, cb);
  }
  
  public post(path: string, cb: RequestListenerWithOptions): void {
    this._router.post(path, cb);
  }

  public put(path: string, cb: RequestListenerWithOptions): void {
    this._router.put(path, cb);
  }

  public delete(path: string, cb: RequestListenerWithOptions): void {
    this._router.delete(path, cb);
  }
}

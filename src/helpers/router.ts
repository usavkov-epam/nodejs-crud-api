import {
  IncomingMessage,
  ServerResponse,
} from "http";

import { ERRORS } from "../constants";
import {
  HandlerOptions,
  RequestListenerWithOptions,
  Routes,
} from "../types";
import { Colors } from "./console";

export enum METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

const routes: Routes = {
  [METHODS.GET]: {},
  [METHODS.POST]: {},
  [METHODS.PUT]: {},
  [METHODS.DELETE]: {},
};

export default class Router {
  constructor() {}

  private addRoute = (method: METHODS) => (path: string, cb: RequestListenerWithOptions): void => {
    // RegExp for searching route param
    const routeParamRegExp = /(?<param>(?<=\$\{|\{)\S+(?=\}))/;

    // Array of route chunks strings to create RegExp
    const parsedRouteChunks = path.split("/").reduce((acc: string[], chunk) => {
      const match = chunk.match(routeParamRegExp);
      const paramName = match?.groups?.param;
      
      acc.push(paramName ? `(?<${paramName}>\\S+)` : chunk);

      return acc;
    }, []);

    // Final string for RegExp, that will be used to match the url from the request
    const pathString = `^${parsedRouteChunks.join("\/")}\\/?$`;    

    routes[method][pathString] = cb;
  }

  public get(path: string, cb: RequestListenerWithOptions): void {
    this.addRoute(METHODS.GET)(path, cb);
  }

  public post(path: string, cb: RequestListenerWithOptions): void {
    this.addRoute(METHODS.POST)(path, cb);
  }

  public put(path: string, cb: RequestListenerWithOptions): void {
    this.addRoute(METHODS.PUT)(path, cb);
  }

  public delete(path: string, cb: RequestListenerWithOptions): void {
    this.addRoute(METHODS.DELETE)(path, cb);
  }

  public handleRequest(req: IncomingMessage, res: ServerResponse, { debug = true }: HandlerOptions = {}): void {
    const { url, method } = req;

    if (debug) {
      const colorsMap = {
        [METHODS.GET]: "green",
        [METHODS.POST]: "yellow",
        [METHODS.PUT]: "blue",
        [METHODS.DELETE]: "red",
      } as HandlerOptions;
      const color = colorsMap[method!];
      console.log(Colors[color](method!), url);
    }
    
    const matchedPath = Object.keys(routes[method!]).find((pathString) => {
      const routeRegExp = new RegExp(pathString);
      return routeRegExp.test(url!);
    });

    if (matchedPath) {
      const pathParams = url!.match(new RegExp(matchedPath))?.groups;
      
      routes[method!][matchedPath](req, res, { params: {...pathParams} });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: ERRORS.pageNotFound }));
    }
  };
}

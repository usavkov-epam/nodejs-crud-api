import {
  IncomingMessage,
  RequestListener,
  ServerResponse,
} from "http";

export enum METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

interface Options {
  [key: string]: any;
}

export type RequestListenerWithOptions = (
  req: IncomingMessage,
  res: ServerResponse,
  options: Options,
) => void;

type Routes = {
  [method: string]: {
    [path: string]: RequestListenerWithOptions;
  }
}

const routes: Routes = {
  [METHODS.GET]: {},
  [METHODS.POST]: {},
  [METHODS.PUT]: {},
  [METHODS.DELETE]: {},
};

export default class Router {
  constructor() {}

  private addRoute = (method: METHODS) => (path: string, cb: RequestListener): void => {
    // RegExp for searching route param
    const routeParamRegExp = /(?<param>(?<=\$\{|\{)\w+(?=\}))/;

    // Array of route chunks strings to create RegExp
    const parsedRouteChunks = path.split("/").reduce((acc: string[], chunk) => {
      const match = chunk.match(routeParamRegExp);
      const paramName = match?.groups?.param;
      
      acc.push(paramName ? `(?<${paramName}>\\w+)` : chunk);

      return acc;
    }, []);

    // Final string for RegExp, that will be used to match the url from the request
    const pathString = `^${parsedRouteChunks.join("\/")}\\/?$`;    

    routes[method][pathString] = cb;
  }

  public get(path: string, cb: RequestListener): void {
    this.addRoute(METHODS.GET)(path, cb);
  }

  public post(path: string, cb: RequestListener): void {
    this.addRoute(METHODS.POST)(path, cb);
  }

  public put(path: string, cb: RequestListener): void {
    this.addRoute(METHODS.PUT)(path, cb);
  }

  public delete(path: string, cb: RequestListener): void {
    this.addRoute(METHODS.DELETE)(path, cb);
  }

  public handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const { url, method } = req;
    
    const matchedPath = Object.keys(routes[method!]).find((pathString) => {
      const routeRegExp = new RegExp(pathString);
      return routeRegExp.test(url!);
    });

    if (matchedPath) {
      const pathParams = url!.match(new RegExp(matchedPath))?.groups;

      console.log(pathParams);
      
      routes[method!][matchedPath](req, res, { params: {...pathParams} });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end("{\"error\": \"Page not found.\"}");
    }
  };
}

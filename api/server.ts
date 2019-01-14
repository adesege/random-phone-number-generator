import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import * as bodyParser from "body-parser";
import * as cors from "cors";

const port = process.env.PORT || 5600;

import Path = require("path");

@ServerSettings({
    acceptMimes: ["application/json"],
    componentsScan: [
      "${rootDir}/services/**/*.ts",
    ],
    mount: {
      "/api": "${rootDir}/controllers/**/*.ts",
    },
    port,
    rootDir: Path.resolve(__dirname),
})
export class Server extends ServerLoader {
  public $onMountingMiddlewares() {
    this
      .use(GlobalAcceptMimesMiddleware)
      .use(cors())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));
  }
}

new Server().start();

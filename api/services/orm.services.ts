/// <reference types="node" />

import { Service } from "@tsed/di";
import * as fs from "fs";
import * as util from "util";

@Service()
export class ORM {
  private fs: typeof fs;
  private checkFileAccess: (path: fs.PathLike, mode?: number | undefined) => Promise<void>;
  private mkDir:
  (path: fs.PathLike, options?: string | number | fs.MakeDirectoryOptions | null | undefined) => Promise<void>;
  private dbPath: fs.PathLike;
  private tablePath: string;
  private readFile: (path: fs.PathLike, options: {encoding?: any}) => Promise<Buffer>;

  constructor() {
    this.fs = fs;
    this.checkFileAccess = util.promisify(fs.access);
    this.mkDir = util.promisify(fs.mkdir);
    this.readFile = util.promisify(fs.readFile);
    this.dbPath = "./api/db";
    this.tablePath = "./api/db/%s.db";

    this.init();
  }

  public async save(options: {data: string | object, table: string }) {
    const table = options.table;
    const tablePath = util.format(this.tablePath, table);
    if (!await this._isTableExist(tablePath)) {
      return Promise.reject(new Error(`Table "${table}" does not exist`));
    }

    return this._createWriteStream({ data: options.data, tablePath });
  }

   public async findAll() {
    return await this._getStream({table: "default"});
  }

  private async init() {
    const tablePath = util.format(this.tablePath, "default");
    if (!await this._isTableExist(tablePath)) {
      this.createTable("default");
    }
  }

  private async _isTableExist(filePath: fs.PathLike) {
    try {
      // tslint:disable-next-line:no-bitwise
      await this.checkFileAccess(filePath, this.fs.constants.F_OK | this.fs.constants.W_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async _createDB() {
    try {
      await this.mkDir(this.dbPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async _getStream(options: {table: string}) {
    const tablePath = util.format(this.tablePath, options.table);
    const content = await this.readFile(tablePath, {encoding: "utf8"});
    const result = content.toString().split(/\n/);
    result.pop();
    result.shift();
    return result;
  }

  private async _createWriteStream(options: {
    tablePath: string;
    data: string | object;
    flags?: string;
    }) {
    let isDone = false;
    const stream = this.fs.createWriteStream(options.tablePath, {
      flags: options.flags || "a+",
    });

    stream.once("open", () => {
      stream.write(`${options.data.toString()}\n`);
      stream.end();
      isDone = true;
    });

    return isDone;
  }

  private async createTable(table = "default") {
    const tablePath = util.format(this.tablePath, table);
    const isTableExist = await this._isTableExist(tablePath);
    const isDBExist = await this._isTableExist(this.dbPath);
    if (!isDBExist) {
      this._createDB();
    }

    if (isTableExist) {
      return new Error(`Table "${table}" already exist`);
    }

    const isCreated = await this._createWriteStream({
      data: `# Table "${table}" created on ${new Date()}`,
      flags: "a",
      tablePath,
    });
    if (!isCreated) {
      return new Error(`There was an error creating table "${table}"`);
    }
    return Promise.resolve("Table successfully created");
  }
}

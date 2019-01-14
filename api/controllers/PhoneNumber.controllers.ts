import { Controller, Get, Post, Res } from "@tsed/common";
import * as Express from "express";
import { ORM } from "../services/orm.services";

@Controller("/phone-numbers")
export class PhoneNumber {
  constructor(private orm: ORM) {}

  @Post("/")
  public generatePhoneNumber(@Res() res: Express.Response) {
    const phoneNumber = this._generatePhoneNumbers();
    try {
      const isSaved = this.orm.save({data: phoneNumber, table: "default"});
      if (isSaved) {
        return res.status(201).send({data: phoneNumber, status: "success"});
      }
    } catch (error) {
      return res.status(500).send({msg: "There was an error completing your request", status: "fail" });
    }
  }

  @Get("/")
  public async getAllPhoneNumbers(@Res() res: Express.Response) {
    try {
      const content = await this.orm.findAll();
      return res.status(200).send({data: content, status: "success"});
    } catch (error) {
      return res.status(500).send({msg: "There was an error completing your request", status: "fail" });
    }
  }

  private _generatePhoneNumbers() {
    return `0${Math.floor(Math.random() * (100000000 - 999999999 + 1) + 999999999)}`;
  }
}

/* eslint-disable indent */
import express from "express";
import { DocumentData } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

export default class TemplatesHelper {
  public static getPaginationFromBody(req: express.Request): Pagination {
    try {
      const pagination = req.body.pagination
        ? {
            size: parseInt(req.body.pagination.size),
            page: parseInt(req.body.pagination.page),
          }
        : ({
            size: 5,
            page: 1,
          } as Pagination);
      if (req.query.size) {
        pagination.size = parseInt(req.body.size.toString()) || 5;
      }
      if (req.query.page) {
        pagination.page = parseInt(req.body.page.toString()) || 1;
      }
      return pagination;
    } catch (error) {
      return {
        size: 5,
        page: 1,
      } as Pagination;
    }
  }

  public static getPaginationFromQuery(req: express.Request): Pagination {
    try {
      const pagination = req.query.pagination
        ? {
            size: parseInt(req.query.pagination.toString().split(",")[0]),
            page: parseInt(req.query.pagination.toString().split(",")[1]),
          }
        : ({
            size: 5,
            page: 1,
          } as Pagination);
      if (req.query.size) {
        pagination.size = parseInt(req.query.size.toString()) || 5;
      }
      if (req.query.page) {
        pagination.page = parseInt(req.query.page.toString()) || 1;
      }

      return pagination;
    } catch (error) {
      return {
        size: 5,
        page: 1,
      } as Pagination;
    }
  }

  public static getCleanUid = (inMilliseconds = false): string => {
    return inMilliseconds
      ? new Date().getTime().toString()
      : uuidv4().replace(/-/g, "");
  };

  public static genrateRandomNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  public static getFilters(filterString: string) {
    const arr = JSON.parse(
      Buffer.from(filterString, "base64").toString("utf-8")
    ) as Array<FilterItem>;
    return arr;
  }

  public static getOrderBy(orderBy: string) {
    const arr = JSON.parse(
      Buffer.from(orderBy, "base64").toString("utf-8")
    ) as OrderBy;
    return arr;
  }

  public static getSystemUser = (): CurrentUser => {
    return { uid: "System", signInMethod: "System" } as CurrentUser;
  };

  public static getDefaultDocument = (
    currentUser: CurrentUser,
    update: boolean
  ): DocumentData => {
    const date = new Date();
    if (update) {
      return {
        updated_at: date.toISOString(),
        updated_at_timestamp: date.getTime(),
        updated_by: currentUser ? currentUser.uid : "System",
      } as DocumentData;
    } else {
      return {
        created_at: date.toISOString(),
        created_at_timestamp: date.getTime(),
        created_by: currentUser ? currentUser.uid : "System",
        updated_at: date.toISOString(),
        updated_at_timestamp: date.getTime(),
        updated_by: currentUser ? currentUser.uid : "System",
      } as DocumentData;
    }
  };
}

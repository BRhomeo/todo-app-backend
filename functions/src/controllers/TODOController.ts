/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import express from "express";
import TODOService from "../services/TODOService";
import TemplatesHelper from "../util/TemplatesHelper";

enum TODOStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DELETED = "deleted",
}
export default class TODOController {
  private todoService = new TODOService();

  setTODO = async (req: express.Request, res: express.Response) => {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).send("Bad Request");
      }
      const todoItem: TODOItem = {
        id: TemplatesHelper.getCleanUid(),
        title,
        description,
        status: TODOStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: req.body.user.uid,
      };
      const result = await this.todoService.setTODO(
        req.body.user as CurrentUser,
        todoItem
      );
      if (result instanceof Error) {
        return res.status(500).send("Internal Server Error");
      }
      return res.status(201).send(result);
    } catch (error) {
      console.error("TODOController => setTODO => ", error);
      return res.status(500).send("Internal Server Error");
    }
  };

  getTODOList = async (req: express.Request, res: express.Response) => {
    try {
      const pagination: Pagination = {
        size: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        page: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
      };
      const options: RequestOptions = {
        filter: {
          items: [
            {
              field: "userId",
              operator: "==",
              value: req.body.user.uid,
            },
          ],
        },
        order_by: {
          field: "createdAt",
          direction: "desc",
        },
        pagination,
      };
      const result = await this.todoService.getTODOList(options);
      if (result instanceof Error) {
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).send(result);
    } catch (error) {
      console.error("TODOController => getTODOList => ", error);
      return res.status(500).send("Internal Server Error");
    }
  };

  deleteTODO = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send("Bad Request");
      }
      const result = await this.todoService.deleteTODO(
        req.body.user as CurrentUser,
        id
      );
      if (result instanceof Error) {
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).send("Deleted");
    } catch (error) {
      console.error("TODOController => deleteTODO => ", error);
      return res.status(500).send("Internal Server Error");
    }
  };

  updateTODO = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send("Bad Request");
      }
      const { title, description, status } = req.body;
      if (!title || !description || !status) {
        return res.status(400).send("Bad Request");
      }
      const todoItem: TODOItemUpdate = {
        id,
        title,
        description,
        status,
        updatedAt: new Date(),
      };
      const result = await this.todoService.updateTODO(
        req.body.user as CurrentUser,
        todoItem
      );
      if (result instanceof Error) {
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).send(result);
    } catch (error) {
      console.error("TODOController => updateTODO => ", error);
      return res.status(500).send("Internal Server Error");
    }
  };
}

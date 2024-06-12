/* eslint-disable indent */
/* eslint-disable max-len */
import { DocumentData } from "@google-cloud/firestore";
import { FieldValue } from "firebase-admin/firestore";
import FirebaseUtil from "../util/FirebaseUtil";
import TypeDao from "../daos/TypeDao";

export default class TODOService<T extends AbstractDto> extends TypeDao<T> {
  constructor() {
    super("");
  }
  public setTODO = async (
    currentUser: CurrentUser,
    data: DocumentData
  ): Promise<DocumentData | Error> => {
    try {
      const result = await FirebaseUtil.getFirestoreInstance<DocumentData>(
        "todo"
      ).save(currentUser, data, data.id);
      if (result instanceof Error) {
        throw result;
      }
      await FirebaseUtil.getFirestoreInstance<DocumentData>("user").save(
        currentUser,
        {
          totalTasks: FieldValue.increment(1),
        },
        currentUser.uid
      );
      return Promise.resolve(result as DocumentData);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  public getTODOList = async (
    options: RequestOptions
  ): Promise<DocumentData[] | Error> => {
    try {
      const result = await FirebaseUtil.getFirestoreInstance<DocumentData>(
        "todo"
      ).list(options.pagination, options.filter, options.order_by);
      if (result instanceof Error) {
        throw result;
      }
      return Promise.resolve(result as DocumentData[]);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  public deleteTODO = async (
    currentUser: CurrentUser,
    id: string
  ): Promise<boolean | Error> => {
    try {
      // check if the record exists && belongs to the user
      const todo = await FirebaseUtil.getFirestoreInstance<DocumentData>(
        "todo"
      ).get(id);
      if (todo instanceof Error) {
        throw todo;
      }
      if (todo.userId !== currentUser.uid) {
        throw new Error("Unauthorized");
      }
      const result = await FirebaseUtil.getFirestoreInstance<DocumentData>(
        "todo"
      ).delete(currentUser, id);
      if (result instanceof Error) {
        throw result;
      }
      await FirebaseUtil.getFirestoreInstance<DocumentData>("user").save(
        currentUser,
        {
          totalTasks: FieldValue.increment(1),
        },
        currentUser.uid
      );
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  public updateTODO = async (
    currentUser: CurrentUser,
    data: DocumentData
  ): Promise<DocumentData | Error> => {
    try {
      // check if the record exists && belongs to the user
      const todo = await FirebaseUtil.getFirestoreInstance<DocumentData>(
        "todo"
      ).get(data.id);
      if (todo instanceof Error) {
        throw todo;
      }
      if (todo.userId !== currentUser.uid) {
        throw new Error("Unauthorized");
      }
      const result = await FirebaseUtil.getFirestoreInstance<DocumentData>(
        "todo"
      ).save(currentUser, data, data.id);
      if (result instanceof Error) {
        throw result;
      }
      return Promise.resolve(result as DocumentData);
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

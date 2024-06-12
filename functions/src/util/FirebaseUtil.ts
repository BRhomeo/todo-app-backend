import { DocumentData } from "@google-cloud/firestore";
import * as admin from "firebase-admin";
import { Auth } from "firebase-admin/auth";
import { Database } from "firebase-admin/database";
import { Query, WhereFilterOp, WriteBatch } from "firebase-admin/firestore";
import TemplatesHelper from "./TemplatesHelper";
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

export default class FirebaseUtil {
  private static instance = new FirebaseUtil();
  private _tokensToRemove: string[] = [];

  private constructor() {
    // private
  }

  public static getInstance(): FirebaseUtil {
    return FirebaseUtil.instance;
  }
  public static getFirestoreInstance<T extends DocumentData>(
    path: string
  ): Firestore<T> {
    return new Firestore<T>(path);
  }

  public static getFirestoreBatch(): WriteBatch {
    return admin.firestore().batch();
  }

  public static getDatabaseInstance(): Database {
    return admin.database();
  }

  public static getAuthInstance(): Auth {
    return admin.auth();
  }

  public static getAdmin() {
    return admin;
  }
  public get tokensToRemove(): Array<string> {
    return this._tokensToRemove;
  }
}

export class Firestore<T extends DocumentData> {
  constructor(public path: string) {}
  private async saveOrUpdate(
    currentUser: CurrentUser,
    data: T,
    update: boolean,
    id?: string
  ): Promise<T | string | Error> {
    try {
      if (id) {
        const ref = admin.firestore().collection(this.path).doc(id);
        Object.assign(
          data,
          TemplatesHelper.getDefaultDocument(currentUser, update)
        );
        if (update) {
          await ref.update(data);
        } else {
          await ref.set(data);
        }
        return Promise.resolve(data);
      } else {
        const ref = await admin.firestore().collection(this.path).add(data);
        return Promise.resolve(ref.id);
      }
    } catch (error: Error | any) {
      return Promise.reject(error);
    }
  }

  public async save(
    currentUser: CurrentUser,
    data: T,
    id?: string
  ): Promise<T | string | Error> {
    const result = await this.saveOrUpdate(currentUser, data, false, id);
    if (result instanceof Error) {
      Promise.reject(result);
    }
    return Promise.resolve(result);
  }

  public async update(
    currentUser: CurrentUser,
    data: T,
    id?: string
  ): Promise<T | string | Error> {
    const result = await this.saveOrUpdate(currentUser, data, true, id);
    if (result instanceof Error) {
      Promise.reject(result);
    }
    return Promise.resolve(result);
  }

  public async delete(
    currentUser: CurrentUser,
    id: string,
    filter?: Filter
  ): Promise<boolean | Error> {
    try {
      if (!filter) {
        // TODO: delete if all works fine
        // await this.saveOrUpdate(currentUser, {} as T, true, id);
        await admin.firestore().collection(this.path).doc(id).delete();
        return Promise.resolve(true);
      } else {
        return Promise.resolve(true);
      }
    } catch (error: Error | any) {
      return Promise.reject(error);
    }
  }

  public async exists(id: string): Promise<boolean | Error> {
    try {
      const result = await admin
        .firestore()
        .collection(this.path)
        .doc(id)
        .get();
      return Promise.resolve(result.exists);
    } catch (error: Error | any) {
      return Promise.reject(error);
    }
  }

  public async get(id: string): Promise<T | Error> {
    try {
      const result = await admin
        .firestore()
        .collection(this.path)
        .doc(id)
        .get();
      if (result.exists) {
        const data = result.data();
        if (data) {
          data.id = id;
          data.document_id = id;
        }
        return Promise.resolve(data as T);
      } else {
        return Promise.resolve({} as T);
      }
    } catch (error: Error | any) {
      return Promise.reject(error);
    }
  }

  public async list(
    pagination: Pagination,
    filter?: Filter,
    orderBy?: OrderBy
  ): Promise<Array<T> | Error> {
    try {
      if (!filter) {
        const result = await admin
          .firestore()
          .collection(this.path)
          .limit(pagination?.size || 5)
          .get();
        if (!result.empty) {
          return Promise.resolve(result.docs.map((doc) => doc.data() as T));
        } else {
          return Promise.resolve([] as Array<T>);
        }
      } else {
        const arr = [] as Array<T>;
        let query = admin
          .firestore()
          .collection(this.path) as unknown as Query<T>;
        const build = this.buildWhereQuery(query, filter);
        if (build instanceof Error) {
          return Promise.reject(build);
        }
        query = build;
        if (orderBy) {
          query = query.orderBy(orderBy?.field, orderBy?.direction);
        }
        const result = await query.limit(pagination.size || 5).get();
        if (!result.empty) {
          result.docs.forEach((document) => {
            const data = document.data() as any;
            data["document_id"] = document.id;
            data["id"] = document.id;
            arr.push(data as T);
          });
        }
        return Promise.resolve(arr);
      }
    } catch (error: Error | any) {
      return Promise.reject(error);
    }
  }

  protected buildWhereQuery = (
    q: Query<T>,
    filter: Filter | null | undefined
  ): Query<T> | Error => {
    try {
      if (!filter) {
        return q;
      }
      filter.items.forEach((item: FilterItem | GroupFilterItem) => {
        if (!Object.hasOwnProperty.call(item, "group")) {
          const filterItem = item as FilterItem;
          q = q.where(
            filterItem.field === "documentId"
              ? admin.firestore.FieldPath.documentId()
              : filterItem.field,
            filterItem.operator as WhereFilterOp,
            filterItem.value
          );
        }
      });
      return q;
    } catch (error: any | Error) {
      return error;
    }
  };
}

export class FirebaseAuth {}

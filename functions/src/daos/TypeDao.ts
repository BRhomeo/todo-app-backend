/* eslint-disable @typescript-eslint/no-unused-vars */
import { DocumentData } from "@google-cloud/firestore";
import AbsractDao from "./AbstractDao";
import FirebaseUtil from "../util/FirebaseUtil";

export default class TypeDao<T extends AbstractDto> extends AbsractDao<T> {
  private _collectionName: string | undefined | null;

  constructor(collectionName: string | undefined | null) {
    super();
    this.setCollectionName(collectionName);
  }

  public setCollectionName(collectionName: string | undefined | null) {
    this._collectionName = collectionName;
  }

  public getCollectionName(): string | undefined | null {
    return this._collectionName;
  }

  public async set(
    currentUser: CurrentUser,
    id: string,
    collection: string | null,
    data: T
  ): Promise<T | Error | undefined> {
    try {
      const docExists = await FirebaseUtil.getFirestoreInstance<T>(
        (collection || this.getCollectionName()) as string
      ).exists(id || (data as DocumentData).id);

      if (docExists) {
        return Promise.reject(new Error("Document by this id already exists"));
      }
      if (!this.getCollectionName() && !collection) {
        return new Error("Collection name is not set");
      }
      data.id = id;
      console.log(`path => ${this.getCollectionName() ?? collection}/${id}`);
      await FirebaseUtil.getFirestoreInstance<T>(
        (collection ?? this.getCollectionName()) as string
      ).save(currentUser, data as T, id ?? data.name);
      return data;
    } catch (error: any | Error) {
      return Promise.reject(error);
    }
  }
  public async update(
    currentUser: CurrentUser,
    id: string,
    collection: string | null,
    data: T
  ): Promise<T | Error | undefined | string> {
    try {
      const docExists = await FirebaseUtil.getFirestoreInstance<T>(
        (collection || this.getCollectionName()) as string
      ).exists(id || (data as DocumentData).id);

      if (!docExists) {
        return new Error("Document by this id isn't exists");
      }
      const result = await FirebaseUtil.getFirestoreInstance<T>(
        this.getCollectionName()
          ? (this.getCollectionName() as string)
          : (collection as string)
      ).update(currentUser, data, id);
      return Promise.resolve(result);
    } catch (error: any | Error) {
      return Promise.reject(error);
    }
  }
  public async delete(
    currentUser: CurrentUser,
    id: string,
    collection: string | null
  ): Promise<boolean | Error> {
    try {
      const docExists = await FirebaseUtil.getFirestoreInstance<T>(
        (collection || this.getCollectionName()) as string
      ).exists(id);

      if (!docExists) {
        return new Error("Document by this id isn't exists");
      }
      const result = await FirebaseUtil.getFirestoreInstance<T>(
        this.getCollectionName() as string
      ).delete(currentUser, id);
      return Promise.resolve(result);
    } catch (error: any | Error) {
      return Promise.reject(error);
    }
  }

  public async getAll(
    currentUser: CurrentUser,
    requestOptions: RequestOptions | null | undefined,
    collection?: string | null
  ): Promise<Error | T[]> {
    try {
      const ref = FirebaseUtil.getFirestoreInstance(
        this.getCollectionName() as string
      );
      const pageSize = requestOptions?.pagination?.size || 5;
      const page = requestOptions?.pagination?.page || 1;
      let orderBy = requestOptions?.order_by;
      if (!orderBy || !orderBy.field || !orderBy.direction) {
        orderBy = {
          field: "created_at_timestamp",
          direction: "desc",
        } as OrderBy;
      }

      const docsOfCollections = await ref.list(
        { size: pageSize, page: page } as Pagination,
        requestOptions?.filter,
        orderBy
      );
      if (!docsOfCollections || docsOfCollections instanceof Error) {
        return Promise.reject(docsOfCollections);
      }
      return Promise.resolve(docsOfCollections as T[]);
    } catch (error: any | Error) {
      return Promise.reject(error);
    }
  }
}

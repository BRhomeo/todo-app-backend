import { DocumentData } from "@google-cloud/firestore";
import { DocumentReference } from "firebase-admin/firestore";

export default abstract class AbsractDao<T extends AbstractDto> {
  private counter = [] as Array<number>;
  abstract set(
    currentUser: CurrentUser,
    id: string,
    collection: string,
    resource: T
  ): Promise<T | Error | undefined | boolean>;

  abstract update(
    currentUser: CurrentUser,
    id: string,
    collection: string,
    data: T
  ): Promise<T | Error | undefined | boolean | string>;

  abstract delete(
    currentUser: CurrentUser,
    id: string,
    collection: string
  ): Promise<boolean | Error>;
}

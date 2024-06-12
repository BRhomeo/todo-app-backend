import type { OrderByDirection } from "@google-cloud/firestore";
import type { FieldPath, WhereFilterOp } from "firebase-admin/firestore";
import { DocumentData } from "@google-cloud/firestore";

declare global {
  interface AbstractDto extends DocumentData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    created_at_timestamp?: number;
    updated_at_timestamp?: number;
    updated_by?: string;
    // [key: string]: any;
  }

  // !todo types
  interface TODOItem {
    id: string;
    title: string;
    description: string;
    status: TODOStatus;
    createdAt?: Date;
    updatedAt: Date;
    userId?: string;
  }
  interface TODOItemUpdate {
    id: string;
    title?: string;
    description?: string;
    status?: TODOStatus;
    updatedAt: Date;
  }

  enum TODOStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    DELETED = "deleted",
  }

  // atuh types
  interface SignIn {
    email: string;
    password: string;
  }
  interface SignUp extends SignIn {
    name: string;
  }
  interface CurrentUser {
    uid: string;
    signInMethod: string;
    referer?: boolean;
  }

  interface User extends AbstractDto {
    email: string;
    name: string;
    totalTasks?: number;
  }

  // FB util types
  interface OrderBy {
    field: string;
    direction: OrderByDirection;
    disabled?: boolean;
    random?: boolean;
    isNumber?: boolean;
  }

  interface Pagination {
    size: number;
    page: number;
  }

  interface Filter {
    items: Array<FilterItem | GroupFilterItem>;
  }

  interface FilterItem {
    field: string | FieldPath;
    operator: string | WhereFilterOp;
    value: null | string | number | boolean | Array<any>;
    or?: boolean;
  }

  interface GroupFilterItem {
    group: Array<FilterItem>;
  }

  interface RequestOptions {
    filter?: Filter;
    order_by?: OrderBy;
    pagination: Pagination;
    group_by?: boolean;
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*

  addDefaultPermissions(value: T) {
    (["Read", "Update", "Delete"] as const).forEach((val) => {
      this[`addDefault${val}Permission` as const](value);
    });
  }

  addDefaultReadPermission(value: T) {
    if (!value._read) {
      value._read = this.permissions.read;
    }
  }

  addDefaultUpdatePermission(value: T) {
    if (!value._update) {
      value._update = this.permissions.update;
    }
  }

  addDefaultDeletePermission(value: T) {
    if (!value._delete) {
      value._read = this.permissions.delete;
    }
  }
*/

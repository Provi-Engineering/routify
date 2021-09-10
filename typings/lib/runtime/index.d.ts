/// <reference types="svelte/types/runtime/ambient" />
export const Routify: typeof RoutifyRuntime;
export * from "./helpers/index.js";
import { RoutifyRuntime } from "./Instance/RoutifyRuntime.js";
import Router from "*.svelte";
import { Router as RouterClass } from "./Router/Router.js";
import { globalInstance } from "./Global/Global.js";
import { AddressReflector } from "./Router/urlReflectors/Address.js";
import { LocalStorageReflector } from "./Router/urlReflectors/LocalStorage.js";
import { InternalReflector } from "./Router/urlReflectors/Internal.js";
export { Router, RouterClass, globalInstance, AddressReflector, LocalStorageReflector, InternalReflector };

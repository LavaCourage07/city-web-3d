import { Context, createContext, useContext } from "react";
import { registerRootStore } from "mobx-keystone";
import { Store } from "./store";

export * from "./first";
export * from "./second";
export * from "./third";

export const RootStore: Store = new Store({});

registerRootStore(RootStore);

export const StoreContext: Context<Store> = createContext<Store>(RootStore);

export const useStore = () => {
  return useContext(StoreContext);
};

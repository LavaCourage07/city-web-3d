import { observable } from "mobx";
import { model, Model, prop, modelAction } from "mobx-keystone";
// import { FirstPageModel } from "./first";
// import { SecondPageModel } from "./second";
// import { ThirdPageModel } from "./third";
import { CountModel } from "./count";

@model("tb/RootStore")
export class Store extends Model({
  // 测试使用, 后面可以根据自己的业务重新命名.
  // first: prop<FirstPageModel>(() => new FirstPageModel({})),
  // second: prop<SecondPageModel>(() => new SecondPageModel({})),
  // third: prop<ThirdPageModel>(() => new ThirdPageModel({})),
  count: prop<CountModel>(() => new CountModel({})),
}) {
  @observable
  currentPage = "hotSpots";

  @modelAction
  switchPage(pageName: string) {
    this.currentPage = pageName;
  }
}

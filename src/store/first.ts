import { model, Model, prop, modelAction } from "mobx-keystone";

/**
 * 测试分页数据Model.
 */

@model("tb/FirstPage")
export class FirstPageModel extends Model({
  count: prop<number>(0),
}) {
  //
  @modelAction
  addCount() {
    this.count++;
  }
  @modelAction
  subtractCount() {
    this.count--;
  }
}

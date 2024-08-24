import { model, Model, prop, modelAction } from "mobx-keystone";

/**
 * 计数器
 */

@model("tb/Count")
export class CountModel extends Model({
  count: prop<number>(10),
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

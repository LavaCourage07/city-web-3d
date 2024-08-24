import { Renderer } from "./renderer";
import { EventEmitter } from "eventemitter3";
import * as BABYLON from "@babylonjs/core";

export class TwinStage {
  renderer: Renderer;
  events: EventEmitter; // 添加事件处理程序

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.events = new EventEmitter(); // 初始化事件处理程序

    this.renderer.loadModelAsync("aerobatic_plane.glb", this.events); // 传递事件处理程序
  }

  playAnimation(animationName: string) {
    this.renderer.playAnimation(animationName);
  }

  setLightAngle(angle: number) {
    this.renderer.setLightAngle(angle);
  }
}

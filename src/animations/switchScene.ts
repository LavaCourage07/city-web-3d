import * as BABYLON from "@babylonjs/core";

// 场景切换动画
export const switchCamera = (
  oldCamera: BABYLON.ArcRotateCamera,
  newCamera: BABYLON.ArcRotateCamera
) => {
  console.log(oldCamera, newCamera);
};

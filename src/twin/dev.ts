import * as BABYLON from "@babylonjs/core";

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/node-editor";

export function initDev(scene: BABYLON.Scene) {
  //
  scene.debugLayer
    .show({
      embedMode: true,
      overlay: true,
      globalRoot: document.body,
    })
    .then(() => {
      // Antd's style conflicts with inspector
      let embed = document.querySelector("#embed-host") as HTMLElement;
      if (embed == null) {
        embed = document.createElement("div");
        embed.id = "embed-host";
        embed.style.cssText =
          "position: fixed; top: 0; bottom: 10px; right: 0;z-index: 10;";
        document.body.appendChild(embed);
      }
      const style = embed.appendChild(document.createElement("style"));
      style!.innerHTML = `#embed-host input, button, select, optgroup, textarea { color: #000; }`;
    });
}

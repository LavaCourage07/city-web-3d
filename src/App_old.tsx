import { useEffect, useRef, useState } from "react";
import { TwinStage } from "./twin";
import SelectBoard from "./selectboard";
import { EventEmitter } from "eventemitter3"; // 导入事件处理程序
import * as BABYLON from "@babylonjs/core";

function App() {
  // 画布
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // twin实例
  const [twinInstance, setTwinInstance] = useState<TwinStage | null>(null);

  // 模型动画相关
  const [animationList, setAnimationList] = useState<string[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>();

  // 光线角度
  const [lightAngle, setLightAngle] = useState<number>(0);

  useEffect(() => {
    if (canvasRef.current == null) return;
    if (twinInstance != null) return;

    const instance = new TwinStage(canvasRef.current);
    setTwinInstance(instance);

    const events: EventEmitter = instance.events;

    // 监听模型加载事件
    events.on("modelLoaded", (animations: BABYLON.AnimationGroup[]) => {
      const animationNames = animations.map((animation) => animation.name);
      // 设置初始动画为第一个动画
      instance.playAnimation(animationNames[0]);
      setAnimationList(animationNames);
      setSelectedAnimation(animationNames[0] || null);
    });
  }, [canvasRef, twinInstance]);

  useEffect(() => {
    twinInstance?.setLightAngle(lightAngle);
  }, [twinInstance, lightAngle]);

  // 切换飞机动画
  const handleSelectAnimation = (animationName: string) => {
    setSelectedAnimation(animationName);
    console.log(`切换动画为${animationName}`);
    twinInstance?.playAnimation(animationName);
    console.log(selectedAnimation);
  };

  // 调整太阳光角度
  const handleLightAngleChange = (value: number) => {
    setLightAngle(value);
  };

  return (
    <>
      <canvas id="stage" ref={canvasRef}></canvas>
      {/* <SelectBoard
        animationList={animationList}
        onSelectAnimation={handleSelectAnimation}
        handleLightAngleChange={handleLightAngleChange}
      /> */}
    </>
  );
}

export default App;

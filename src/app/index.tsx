import { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import { Menu, MenuProps } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { useStore } from "../store";

import HotSpotsView from "../Views/HotSpotsView";
import PublicFacilityView from "../Views/PublicFacilityView";
import GuidedRoutesView from "../Views/GuidedRoutesView";
import HotRecommendView from "../Views/HotRecommendView";
import NearbyAmusementView from "../Views/NearbyAmusementView";

// import CityScene from "../city";
import "./index.less";
import { CityModelStage } from "../cityModel";
import EventEmitter from "eventemitter3";

const MainCanvas = observer(() => {
  const { currentPage } = useStore();

  switch (currentPage) {
    case "nearbyAmusement":
      return <NearbyAmusementView />;
    case "hotRecommend":
      return <HotRecommendView />;
    case "guidedRoutes":
      return <GuidedRoutesView />;
    case "publicFacility":
      return <PublicFacilityView />;
    case "hotSpots":
    default:
      return <HotSpotsView />;
  }
});

const items: MenuProps["items"] = [
  {
    label: "热点打卡",
    key: "hotSpots",
    icon: <MailOutlined />,
  },
  {
    label: "公共设施",
    key: "publicFacility",
    icon: <AppstoreOutlined />,
  },
  {
    label: "游线导览",
    key: "guidedRoutes",
    icon: <SettingOutlined />,
  },
  {
    label: "大众推荐",
    key: "hotRecommend",
    icon: <MailOutlined />,
  },
  {
    label: "周边游乐",
    key: "nearbyAmusement",
    icon: <AppstoreOutlined />,
  },
];

export const App = observer(() => {
  // 画布
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // twin实例
  const [cityModelInstance, setCityModelInstance] =
    useState<CityModelStage | null>(null);
  const [scene, setScene] = useState<BABYLON.Scene | null>(null);
  const [currentCamera, setCurrentCamera] = useState<string | null>(null);
  const [initialCamera, setInitialCamera] = useState<object | null>(null);

  // console.log("store", store);
  const { currentPage } = useStore();
  const rootStore = useStore();

  useEffect(() => {
    if (canvasRef.current == null) return;
    if (cityModelInstance != null) return;

    const instance = new CityModelStage(canvasRef.current);
    setCityModelInstance(instance);

    const events: EventEmitter = instance.events;

    // 监听模型加载事件
    events.on("modelLoaded", (scene: BABYLON.Scene) => {
      console.log("@@模型加载完成", scene, scene.cameras, scene.cameras[0]);
      setInitialCamera({
        position: scene.cameras[0].position.clone(),
        target: scene.cameras[0].target.clone(),
      });
      setScene(scene);
    });
  }, [canvasRef, cityModelInstance, currentPage]);

  useEffect(() => {
    if (cityModelInstance && scene) {
      const curCamera = currentPage;
      setCurrentCamera(curCamera);
      cityModelInstance?.switchCamera(curCamera);
      console.log(currentPage);
    }
  }, [cityModelInstance, currentPage]);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("导航栏切换页面");
    rootStore.switchPage(e.key);
    if (e.key == "nearbyAmusement") {
      console.log("转场动画");
    }
  };

  //
  return (
    <div className="h-full w-full">
      <div className="nav w-full">
        <Menu
          className="menu"
          onClick={onClick}
          selectedKeys={[currentPage]}
          mode="horizontal"
          items={items}
        />
      </div>
      <div className="mainContent">
        <MainCanvas />
      </div>
      <canvas id="stage" ref={canvasRef}></canvas>
      {/* <CityScene /> */}
    </div>
  );
});

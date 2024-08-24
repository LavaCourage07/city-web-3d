import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/materials";
import "@babylonjs/inspector";
import "@babylonjs/node-editor";
import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

import { EventEmitter } from "eventemitter3";

import {
  linkData,
  dotData,
  aroundTransferData,
  tripData,
  squareData,
  busData,
  subwayData,
  parkData,
  careRoomData,
  restRoomData,
  FacilityData,
} from "./mockdata";

BABYLON.DracoCompression.Configuration.decoder = {
  wasmUrl: "/draco/draco_wasm_wrapper_gltf.js",
  wasmBinaryUrl: "/draco/draco_decoder_gltf.wasm",
  fallbackUrl: "/draco/draco_decoder_gltf.js",
};

type PositionObject = {
  x: number;
  y: number;
  z: number;
};

interface Point {
  x: number;
  y: number;
  z: number;
}

interface DotPosition {
  dotID: string;
  center: Point;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  hotPageCamera: BABYLON.ArcRotateCamera;
  facilityPageCamera: BABYLON.ArcRotateCamera;
  routePageCamera: BABYLON.ArcRotateCamera;
  recommendPageCamera: BABYLON.ArcRotateCamera;
  aroundPageCamera: BABYLON.ArcRotateCamera;

  envLight: BABYLON.HemisphericLight;
  sunLight: BABYLON.DirectionalLight;

  animations: BABYLON.AnimationGroup[] | undefined;

  // shadowGenerator: BABYLON.ShadowGenerator;

  highlightLayer: BABYLON.HighlightLayer | null = null;

  testLine: void | undefined;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    if (import.meta.env.DEV) {
      import("./dev").then((mod) => mod.initDev(this.scene));
    }
    this.hotPageCamera = new BABYLON.ArcRotateCamera(
      "hotPageCamera",
      8,
      1,
      46,
      new BABYLON.Vector3(100, 150, 220),
      this.scene
    );
    this.hotPageCamera.attachControl(canvas, true);
    this.facilityPageCamera = new BABYLON.ArcRotateCamera(
      "facilityPageCamera",
      1.75,
      0.75,
      155,
      new BABYLON.Vector3(350, 250, 300),
      this.scene
    );
    this.facilityPageCamera.attachControl(canvas, true);
    this.routePageCamera = new BABYLON.ArcRotateCamera(
      "routePageCamera",
      1.55,
      0.68,
      100,
      new BABYLON.Vector3(400, 300, 300),
      this.scene
    );
    this.routePageCamera.attachControl(canvas, true);
    this.recommendPageCamera = new BABYLON.ArcRotateCamera(
      "recommendPageCamera",
      6.76,
      1.06,
      248,
      new BABYLON.Vector3(550, 85, 30),
      this.scene
    );
    this.recommendPageCamera.attachControl(canvas, true);
    this.aroundPageCamera = new BABYLON.ArcRotateCamera(
      "aroundPageCamera",
      1.55,
      0,
      2400,
      new BABYLON.Vector3(500, 1200, -300),
      this.scene
    );
    this.aroundPageCamera.attachControl(canvas, true);
    this.scene.activeCamera = this.hotPageCamera;

    this.envLight = new BABYLON.HemisphericLight(
      "envLight",
      BABYLON.Vector3.Up(),
      this.scene
    );
    this.envLight.intensity = 1;

    this.sunLight = new BABYLON.DirectionalLight(
      "sunLight",
      new BABYLON.Vector3(1, 1, 0),
      this.scene
    );
    this.sunLight.position.set(0, 5, 0);
    this.sunLight.diffuse = BABYLON.Color3.White();

    // 注册鼠标移动事件监听器
    this.scene.onPointerMove = (_, pickResult) => {
      // console.log(evt);
      this.onPointerMove(pickResult);
    };

    this.render();
  }

  // 鼠标经过高亮
  onPointerMove(pickResult: BABYLON.PickingInfo) {
    if (
      pickResult.hit &&
      pickResult.pickedMesh &&
      pickResult.pickedMesh instanceof BABYLON.Mesh
    ) {
      if (
        pickResult.pickedMesh.name === "aerobatic_plane.2" &&
        !this.highlightLayer
      ) {
        // 如果鼠标指向飞机模型且当前没有高亮层
        this.highlightPlane(pickResult.pickedMesh);
      }
    } else {
      // 如果鼠标不在飞机模型上，移除高亮层
      this.removeHighlight();
    }
  }

  highlightPlane(planeMesh: BABYLON.Mesh) {
    // 创建一个高亮效果
    this.highlightLayer = new BABYLON.HighlightLayer("hl1", this.scene);
    this.highlightLayer.addMesh(planeMesh, BABYLON.Color3.Yellow());
    this.highlightLayer.innerGlow = false;
    this.highlightLayer.outerGlow = true;
  }

  removeHighlight() {
    if (this.highlightLayer) {
      this.highlightLayer.dispose();
      this.highlightLayer = null;
    }
  }

  // 导入周边区域模型
  async loadAroundModelAsync(fileName: string, events: EventEmitter) {
    const res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      fileName,
      this.scene
    );

    // 触发事件并传递
    events.emit("modelLoaded", this.scene);

    const buildingMesh = res.meshes[0];
    buildingMesh.position.x -= 45.5;
    buildingMesh.position.y -= 3;
    buildingMesh.position.z -= 58;

    let aroundBuildMesh = this.scene.getMeshByName("氛围城市");

    if (aroundBuildMesh) {
      aroundBuildMesh.visibility = 0.2;
    }

    let cityRoadMesh = this.scene.getMeshByName("道路线");
    if (cityRoadMesh) {
      cityRoadMesh.visibility = 0.3;
    }

    let ground = this.scene.getMeshByName("地面");
    if (ground) {
      ground.position.y -= 2;
    }

    let coreBuildMesh1 = this.scene.getMeshByName("景区建筑_primitive0");
    if (coreBuildMesh1) {
      coreBuildMesh1.isVisible = false;
    }

    let coreBuildMesh2 = this.scene.getMeshByName("景区建筑_primitive1");
    if (coreBuildMesh2) {
      coreBuildMesh2.isVisible = false;
    }

    // 用于历史街区模型中的材质名称的数组
    const materialNames = [
      "二期墙面 ",
      "Color H04",
      "一期墙面",
      "博物馆墙面",
      "Color J08",
      "skp_front_default",
      "学校墙面",
      "Color D03",
      "<auto>4",
      "Color H08",
      "三期墙面",
      "四期墙面",
      "Color M00",
      "Color M03",
      "Color F04",
      "Color J05",
      "Color A05",
      "Color G04",
      "0039_DarkOrange",
      "15 - Default",
    ];

    let blueMaterial = this.scene.getMaterialByName("[0128_White]");
    if (blueMaterial) {
      // 修改材质的颜色为白色
      blueMaterial.alpha = 0.8;
      blueMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
      blueMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
      blueMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);

      this.scene.meshes.forEach((mesh) => {
        if (mesh.material && materialNames.includes(mesh.material.name)) {
          console.log("###修改了材质");
          mesh.material = blueMaterial;
        }
      });
    } else {
      console.log("未找到名为 [0128_White] 的材质");
    }
  }

  // 加载核心区域模型
  async loadCoreModelAsync(fileName: string) {
    const res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      fileName,
      this.scene
    );

    // 修改 古建筑屋顶 材质
    let bwgRoofMaterial = this.scene.getMaterialByName("古建筑顶");
    if (bwgRoofMaterial) {
      bwgRoofMaterial.alpha = 0.8;
    }

    // 创建 景区外轮廓 材质
    let spotOutlineMaterial = new BABYLON.StandardMaterial(
      "spotOutlineMaterial",
      this.scene
    );
    spotOutlineMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0);

    // 创建 玻璃 材质
    const glassMaterial = new BABYLON.PBRMaterial("glassMaterial", this.scene);
    glassMaterial.albedoColor = new BABYLON.Color3(0, 0.5, 1); // 设置亮青色
    glassMaterial.metallic = 0; // 金属度为0
    glassMaterial.roughness = 0.2; // 粗糙度为0.1
    glassMaterial.alpha = 0.5; // 设置透明度为0.5，表示半透明

    // 创建 屋顶瓦面 材质
    const roofMat = new BABYLON.StandardMaterial("roofMat");
    roofMat.bumpTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/roof.jpg"
    );
    roofMat.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.95);

    res.meshes.forEach((mesh) => {
      // 给每个组件绑定点击事件
      mesh.actionManager = new BABYLON.ActionManager(this.scene);
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnDoublePickTrigger,
          (evt) => {
            console.log("@@evt", evt.source.name);
          }
        )
      );

      // 种树
      if (mesh.name.startsWith("tree")) {
        let boundingBox = mesh.getBoundingInfo().boundingBox;
        let center = boundingBox.centerWorld;
        console.log("@@@tree", mesh.name, center);
        // this.createTree(this.scene, center);
        mesh.isVisible = false;
      }

      // 隐藏辅助点位和不用的地面
      if (
        mesh.name.startsWith("Group_") ||
        mesh.name.startsWith("sxj") ||
        mesh.name.startsWith("JT") ||
        mesh.name.startsWith("SM") ||
        mesh.name.startsWith("CT") ||
        mesh.name.startsWith("LW") ||
        mesh.name.startsWith("zty") ||
        mesh.name.startsWith("bs") ||
        mesh.name.startsWith("pp") ||
        mesh.name.startsWith("ba") ||
        mesh.name.startsWith("w1") ||
        mesh.name.startsWith("w2") ||
        mesh.name.startsWith("w3") ||
        mesh.name.startsWith("w4") ||
        mesh.name.startsWith("w5") ||
        mesh.name.startsWith("w6") ||
        mesh.name.startsWith("w7") ||
        mesh.name.startsWith("Rectangle001")
      ) {
        console.log("###需要隐藏的辅助点", mesh.name);
        mesh.isVisible = false;
      }

      // 替换材质
      if (
        mesh.material &&
        (mesh.material.name === "学校玻璃" || mesh.material.name === "二期玻璃")
      ) {
        mesh.material = glassMaterial;
      }
      if (
        mesh.material &&
        (mesh.material.name === "一期屋顶" ||
          mesh.material.name === "二期屋顶" ||
          mesh.material.name === "三期屋顶" ||
          mesh.material.name === "学校屋顶" ||
          mesh.material.name === "片墙顶" ||
          mesh.material.name === "白塔屋顶" ||
          mesh.material.name === "博物馆平台")
      ) {
        mesh.material = roofMat;
      }

      // 轮廓线高亮
      // 轮廓线高亮
      if (mesh.material && mesh.name.startsWith("a_00")) {
        // mesh.isVisible = false;
        mesh.material = spotOutlineMaterial;
        // 创建一个高亮层
        var highlightLayer = new BABYLON.HighlightLayer("hl1", this.scene);
        // 将轮廓线高亮添加到TorusKnot，设置颜色为黄色，宽度为2
        highlightLayer.addMesh(mesh, new BABYLON.Color3(1, 0.5, 0));
        highlightLayer.innerGlow = false; // 关闭内部发光
        highlightLayer.outerGlow = true; // 开启外部发光
        highlightLayer.blurHorizontalSize = 0.5; // 水平模糊大小
        highlightLayer.blurVerticalSize = 0.5; // 垂直模糊大小
      }
    });

    // 生成热点飞线
    this.createFlyLineForHot();

    // 生成公交路径
    this.createTransferLinesForSpots(aroundTransferData);

    // 游览路线生成
    this.createTripLinesForRoute(tripData);

    // 公共设施数据标注
    // this.createFacilityLabels();
  }

  // 批量标注基础设施
  createFacilityLabels() {
    // 节点广场
    for (let i = 0; i < squareData.length; i++) {
      let curDot = this.scene.getMeshByName("Group_" + squareData[i].name);
      if (curDot) {
        // 更新物体的世界矩阵
        curDot.computeWorldMatrix(true);
        this.createLabelForFacility(this.scene, curDot, "广场");
      }
    }
    // 公交站
    for (let i = 0; i < busData.length; i++) {
      let curDot;
      if (busData[i].name == "bs5") {
        curDot = this.scene.getMeshByName("Group_171");
      } else {
        curDot = this.scene.getMeshByName(busData[i].name + "_001");
      }

      if (curDot) {
        curDot.computeWorldMatrix(true);
        this.createLabelForFacility(this.scene, curDot, "公交站");
      }
    }
    // 地铁站
    for (let i = 0; i < subwayData.length; i++) {
      let curDot = this.scene.getMeshByName("Group_" + subwayData[i].name);
      if (curDot) {
        curDot.computeWorldMatrix(true);
        this.createLabelForFacility(this.scene, curDot, "地铁站");
      }
    }
    // 停车场
    for (let i = 0; i < parkData.length; i++) {
      let curDot = this.scene.getMeshByName(parkData[i].name + "_001");
      if (curDot) {
        curDot.computeWorldMatrix(true);
        this.createLabelForFacility(this.scene, curDot, "停车场");
      }
    }
    // 母婴室
    for (let i = 0; i < careRoomData.length; i++) {
      let curDot = this.scene.getMeshByName(careRoomData[i].name + "_001");
      if (curDot) {
        curDot.computeWorldMatrix(true);
        this.createLabelForFacility(this.scene, curDot, "母婴室");
      }
    }
    // 卫生间
    for (let i = 0; i < restRoomData.length; i++) {
      let curDot = this.scene.getMeshByName(restRoomData[i].name + "_001");
      if (curDot) {
        // 更新物体的世界矩阵
        curDot.computeWorldMatrix(true);
        this.createLabelForFacility(this.scene, curDot, "卫生间");
      }
    }
  }

  // 创建基础设施标签
  createLabelForFacility(
    scene: BABYLON.Scene,
    curDot: BABYLON.AbstractMesh,
    title: string
  ): void {
    let boundingBox = curDot.getBoundingInfo().boundingBox;
    let center = boundingBox.centerWorld;

    // 创建同心圆环平面
    // 创建内环（白色）
    const innerRing = BABYLON.MeshBuilder.CreateTorus(
      "innerRing",
      { diameter: 1.5, thickness: 0.2, tessellation: 60 },
      scene
    );
    innerRing.position = center;
    const innerMaterial = new BABYLON.StandardMaterial("innerMat", scene);
    innerMaterial.diffuseColor = BABYLON.Color3.White();
    innerRing.material = innerMaterial;

    // 创建外环（红色）
    const outerRing = BABYLON.MeshBuilder.CreateTorus(
      "outerRing",
      { diameter: 3, thickness: 0.2, tessellation: 60 },
      scene
    );
    outerRing.position = center;
    const outerMaterial = new BABYLON.StandardMaterial("outerMat", scene);
    outerMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0); // 红色
    outerRing.material = outerMaterial;

    // 创建垂直线
    const linePoints = [
      new BABYLON.Vector3(center.x, center.y, center.z),
      new BABYLON.Vector3(center.x, center.y + 20, center.z),
    ];
    const line = BABYLON.MeshBuilder.CreateLines(
      "line",
      { points: linePoints },
      scene
    );

    // 创建标签
    // 创建一个全屏UI
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 创建文本块
    const textBlock = new TextBlock();
    textBlock.text = title + curDot.name;
    textBlock.color = "white";
    textBlock.fontSize = 10;
    textBlock.outlineWidth = 4;
    textBlock.outlineColor = "black";
    advancedTexture.addControl(textBlock);

    // 将文本块与3D对象连接
    textBlock.linkWithMesh(line);
    textBlock.linkOffsetY = -30; // 调整以确保文本显示在3D对象的顶部
  }

  // 根据热点生成飞线场景
  createFlyLineForHot() {
    // 生成飞线
    // 获取所有点的坐标
    const dotsPosition: DotPosition[] = [];
    for (let i = 0; i < dotData.length; i++) {
      let curDot = this.scene.getMeshByName(dotData[i]);
      if (curDot) {
        // 更新物体的世界矩阵
        curDot.computeWorldMatrix(true);

        let boundingBox = curDot.getBoundingInfo().boundingBox;
        let center = boundingBox.centerWorld;
        console.log(i, dotData[i], center.x, center.y, center.z);

        let sphere = BABYLON.MeshBuilder.CreateSphere(
          "sphere",
          { diameter: 3 },
          this.scene
        );
        sphere.position = center;
        sphere.material = new BABYLON.StandardMaterial("sphereMat", this.scene);
        sphere.material.diffuseColor = BABYLON.Color3.Red();

        dotsPosition.push({
          dotID: dotData[i],
          center: { x: center.x, y: center.y, z: center.z },
        });
      }
    }
    console.log("获得所有点的坐标", dotsPosition);
    const linkRes = [];
    // 根据链接数据，对点连线
    for (let i = 0; i < linkData.length; i++) {
      let startP: Point | undefined = dotsPosition.find(
        (item) => item.dotID === linkData[i].startID
      )?.center;
      let endP: Point | undefined = dotsPosition.find(
        (item) => item.dotID === linkData[i].endID
      )?.center;
      let midP: Point;

      if (startP && endP) {
        midP = {
          x: (startP.x + endP.x) / 2,
          y: (startP.y + endP.y) / 2 + 15,
          z: (startP.z + endP.z) / 2,
        };

        linkRes.push({
          start: startP,
          mid: midP,
          end: endP,
          level: linkData[i].linkLevel,
        });
      }
    }

    console.log("###获得所有线的坐标", linkRes);
    // 开始画线
    for (let i = 0; i < linkRes.length; i++) {
      let { start, mid, end, level } = linkRes[i];
      console.log("###", i, start, mid, end);
      this.generateFlowingLightTube(
        this.scene,
        0.3,
        0.33,
        new BABYLON.Vector3(start.x, start.y, start.z),
        new BABYLON.Vector3(mid.x, mid.y, mid.z),
        new BABYLON.Vector3(end.x, end.y, end.z),
        level * 0.5
      );
    }
  }

  // 根据不同的游览点数据，创建导览路径
  createTripLinesForRoute(tripData: Array<FacilityData>[]) {
    for (let i = 0; i < tripData.length; i++) {
      const curTransferArr = tripData[i];
      // 创建公交路径
      const curTransferPoints = [];
      for (let j = 0; j < curTransferArr.length; j++) {
        let curDot = this.scene.getMeshByName(
          "Group_" + curTransferArr[j].name
        );
        if (curDot) {
          // 更新物体的世界矩阵
          curDot.computeWorldMatrix(true);

          let boundingBox = curDot.getBoundingInfo().boundingBox;
          let center = boundingBox.centerWorld;
          curTransferPoints.push(center);
          console.log("###", j, curTransferArr[j].name, center);
          curDot.isVisible = false;
        }
      }
      this.createTripLine(this.scene, curTransferPoints);
    }
  }

  // 创建游览路径
  createTripLine(scene: BABYLON.Scene, points: BABYLON.Vector3[]): void {
    // 创建线条
    const lines = BABYLON.MeshBuilder.CreateLines(
      "lines",
      { points: points, updatable: false },
      scene
    );
    lines.color = BABYLON.Color3.Blue();

    // 遍历每个点，创建逐渐扩散的圆形
    points.forEach((point, index) => {
      // 创建圆形
      const circle = BABYLON.MeshBuilder.CreateDisc(
        `circle${index}`,
        { radius: 0.5, tessellation: 32 },
        scene
      );
      circle.position = point;
      circle.rotation.x = Math.PI / 2;

      // 设置材料（为了视觉效果）
      const material = new BABYLON.StandardMaterial(`circleMat${index}`, scene);
      material.diffuseColor = new BABYLON.Color3(0, 1, 1);
      circle.material = material;

      // 创建动画
      const animation = new BABYLON.Animation(
        `circleAnimation${index}`,
        "scaling",
        30,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
      );
      const keyFrames = [];

      keyFrames.push({
        frame: 0,
        value: new BABYLON.Vector3(1, 1, 1),
      });

      keyFrames.push({
        frame: 100,
        value: new BABYLON.Vector3(5, 5, 5),
      });

      animation.setKeys(keyFrames);

      // 应用动画
      circle.animations = [animation];
      scene.beginAnimation(circle, 0, 100, true);
    });
  }

  // 根据不同的景点交通数据，创建交通路径
  createTransferLinesForSpots(aroundTransferData: Array<FacilityData>[]) {
    for (let i = 0; i < aroundTransferData.length; i++) {
      const curTransferArr = aroundTransferData[i];
      // 创建公交路径
      const curTransferPoints = [];
      for (let j = 0; j < curTransferArr.length; j++) {
        let curDot = this.scene.getMeshByName(curTransferArr[j].name + "_001");
        if (curDot) {
          // 更新物体的世界矩阵
          curDot.computeWorldMatrix(true);

          let boundingBox = curDot.getBoundingInfo().boundingBox;
          let center = boundingBox.centerWorld;
          curTransferPoints.push(center);
          console.log("###", j, curTransferArr[j].name, center);
          curDot.isVisible = false;
        }
      }
      this.createTransferLine(this.scene, curTransferPoints);
    }
  }

  // 创建交通路径
  createTransferLine(scene: BABYLON.Scene, points: BABYLON.Vector3[]): void {
    // 创建线条
    const lines = BABYLON.MeshBuilder.CreateLines(
      "lines",
      { points: points, updatable: false },
      scene
    );

    console.log(lines);

    // 遍历每个点，创建逐渐扩散的圆形
    points.forEach((point, index) => {
      // 创建圆形
      const circle = BABYLON.MeshBuilder.CreateDisc(
        `circle${index}`,
        { radius: 0.5, tessellation: 32 },
        scene
      );
      circle.position = point;
      circle.rotation.x = Math.PI / 2;

      // 设置材料（为了视觉效果）
      const material = new BABYLON.StandardMaterial(`circleMat${index}`, scene);
      material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
      circle.material = material;

      // 创建动画
      const animation = new BABYLON.Animation(
        `circleAnimation${index}`,
        "scaling",
        30,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
      );
      const keyFrames = [];

      keyFrames.push({
        frame: 0,
        value: new BABYLON.Vector3(1, 1, 1),
      });

      keyFrames.push({
        frame: 100,
        value: new BABYLON.Vector3(5, 5, 5),
      });

      animation.setKeys(keyFrames);

      // 应用动画
      circle.animations = [animation];
      scene.beginAnimation(circle, 0, 100, true);
    });
  }

  // 创建树
  createTree(scene: BABYLON.Scene, position: BABYLON.Vector3): void {
    // 创建树干（圆柱体）
    const trunk = BABYLON.MeshBuilder.CreateCylinder(
      "trunk",
      {
        height: 2,
        diameter: 0.5,
      },
      scene
    );
    trunk.position = position.clone();
    trunk.position.y += 1; // 调整树干的垂直位置

    // 创建树冠（球体）
    const treetop = BABYLON.MeshBuilder.CreateSphere(
      "treetop",
      {
        diameter: 3,
      },
      scene
    );
    treetop.position = position.clone();
    treetop.position.y += 3; // 调整树冠的垂直位置
  }

  // 场景切换动画
  switchCamera(curCamera: string) {
    console.log("@@场景切换动画", curCamera);
    switch (curCamera) {
      case "nearbyAmusement":
        this.scene.activeCamera = this.aroundPageCamera;
        return;
      case "hotRecommend":
        this.scene.activeCamera = this.recommendPageCamera;
        return;
      case "guidedRoutes":
        this.scene.activeCamera = this.routePageCamera;
        return;
      case "publicFacility":
        this.scene.activeCamera = this.facilityPageCamera;
        return;
      case "hotSpots":
        this.scene.activeCamera = this.hotPageCamera;
        return;
      default:
        this.scene.activeCamera = this.hotPageCamera;
        return;
    }
  }

  // 生成渐变圆形的函数
  generateCirclePlane(
    shaderName: string,
    scene: BABYLON.Scene,
    positionObj: PositionObject
  ) {
    // 渐变圆形生成
    const circlePlane = BABYLON.MeshBuilder.CreateGround("circlePlane", {
      width: 0.5,
      height: 0.5,
    });
    circlePlane.position.set(positionObj.x, positionObj.y, positionObj.z);

    // 定义顶点着色器
    BABYLON.Effect.ShadersStore["circleVertexShader"] = `
        precision highp float;
        // Attributes
        attribute vec3 position;
        attribute vec2 uv;
        // Uniforms
        uniform mat4 worldViewProjection;
        // Varying
        varying vec2 vUV;
        void main() {
            gl_Position = worldViewProjection * vec4(position, 1.0);
            vUV = uv;
        }
    `;

    // 定义片段着色器
    BABYLON.Effect.ShadersStore["circleFragmentShader"] = `
        precision highp float;
        varying vec2 vUV;
        void main(void) {
            float distance = distance(vUV, vec2(0.5, 0.5));
            if (distance > 0.3) {
                discard; // Discard pixel outside the circle
            }
            float gradient = smoothstep(0.0, 0.5, distance);
            gl_FragColor = mix(vec4(0.0, 0.0, 1.0, 1.0), vec4(1.0, 1.0, 1.0, 0.0), gradient);
        }
    `;

    // Shader material
    const circleShaderMaterial = new BABYLON.ShaderMaterial(
      shaderName,
      scene,
      {
        vertex: "circle",
        fragment: "circle",
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["worldViewProjection"],
      }
    );

    circlePlane.material = circleShaderMaterial;
    circleShaderMaterial.backFaceCulling = true;

    return circlePlane;
  }

  // 生成流光线条的函数
  generateFlowingLightTube(
    scene: BABYLON.Scene,
    radius: number,
    highlightRadius: number,
    pointA: BABYLON.DeepImmutableObject<BABYLON.Vector3>,
    pointC: BABYLON.DeepImmutableObject<BABYLON.Vector3>,
    pointB: BABYLON.DeepImmutableObject<BABYLON.Vector3>,
    level: number = 1
  ) {
    console.log("开始画线@");
    const bezierCurve = BABYLON.Curve3.CreateQuadraticBezier(
      pointA,
      pointC,
      pointB,
      30
    );
    const curvePoints = bezierCurve.getPoints();

    // 创建路径
    const tube = BABYLON.MeshBuilder.CreateTube(
      "tube",
      {
        path: curvePoints,
        radius: radius * level,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true,
      },
      scene
    );
    const tubeMaterial = new BABYLON.StandardMaterial("tubeMaterial", scene);
    tubeMaterial.diffuseColor = new BABYLON.Color3(1, 0.4, 0);
    tubeMaterial.alpha = 0.3;
    tube.material = tubeMaterial;

    // 高光初始化
    const highlightLength = 0.1;
    let t = 0;
    const highlightPath = [curvePoints[0], curvePoints[0]];
    let highlightTube = BABYLON.MeshBuilder.CreateTube(
      "highlightTube",
      {
        path: highlightPath,
        radius: highlightRadius * level,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true,
      },
      scene
    );
    const highlightMaterial = new BABYLON.StandardMaterial(
      "highlightMaterial",
      scene
    );
    highlightMaterial.emissiveColor = new BABYLON.Color3(1, 0.4, 0);
    highlightMaterial.disableLighting = true;
    highlightMaterial.alpha = 0.7;
    highlightTube.material = highlightMaterial;

    // 曲线分段
    const interpolateAlongCurve = function (t: number) {
      const segment = Math.floor(t * (curvePoints.length - 1));
      const segmentFraction = t * (curvePoints.length - 1) - segment;
      if (segment >= curvePoints.length - 1) {
        return curvePoints[curvePoints.length - 1];
      }
      return BABYLON.Vector3.Lerp(
        curvePoints[segment],
        curvePoints[segment + 1],
        segmentFraction
      );
      console.log("画线成功");
    };

    // 高光移动动画
    scene.registerBeforeRender(function () {
      t += 0.015;
      if (t > 1) {
        t = 0;
      }
      const point1 = interpolateAlongCurve(t);
      const point2 = interpolateAlongCurve(Math.min(t + highlightLength, 1));
      highlightTube = BABYLON.MeshBuilder.CreateTube("highlightTube", {
        path: [point1, point2],
        radius: highlightRadius * level,
        instance: highlightTube,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      });
    });
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}

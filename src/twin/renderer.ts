import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/materials";
import "@babylonjs/inspector";
import "@babylonjs/node-editor";

import { EventEmitter } from "eventemitter3";

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

export class Renderer {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  camera: BABYLON.ArcRotateCamera;

  envLight: BABYLON.HemisphericLight;
  sunLight: BABYLON.DirectionalLight;

  animations: BABYLON.AnimationGroup[] | undefined;

  highlightLayer: BABYLON.HighlightLayer | null = null;
  testLine: void | undefined;
  shadowGenerator: any;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    if (import.meta.env.DEV) {
      import("./dev").then((mod) => mod.initDev(this.scene));
    }
    this.camera = new BABYLON.ArcRotateCamera(
      "camera",
      8,
      1,
      46,
      new BABYLON.Vector3(100, 150, 220),
      this.scene
    );
    this.camera.attachControl(canvas, true);

    this.scene.activeCamera = this.camera;

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

    // this.ground = BABYLON.MeshBuilder.CreateGround("ground", {
    //   width: 3,
    //   height: 3,
    // });

    // StandardMaterial
    // const groundMat = new BABYLON.StandardMaterial("groundMat", this.scene);
    // groundMat.diffuseTexture = new BABYLON.Texture(
    //   "material/watercover.png",
    //   this.scene
    // );
    // groundMat.diffuseTexture.hasAlpha = true;
    // this.ground.material = groundMat;

    // this.middleStation1 = BABYLON.MeshBuilder.CreateCylinder("middleStation1", {
    //   diameter: 1,
    //   height: 0.05,
    // });
    // this.middleStation1.position.y = 0.025;

    // this.middleStation2 = BABYLON.MeshBuilder.CreateCylinder("middleStation2", {
    //   diameter: 0.8,
    //   height: 0.05,
    // });
    // this.middleStation2.position.y = 0.075;
    // this.middleStation3 = BABYLON.MeshBuilder.CreateCylinder("middleStation3", {
    //   diameter: 0.5,
    //   height: 0.05,
    // });
    // this.middleStation3.position.y = 0.125;

    //#region ------------------------------------------------------
    // // ShaderMaterial demo
    // this.box = BABYLON.MeshBuilder.CreateBox("box", {});
    // this.box.scaling.y = 0.1;
    // // this.box.position.y = 0.025;

    // // 盒子也接收阴影
    // this.box.receiveShadows = true;

    // // 定义顶点着色器
    // BABYLON.Effect.ShadersStore["customVertexShader"] =
    //   "\r\n" +
    //   "precision highp float;\r\n" +
    //   "// Attributes\r\n" +
    //   "attribute vec3 position;\r\n" +
    //   "attribute vec2 uv;\r\n" +
    //   "// Uniforms\r\n" +
    //   "uniform mat4 worldViewProjection;\r\n" +
    //   "// Varying\r\n" +
    //   "varying vec2 vUV;\r\n" +
    //   "void main(void) {\r\n" +
    //   "    gl_Position = worldViewProjection * vec4(position, 1.0);\r\n" +
    //   "    vUV = uv;\r\n" +
    //   "}\r\n";

    // // 定义片段着色器
    // BABYLON.Effect.ShadersStore["customFragmentShader"] =
    //   "\r\n" +
    //   "precision highp float;\r\n" +
    //   "varying vec2 vUV;\r\n" +
    //   "uniform sampler2D textureSampler;\r\n" +
    //   "void main(void) {\r\n" +
    //   "    gl_FragColor = texture2D(textureSampler, vUV);\r\n" +
    //   "}\r\n";

    // const shaderMaterial = new BABYLON.ShaderMaterial(
    //   "shader",
    //   this.scene,
    //   {
    //     vertex: "custom",
    //     fragment: "custom",
    //   },
    //   {
    //     attributes: ["position", "normal", "uv"],
    //     uniforms: [
    //       "world",
    //       "worldView",
    //       "worldViewProjection",
    //       "view",
    //       "projection",
    //     ],
    //   }
    // );
    // const mainTexture = new BABYLON.Texture("material/wire.jpg", this.scene);
    // shaderMaterial.setTexture("textureSampler", mainTexture);
    // shaderMaterial.backFaceCulling = false;
    // this.box.material = shaderMaterial;
    //#endregion --------------------------------------------------------------------

    // // 设置模型可投射阴影
    // this.shadowGenerator = new BABYLON.ShadowGenerator(800, this.sunLight);
    // // this.shadowGenerator.addShadowCaster(this.box);
    // this.shadowGenerator.addShadowCaster(this.middleStation1);
    // this.shadowGenerator.addShadowCaster(this.middleStation2);
    // this.shadowGenerator.addShadowCaster(this.middleStation3);

    // ------------------------------------------------------------
    // // 渐变圆形生成
    // this.circlePlane1 = this.generateCirclePlane("circlePlane1", this.scene, {
    //   x: 0,
    //   y: 0.1,
    //   z: 1,
    // });

    // this.circlePlane2 = this.generateCirclePlane("circlePlane1", this.scene, {
    //   x: 0,
    //   y: 0.1,
    //   z: -1,
    // });

    // this.circlePlane3 = this.generateCirclePlane("circlePlane1", this.scene, {
    //   x: 1,
    //   y: 0.1,
    //   z: 0,
    // });

    // this.circlePlane4 = this.generateCirclePlane("circlePlane1", this.scene, {
    //   x: -1,
    //   y: 0.1,
    //   z: 0,
    // });

    // // 飞线生成
    // this.flowingLight1 = this.generateFlowingLightTube(
    //   this.scene,
    //   0.005,
    //   0.0065,
    //   new BABYLON.Vector3(0, 0.1, 1),
    //   new BABYLON.Vector3(0.5, 0.4, 0.5),
    //   new BABYLON.Vector3(1, 0.1, 0)
    // );
    // this.flowingLight2 = this.generateFlowingLightTube(
    //   this.scene,
    //   0.005,
    //   0.0065,
    //   new BABYLON.Vector3(-1, 0.1, 0),
    //   new BABYLON.Vector3(-0.5, 0.4, 0.5),
    //   new BABYLON.Vector3(0, 0.1, 1)
    // );
    // this.flowingLight3 = this.generateFlowingLightTube(
    //   this.scene,
    //   0.005,
    //   0.0065,
    //   new BABYLON.Vector3(0, 0.1, -1),
    //   new BABYLON.Vector3(-0.5, 0.4, -0.5),
    //   new BABYLON.Vector3(-1, 0.1, 0)
    // );
    // this.flowingLight4 = this.generateFlowingLightTube(
    //   this.scene,
    //   0.005,
    //   0.0065,
    //   new BABYLON.Vector3(1, 0.1, 0),
    //   new BABYLON.Vector3(0.5, 0.4, -0.5),
    //   new BABYLON.Vector3(0, 0.1, -1)
    // );

    // 注册鼠标移动事件监听器
    this.scene.onPointerMove = (evt, pickResult) => {
      // console.log(evt);
      this.onPointerMove(pickResult);
    };

    this.render();
  }

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

  // 异步加载飞机模型
  async loadModelAsync(fileName: string, events: EventEmitter) {
    const res = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      fileName,
      this.scene
    );

    console.log("加载飞机模型完成", res);
    console.log("加载飞机模型完成--飞机动画组", res.animationGroups);
    this.animations = res.animationGroups;

    // 获取导入的模型
    const flyMesh = res.meshes[0];

    flyMesh.scaling.set(2, 2, 2);

    // 设置模型可投射阴影
    this.shadowGenerator.addShadowCaster(flyMesh);

    // 触发事件，传递动画列表
    events.emit("modelLoaded", this.animations);

    // 监听鼠标点击或经过飞机模型事件
    res.meshes.forEach((mesh) => {
      mesh.actionManager = new BABYLON.ActionManager(this.scene);
      mesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnDoublePickTrigger,
          (evt) => {
            // 触发飞机点击事件
            // console.log("飞机被点击");
            // console.log(evt);
            const targetPosition = mesh.getAbsolutePosition();
            const targetSize = mesh.scaling.length() / 1.2;

            this.camera.setTarget(targetPosition);
            this.camera.radius = targetSize;
            this.camera.beta = Math.PI / 4;
          }
        )
      );
    });

    //   // 开启boungdingBox
    //   const boundingBox =
    //     BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(flyMesh);

    //   const utilLayer = new BABYLON.UtilityLayerRenderer(this.scene);
    //   utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
    //   const gizmo = new BABYLON.BoundingBoxGizmo(
    //     BABYLON.Color3.FromHexString("#00ffff"),
    //     utilLayer
    //   );
    //   gizmo.attachedMesh = boundingBox;

    //   const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
    //   boundingBox.addBehavior(sixDofDragBehavior);
    //   const multiPointerScaleBehavior = new BABYLON.MultiPointerScaleBehavior();
    //   boundingBox.addBehavior(multiPointerScaleBehavior);
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

  // 切换飞机动画的函数
  playAnimation(animationName: string) {
    if (this.animations) {
      const animation = this.animations.find(
        (anim) => anim.name === animationName
      );
      if (animation) {
        animation.play(true); // 开始播放动画
      }
    }
  }

  // 调整太阳光角度的函数
  setLightAngle(angle: number) {
    console.log("当前角度", angle);
    const radians = BABYLON.Tools.ToRadians(angle);
    const lightDirection = new BABYLON.Vector3(
      -Math.cos(radians),
      -Math.sin(radians),
      0
    );

    this.sunLight.direction = lightDirection;
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}

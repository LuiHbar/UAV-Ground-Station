<!--
 * @Author: urthan
 * @Date: 2024-03-06 10:09:53
 * @LastEditors: urthan
 * @LastEditTime: 2024-04-03 15:53:08
 * @FilePath: \client\src\views\3D-show.vue
 * @Description: 
 * 
-->
<template>
  <!-- <div class="photo_action_page"> -->
  <!-- <h3>三维显示</h3> -->
  <div class="container" ref="container"></div>
  <!-- </div> -->
</template>
<script >
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export default {
  data() {
    return {
      scene: "",
      light: "",
      camera: "",
      controls: "",
      renderer: "",
      plane: "",
    };
  },
  methods: {
    init() {
      //创建场景
      this.scene = new THREE.Scene();
      // 创建相机
      this.camera = new THREE.PerspectiveCamera(
        // 视野角度
        75,
        // 显示区域宽高比
        this.$refs.container.offsetWidth / this.$refs.container.offsetHeight,
        // 近端面
        0.1,
        // 远端面
        100
      );
      this.camera.position.set(10, 10, 15);
      this.camera.lookAt(0, 0, 0);
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(
        this.$refs.container.offsetWidth,
        this.$refs.container.offsetHeight
      );
      // 添加坐标系
      const axesHelper = new THREE.AxesHelper(15);
      this.scene.add(axesHelper);
      // 创建坐标系网格
      let size = 10,
        divisions = 10;
      let gridXY = new THREE.GridHelper(
        size,
        divisions
      );
      gridXY.rotation.x = Math.PI / 2;
      gridXY.position.set(size / 2, size / 2, 0);
      this.scene.add(gridXY);
      let gridYZ = new THREE.GridHelper(
        size,
        divisions
      );
      gridYZ.rotation.z = Math.PI / 2;
      gridYZ.position.set(0, size / 2, size / 2);
      this.scene.add(gridYZ);
      let gridXZ = new THREE.GridHelper(
        size,
        divisions
      );
      gridXZ.position.set(size / 2, 0, size / 2);
      this.scene.add(gridXZ);
      // 挂载到dom元素上
      this.$refs.container.appendChild(this.renderer.domElement);
      // 设置白色背景
      this.renderer.setClearColor(0xffffff);
      // 添加光源
      this.light = new THREE.AmbientLight(0xf0f0f0, 0.6);
      this.scene.add(this.light);
      // 添加轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.animate();
    },
    loadModel() {
      const mtlLoader = new MTLLoader();
      const objLoader = new OBJLoader();
      let scene = new THREE.Scene();
      mtlLoader.load("/models/drone.mtl", (materials) => {
        materials.preload();
        // 加载OBJ模型
        objLoader.setMaterials(materials);
        objLoader.load(
          "/models/drone.obj",
          (objModel) => {
            this.plane = objModel;
            scene.add(objModel);
            scene.scale.set(0.001, 0.001, 0.001);
            scene.position.set(5, 5, 6);
            this.scene.add(scene);
          },
          function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          function (error) {
            console.log("An error happened" + error);
          }
        );
      });
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
    getStatus(e) {
      let msg = JSON.parse(e.data);
      if (msg.code === 31) {
        let { ROL, PIT, YAW } = msg.data;
        this.plane.rotation.set(
          (PIT * Math.PI) / 180,
          -(YAW * Math.PI) / 180,
          (ROL * Math.PI) / 180
        );
      }
    },
  },
  mounted() {
    this.init();
    this.loadModel();
    window.addEventListener("resize", () => {
      // Update Camera
      this.camera.aspect =
        this.$refs.container.offsetWidth / this.$refs.container.offsetHeight;
      this.camera.updateProjectionMatrix();

      // Update Renderer
      this.renderer.setSize(
        this.$refs.container.offsetWidth,
        this.$refs.container.offsetHeight
      );
    });
    this.$ws.openMessageListen(this.getStatus);
  },
  beforeDestroy() {
    this.$ws.closeMessageListen(this.getStatus);
    window.removeEventListener("resize", () => {
      // Update Camera
      this.camera.aspect =
        this.$refs.container.offsetWidth / this.$refs.container.offsetHeight;
      this.camera.updateProjectionMatrix();
      // Update Renderer
      this.renderer.setSize(
        this.$refs.container.offsetWidth,
        this.$refs.container.offsetHeight
      );
    });
  },
};
</script>
<style scoped>
/* Set the container to fill the entire component */
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #d6eaff;
  overflow: hidden; /* Hide any overflow content */
  /* position: relative; Set position to relative */
}

/* Style to remove margin and padding from the container */

/* Optionally, you can set the body and HTML to have full height as well */

/* canvas {
  width: 100vw;
  height: 100vh;
} */
</style>

/*
 * @Author: urthan
 * @Date: 2024-03-06 09:59:35
 * @LastEditors: urthan
 * @LastEditTime: 2024-04-02 22:59:08
 * @FilePath: \client\src\router\index.js
 * @Description:
 *
 */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    //主路由
    path: "/",
    component: () => import("../views/MainPage.vue"),
    redirect: "/basic-transcevier",
    //子路由
    children: [
      {
        path: "basic-transcevier",
        component: () => import("../views/basic-transcevier.vue"),
      },

      {
        path: "data-waveform",
        component: () => import("../views/data-waveform.vue"),
      },
      {
        path: "show",
        component: () => import("../views/3D-show.vue"),
      },
      {
        path: "flight-control",
        component: () => import("../views/flight-control.vue"),
      },
      {
        path: "save-file",
        component: () => import("../views/save-data.vue"),
      },
    ],
  },
];
const router = new VueRouter({
  routes,
});

export default router;

<template>
  <div><input type="file" ref="demFile" /></div>
  <div>
    <canvas ref="webgl" id="webgl" width="600" height="600"> 请使用支持WebGL的浏览器 </canvas>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { initShaders } from '@/utils/lib/cuon-utils';
  import Terrain from '@/utils/terrain';
  import { readDemFile, initVertexBuffers } from '@/utils/terrain/utils';
  import { Matrix4 } from '@/utils/lib/cuon-matrix';
  import Cuboid from '@/utils/terrain/Cuboid';

  const demFile = ref<HTMLInputElement | null>(null);
  const webgl = ref<HTMLCanvasElement | null>(null);

  const currentAngle = [0.0, 0.0]; // 绕X轴Y轴的旋转角度 ([x-axis, y-axis])
  let curScale = 1.0; //当前的缩放比例

  // 顶点着色器程序
  const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' + //位置
    'attribute vec4 a_Color;\n' + //颜色
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' + // 设置顶点坐标
    '  v_Color = a_Color;\n' +
    '}\n';

  // 片元着色器程序
  const FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

  function onDraw(gl: IWebglRenderContext, canvas: any, terrain: Terrain) {
    const n = initVertexBuffers(gl, terrain);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }

    //绘制函数
    const tick = function () {
      //设置MVP矩阵
      setMVPMatrix(gl, canvas, <Cuboid>terrain.cuboid);

      //清空颜色和深度缓冲区
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      //绘制矩形体
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(tick);
    };

    tick();
  }

  function setMVPMatrix(gl: IWebglRenderContext, canvas: any, cuboid: Cuboid) {
    const u_MvpMatrix = gl.getUniformLocation(<WebGLProgram>gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
      console.log('Failed to get the storage location of u_MvpMatrix');
      return;
    }

    //模型矩阵
    const modelMatrix = new Matrix4();
    modelMatrix.scale(curScale, curScale, curScale);
    modelMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
    modelMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); // Rotation around y-axis
    modelMatrix.translate(-cuboid.CenterX(), -cuboid.CenterY(), -cuboid.CenterZ());

    //投影矩阵
    let fovy = 60;
    // let near = 1;
    let projMatrix = new Matrix4();
    projMatrix.setPerspective(fovy, canvas.width / canvas.height, 1, 10000);

    //计算lookAt()函数初始视点的高度
    let angle = ((fovy / 2) * Math.PI) / 180.0;
    let eyeHight = (cuboid.LengthY() * 1.2) / 2.0 / angle;

    //视图矩阵
    let viewMatrix = new Matrix4(); // View matrix
    viewMatrix.lookAt(0, 0, eyeHight, 0, 0, 0, 0, 1, 0);

    //MVP矩阵
    let mvpMatrix = new Matrix4();
    mvpMatrix.set(projMatrix)?.multiply(viewMatrix).multiply(modelMatrix);

    //将MVP矩阵传输到着色器的uniform变量u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  }

  function main() {
    if (!demFile) {
      console.log('Failed to get demFile element!');
      return;
    }

    // 加载文件后的事件
    demFile.value?.addEventListener('change', function (event) {
      // 判断浏览器是否支持FileReader接口
      if (typeof FileReader == 'undefined') {
        console.log('你的浏览器不支持FileReader接口！');
        return;
      }

      // 读取文件后的事件
      const reader = new FileReader();
      reader.onload = function () {
        if (reader.result) {
          const terrain = new Terrain();
          if (!readDemFile(reader.result as string, terrain)) {
            console.log('文件格式有误，不能读取该文件！');
          }

          //绘制函数
          onDraw(<IWebglRenderContext>gl, webgl.value, terrain);
        }
      };

      const input: any = event.target;
      reader.readAsText(input?.files[0]);
    });

    const gl = webgl.value?.getContext('webgl');
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }

    // 指定清空<canvas>的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  onMounted(() => {
    main();
  });
</script>

<style lang="scss" scoped></style>

<template>
  <div id="terrain-panel">
    <div id="file-selector"><input type="file" ref="demFile" /></div>
    <div id="webgl-container" ref="webglContainer">
      <canvas ref="webgl" id="webgl" width="600" height="600"> 请使用支持WebGL的浏览器 </canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { initShaders } from '@/utils/lib/cuon-utils';
  import Terrain from '@/utils/terrain';
  import { readDemFile, initVertexBuffers } from '@/utils/terrain/utils';
  import { Matrix4 } from '@/utils/lib/cuon-matrix';
  import Cuboid from '@/utils/terrain/Cuboid';
  import tex from '@/assets/images/tex.jpg';

  const demFile = ref<HTMLInputElement | null>(null);
  const webgl = ref<HTMLCanvasElement | null>(null);
  const webglContainer = ref<HTMLDivElement | null>(null);

  const currentAngle = [0.0, 0.0]; // 绕X轴Y轴的旋转角度 ([x-axis, y-axis])
  let curScale = 1.0; //当前的缩放比例
  let initTexSuccess = false;

  // 顶点着色器程序
  const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' + //位置
    'attribute vec4 a_Color;\n' + //颜色
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec4 v_position;\n' +
    'void main() {\n' +
    '  v_position = a_Position;\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' + // 设置顶点坐标
    '  v_Color = a_Color;\n' +
    '}\n';

  // 片元着色器程序
  const FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec2 u_RangeX;\n' + //X方向范围
    'uniform vec2 u_RangeY;\n' + //Y方向范围
    'uniform sampler2D u_Sampler;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec4 v_position;\n' +
    'void main() {\n' +
    '  vec2 v_TexCoord = vec2((v_position.x-u_RangeX[0]) / (u_RangeX[1]-u_RangeX[0]), 1.0-(v_position.y-u_RangeY[0]) / (u_RangeY[1]-u_RangeY[0]));\n' +
    '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '}\n';

  function initEventHandlers(canvas: any) {
    var dragging = false; // Dragging or not
    var lastX = -1,
      lastY = -1; // Last position of the mouse

    if (!canvas) return;
    //鼠标按下
    canvas.onmousedown = function (ev: any) {
      var x = ev.clientX;
      var y = ev.clientY;
      // Start dragging if a moue is in <canvas>
      var rect = ev.target.getBoundingClientRect();
      if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        lastX = x;
        lastY = y;
        dragging = true;
      }
    };

    //鼠标离开时
    canvas.onmouseleave = function () {
      dragging = false;
    };

    //鼠标释放
    canvas.onmouseup = function () {
      dragging = false;
    };

    //鼠标移动
    canvas.onmousemove = function (ev: any) {
      var x = ev.clientX;
      var y = ev.clientY;
      if (dragging) {
        var factor = 100 / canvas.height; // The rotation ratio
        var dx = factor * (x - lastX);
        var dy = factor * (y - lastY);
        currentAngle[0] = currentAngle[0] + dy;
        currentAngle[1] = currentAngle[1] + dx;
      }
      (lastX = x), (lastY = y);
    };

    //鼠标缩放
    canvas.onmousewheel = function (event) {
      if (event.wheelDelta > 0) {
        curScale = curScale * 1.1;
      } else {
        curScale = curScale * 0.9;
      }
    };
  }

  function loadTexture(gl: IWebglRenderContext, image: any) {
    // 创建纹理对象
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }

    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将0号单元纹理传递给着色器中的取样器变量
    if (!gl.program) return;
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler) {
      console.log('Failed to get the storage location of u_Sampler');
      return false;
    }
    gl.uniform1i(u_Sampler, 0);

    return true;
  }

  function initTextures(gl: IWebglRenderContext, terrain: Terrain) {
    if (!gl.program) return;
    // 传递X方向和Y方向上的范围到着色器
    var u_RangeX = gl.getUniformLocation(gl.program, 'u_RangeX');
    var u_RangeY = gl.getUniformLocation(gl.program, 'u_RangeY');
    if (!u_RangeX || !u_RangeY) {
      console.log('Failed to get the storage location of u_RangeX or u_RangeY');
      return;
    }
    if (!terrain.cuboid) return;
    gl.uniform2f(u_RangeX, terrain.cuboid.minX, terrain.cuboid.maxX);
    gl.uniform2f(u_RangeY, terrain.cuboid.minY, terrain.cuboid.maxY);
    //创建一个image对象
    var image = new Image();
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }
    //图像加载的响应函数
    image.onload = function () {
      if (loadTexture(gl, image)) {
        initTexSuccess = true;
      }
    };

    //浏览器开始加载图像
    image.src = tex;

    return true;
  }

  function onDraw(gl: IWebglRenderContext, canvas: any, terrain: Terrain) {
    const n = initVertexBuffers(gl, terrain);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }

    //设置纹理
    if (!initTextures(gl, terrain)) {
      console.log('Failed to intialize the texture.');
      return;
    }

    initEventHandlers(webgl.value);

    // setLight(gl);

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

  // function setLight(gl: IWebglRenderContext) {
  //   if (!gl.program) return;
  //   var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  //   var u_DiffuseLight = gl.getUniformLocation(gl.program, 'u_DiffuseLight');
  //   var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  //   if (!u_DiffuseLight || !u_LightDirection || !u_AmbientLight) {
  //     console.log('Failed to get the storage location');
  //     return;
  //   }

  //   //设置漫反射光
  //   gl.uniform3f(u_DiffuseLight, 1.0, 1.0, 1.0);

  //   // 设置光线方向(世界坐标系下的)
  //   var solarAltitude = 45.0;
  //   var solarAzimuth = 315.0;
  //   var fAltitude = (solarAltitude * Math.PI) / 180; //光源高度角
  //   var fAzimuth = (solarAzimuth * Math.PI) / 180; //光源方位角

  //   var arrayvectorX = Math.cos(fAltitude) * Math.cos(fAzimuth);
  //   var arrayvectorY = Math.cos(fAltitude) * Math.sin(fAzimuth);
  //   var arrayvectorZ = Math.sin(fAltitude);

  //   var lightDirection = new Vector3([arrayvectorX, arrayvectorY, arrayvectorZ]);
  //   lightDirection.normalize(); // Normalize
  //   gl.uniform3fv(u_LightDirection, lightDirection.elements);

  //   //设置环境光
  //   gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
  // }

  function main() {
    if (webgl.value && webglContainer.value) {
      webgl.value.width = webglContainer.value.clientWidth;
      webgl.value.height = webglContainer.value.clientHeight;
    }

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

    // 开启深度测试
    gl.enable(gl.DEPTH_TEST);

    //清空颜色和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  onMounted(() => {
    main();
    console.log('纹理加载成功：', initTexSuccess);
  });
</script>

<style src="./index.scss"></style>

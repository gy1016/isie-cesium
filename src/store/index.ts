import { createPinia, defineStore } from 'pinia';

// 1. 定义容器
// 参数1：容器的ID，必须唯一，将来Pinia会把所有的容器挂载到根容器
// 参数2：选项对象
// 返回值：一个函数，调用得到容器实例
export const useIsieStore = defineStore('isie', {
  /**
   * 类似于组件的data，用来存储全局状态的
   * 1. 必须是函数：为了在服务端渲染的时候避免交叉请求导致的数据状态污染
   * 2. 必须是箭头函数：这里是为了更好的TS类型推导
   * 3. 如果要解构容器中的数据，使用pinia中的storeToRefs(isieStore)
   * 4. 修改数据：
   *    (1) 直接修改： isieStore.count++
   *    (2) 修改多个数据建议用$patch批量更新 isieStore.$patch({count: isieStore.count+1})
   *    (3) $patch传入一个函数：isieStore.$patch(state => {state.count++})
   *    (4) 逻辑较多的时候可以使用actions
   */
  state: () => {
    return {
      count: 0,
    };
  },
  /**
   * 类似于组件的computed，用来封装计算属性，有缓存的功能
   */
  getters: {
    // 可以拿到实例的state
    count10(state) {
      return state.count + 10;
    },
    // 使用this拿到count
    count20(): number {
      return this.count + 10;
    },
  },
  /**
   * 类似于组建的methods，封装业务逻辑，修改state
   */
  actions: {
    // 注意：不能使用箭头函数定义action，因为箭头函数绑定外部this
    changeCount() {
      this.count++;
      // this.$patch({})
    },
  },
});

// 2. 使用容器中的 state

// 3. 修改 state

// 4. 容器中的action的使用

export default createPinia();

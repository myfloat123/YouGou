<template>
  <view>
    <view class="goods-item">
      <!-- 左侧的盒子 -->
      <view class="goods-item-left">
        <radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioChangeHandler"></radio>
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic" mode=""></image>
      </view>
      <!-- 右侧的盒子 -->
      <view class="goods-item-right">
        <!-- 商品的名字 -->
        <view class="goods-name">{{goods.goods_name}}</view>
        <view class="goods-info-box">
          <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
          <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    props: {
      goods: {
        type: Object,
        default: {}
      },
      showRadio: {
        type: Boolean,
        // 默认情况下，不会展示radio组件
        default: false
      },
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 默认的图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters: {
      // 定义保留商品价格两位小数的过滤器  ￥{{goods.goods_price | tofixed}}
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    methods: {
      // 这是radio组件的点击事件处理函数
      radioChangeHandler() {
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      // 监听到了NumberBox 组件数量变化的事件
      numChangeHandler(val) {
        // console.log(val);
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          goods_count: val - 0
        })
      }
    }
  }
</script>

<style lang="scss">
.goods-item {
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  
  .goods-item-left {
    margin-right: 5px;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  
  .goods-item-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
    }
    
    .goods-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-price {
        color: #c00000;
        font-size: 16px;
      }
    }
  }
}
</style>
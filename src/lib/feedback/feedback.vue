<template>
  <div id="feedback-wrap" v-if="ifFeedbackShow">
    <div @mouseenter="optionsVisible = true" @mouseleave="optionsVisible = false">
      <div class="feedback-icon">
        <img src="../../assets/image/home/helpIcon.png" class="helpicon" />
        <p>帮助 <b>·</b> 建议</p>
      </div>
      <ul class="option-list" v-show="optionsVisible">
        <li @click="toHelpCenter">
          <div class="icon-wrap">
            <jt-icon type="iconbangzhu"></jt-icon>
          </div>
          <div class="content">
            <p class="title">帮助中心</p>
            <p class="description">操作指南及常见问题QA</p>
          </div>
        </li>
        <li @click="modalVisible = true">
          <div class="icon-wrap">
            <jt-icon type="iconbianji"></jt-icon>
          </div>
          <div class="content">
            <p class="title">问题反馈</p>
            <p class="description">使用问题及意见建议反馈</p>
          </div>
        </li>
        <li>
          <div class="icon-wrap">
            <jt-icon type="iconyouxiang"></jt-icon>
          </div>
          <div class="content">
            <p class="title">联络邮箱</p>
            <p class="description">jiutiancontact@chinamobile.com</p>
          </div>
        </li>
      </ul>
    </div>
    <feedback-modal :visible="modalVisible" @cancel="modalVisible = false" @ok="handleConfirm"></feedback-modal>
  </div>
</template>

<script>
import FeedbackModal from './feedbackModal.vue';
import { checkLogin } from '../../utils/utils';

export default {
  name: 'feedback',
  components: {
    FeedbackModal,
  },
  data() {
    return {
      modalVisible: false,
      optionsVisible: false,
      ifH5Show: window.location.href.indexOf('/h5') === -1,
      ifFeedbackShow: null,
    };
  },
  mounted() {
    this.ifshow();
  },
  methods: {
    ifshow() {
      /**
       * 1.h5页面不显示
       * 2.未登录的状态不显示
       */
      if (this.checkLogin() && this.ifH5Show) {
        this.ifFeedbackShow = true;
      } else {
        this.ifFeedbackShow = false;
      }
    },
    checkLogin() {
      return checkLogin(!this.$route.meta.requiresLogin);
    },
    handleConfirm() {
      this.modalVisible = false;
    },
    toHelpCenter() {
      window.open('/helpcenter');
    },
  },
};
</script>

<style lang="less" scoped>
#feedback-wrap {
  z-index: 999;
  border-radius: 2px;
  position: fixed;
  right: 8px;
  bottom: 100px;
}
.feedback-icon {
  line-height: 18px;
  padding: 16px 16px 16px 16px;
  background: #fff;
  border-radius: 2px;
  cursor: pointer;
  text-align: center;
  color: #333;
  font-size: 16px;
  width: 48px;
  height: 120px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.15);
  margin-left: 12px;

  .helpicon {
    position: absolute;
    top: -61px;
    right: -9px;
  }

  b {
    font-weight: 600;
  }
  &:hover {
    color: #0082ff;
  }
}

#feedback-wrap:hover .feedback-icon {
  color: #0082ff;
}
.option-list {
  position: absolute;
  right: 60px;
  top: -99px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding-left: 0;

  li {
    display: flex;
    padding: 16px 12px;
    cursor: pointer;

    &:hover {
      background: #f8f9fa;
      color: #0082ff;
      p:nth-child(1) {
        color: #0082ff;
      }
    }
    &:last-child {
      cursor: auto;
    }

    .icon-wrap {
      display: block;
      font-size: 20px;
      padding: 0 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        margin-bottom: 4px;
      }
      .description {
        margin-bottom: 0;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
      }
    }
  }
}

/deep/ .anticon {
  vertical-align: 0.085em;
}
</style>

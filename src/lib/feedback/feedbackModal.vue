<template>
  <div>
    <a-modal :centered="true" :visible="visible" title="问题反馈" :confirm-loading="confirmLoading" :maskClosable="false" @ok="handleOk" @cancel="handleCancel" okText="确定" cancelText="取消" class="questionModal">
      <a-form-model :model="form" :rules="rules" ref="ruleForm" :label-col="{ span: 4 }">
        <p class="QA"><span @click="toHelpCenter">查阅常见问题QA</span></p>
        <a-form-model-item ref="category" prop="category" label="问题分类" :wrapper-col="{ span: 12 }">
          <a-select style="width: 240px" placeholder="请选择" v-model="form.category" :options="categoryOptions"></a-select>
        </a-form-model-item>
        <a-form-model-item ref="description" prop="description" label="问题描述" :wrapper-col="{ span: 20 }">
          <a-textarea v-model="form.description" class="textarea" placeholder="请详细描述您的问题，并提供您的用户名、问题页面网址等相关信息，以便我们定位和排查" :rows="6" />
          <p class="textareaLength">{{ form.description.length }}/1000</p>
        </a-form-model-item>
        <a-form-model-item label="上传附件" :wrapper-col="{ span: 20 }">
          <a-upload name="file" :multiple="true" :customRequest="customRequest" :accept="formData.acceptTypes" :fileList="showFiles" :beforeUpload="beforeUpload" @change="onChange" :remove="handleRemovevideo">
            <a-button> <a-icon type="upload" />上传附件 </a-button>
          </a-upload>
          <a-tooltip>
            <template slot="title">最多上传5个文件，每个文件不超过10MB，支持png,jpg,jpeg</template>
            <jt-icon class="icons" type="iconinfo-circle"></jt-icon>
          </a-tooltip>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ offset: 1, span: 23 }">
          <p class="tips">提示：请确保您已在个人中心完整填写手机号、邮箱等信息，以便我们联系到您</p>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { Modal, FormModel, Select, Input, Button, Upload, Tooltip } from 'ant-design-vue';
import { checkFileType } from '../../utils/utils';
import API from '../../constants/api/API';

export default {
  name: 'FeedbackModal',
  components: {
    AModal: Modal,
    AFormModel: FormModel,
    AFormModelItem: FormModel.Item,
    ASelect: Select,
    ATextarea: Input.TextArea,
    AButton: Button,
    AUpload: Upload,
    ATooltip: Tooltip,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        acceptTypes: '.png,.jpg,.jpeg',
      },
      confirmLoading: false,
      categoryOptions: [],
      form: {
        category: '',
        description: '',
        files: [],
      },
      showFiles: [],
      rules: {
        category: [
          {
            required: true,
            message: '请选择问题分类',
            trigger: 'change',
          },
        ],
        description: [
          {
            required: true,
            message: '请输入问题描述',
            trigger: 'blur',
          },
          { max: 1000, message: '1000 字以内', trigger: 'blur' },
        ],
      },
      forms: this.$form.createForm(this, { name: 'advanced_search' }),
    };
  },
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          this.createTicket(this.form);
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.$emit('cancel');
      this.$refs.ruleForm.resetFields();
    },

    // 删除上传列表
    handleRemovevideo(file) {
      const index = this.showFiles.indexOf(file);
      const newFileList = this.showFiles.slice();
      newFileList.splice(index, 1);
      this.showFiles = newFileList;
    },

    onChange(info) {
      const file = info.file;
      if (file.status === 'done') {
        if (file.response && file.response.state === 'OK') {
          this.$message.success(`文件上传成功`);
        }
      } else if (status === 'error') {
        this.$message.error(`文件上传失败`);
      }
    },
    beforeUpload(file) {
      let fileListLenght = this.showFiles.length;
      if (!checkFileType(this.formData.acceptTypes, file.name)) {
        this.$message.error('格式不支持');
        return false;
      }

      if (fileListLenght == 5) {
        this.$message.error(`最多上传5个文件`);
        return false;
      }

      let size = file.size / 1024;
      if (size > 10000) {
        this.$message.error(`上传文件超过10MB`);
        this.showFiles = this.showFiles.splice(this.showFiles - 1);
        return false;
      }

      this.showFiles.push(file);
    },
    // 上传文件
    customRequest(data) {
      const formData = new FormData();
      formData.append('file', data.file);
      API.feedback_model.uploadFileTicket(formData).then((res) => {
        this.form.files.push(res.body.url);
      });
    },
    // 查询工单分类接口
    getCategoryTicket() {
      API.feedback_model.categoryTicket().then((res) => {
        res.body.map((item) => {
          this.categoryOptions.push({
            value: item.category,
            label: item.category,
          });
        });
      });
    },
    // 工单创建接口
    createTicket(data) {
      API.feedback_model.createTicket(data).then((res) => {
        if (res.state === 'OK') {
          this.$emit('ok');
          this.confirmLoading = false;
          this.$message.success('问题反馈已成功提交');
          this.$refs.ruleForm.resetFields();
          this.showFiles = [];
        }
      });
    },
    toHelpCenter() {
      window.open('/helpcenter');
    },
  },
  mounted() {
    this.getCategoryTicket();
  },
  watch: {
    visible(val) {
      if (!val) return;
      this.form = {
        category: '',
        description: '',
        files: [],
      };
      this.showFiles = [];
    },
  },
};
</script>

<style lang="less" scoped>
.questionModal {
  .textarea {
    resize: none;
  }
  .textarea::-webkit-input-placeholder {
    font-size: 12px;
  }
  .textareaLength {
    text-align: end;
    height: 18px;
    font-size: 12px;
    font-weight: 400;
    color: #aaacb4;
    line-height: 18px;
    position: absolute;
    right: 0;
  }

  .QA {
    text-align: end;
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    color: #0082ff;
    line-height: 17px;
    span {
      cursor: pointer;
    }
  }
  .tips {
    height: 18px;
    font-size: 12px;
    font-weight: 400;
    color: #ff8900;
    line-height: 18px;
  }
  .icons {
    color: #b6b9c2;
    font-size: 18px;
    margin-left: 11px;
    position: absolute;
    left: 109px;
    top: 0;
  }
}

/deep/ .ant-modal {
  width: 640px !important;
  height: 504px;
}
/deep/ .formItemUpload {
  display: flex;
  align-items: center;
}
/deep/ .ant-modal-body {
  padding: 24px 40px;
}
</style>

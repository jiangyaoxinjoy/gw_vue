<template>
  <Modal v-model="modal" title="设置阀值" @on-visible-change="changeModalState">
    <Form
      ref="form"
      :model="form"
      :label-width="70"
      :rules="ruleForm"
    >
      <FormItem label="开水阈值" prop="threshold">
        <Input type="text" v-model="form.threshold" placeholder="输入开水阈值..." number></Input>
      </FormItem>      
    </Form>
    <div slot="footer">
      <Button @click="closeModal(false)">取消</Button>
      <Button type="primary" style="margin-left: 8px" :disabled="ifDisabled" @click="handleSubmit('form')">修改</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'ValueModal',
  props: {
    valueModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateValue = (rule, value, callback) => {
      if ( _.isNumber(value) && value > 0) {
        this.ifDisabled = false
        callback();
      } else {
        this.ifDisabled = true
        callback();
        // callback(new Error('请输入正确阀值'));
      }
    };
    return {
      modal: false,
      form: {
        threshold: ''
      },
      ruleForm: {
        threshold: [
          { validator: validateValue, trigger: 'change' }
        ]
      },
      ifDisabled: true
    }
  },
  watch: {
    valueModal(val) {
      this.modal = val
    }
  },
  methods: {
    closeModal(val) {
      this.form.threshold = ''
      this.$emit('closeModal', false)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // this.$Message.info('success!')
          this.$emit("getValue", this.form.threshold)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    changeModalState (val) {
      if (!val) {
        this.closeModal(val)
      }
    }
  }
}
</script>
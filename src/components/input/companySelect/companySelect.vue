<template>
  <Select v-model="companyId" :style="{width: width+'px',height:'32px'}" @on-change="changeCom" :disabled="companyList.length == 1 ? true : false" >
    <Option :value="0" v-if="companyList.length != 1">全部</Option>
    <Option
      v-for="item in companyList"
      :value="item.Id"
      :key="item.Id"
    >{{ item.name }}</Option>
  </Select>
</template>
<script>
export default {
  name: 'Companyselect',
  props: {
    companyList: Array,
    selectCompany: Number,
    width: {
      default: 200,
      type: Number
    }
  },
  computed: {
    companyId: {
      get () {
        return this.selectCompany
      },
      set () {}
    }
  },
  methods: {
    changeCom (val) {
      this.$emit('changeComId', val)
    }
  }
}
</script>

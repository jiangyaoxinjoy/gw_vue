<template>
  <div class="gw-split">
    <Split v-model="split">
      <div slot="left" class="demo-split-pane">
        <index-table />
      </div>
      <div slot="right" class="split-pane">
        <Map/>
      </div>
    </Split>
  </div>
</template>

<script>
import IndexTable from '@/view/alarm_monitor/components/table/index'
import Map from '@/view/alarm_monitor/components/newMap.vue'
export default {
  name: 'home',
  components: {
    Map,
    IndexTable
  },
  data () {
    return {
      split: 0.4
    }
  },
}
</script>

<style lang="less">
.gw-split{
    height: calc(100vh); ;
    border: 1px solid #dcdee2;
}
</style>

<template>
  <div>
    <Row class="expand-row">
     <!--  <Col span="8">
        <span class="expand-key">设备号: </span>
        <span class="expand-value">{{ row.aid }}</span>
      </Col> -->
      <Col span="16">
        <span class="expand-key">地址: </span>
        <span class="expand-value">{{ row.address }}</span>
      </Col>
      <!-- <Col span="8">
        <span class="expand-key">Birthday: </span>
        <span class="expand-value">{{ row.birthday }}</span>
      </Col> -->
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
}
</script>

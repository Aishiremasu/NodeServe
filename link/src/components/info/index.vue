<template>
  <div id="content">
    <el-table :data="tableData" style="width: 100%" :cell-style="insertStyle">
      <el-table-column prop="title" label="题目" width="180"></el-table-column>
      <el-table-column prop="author" label="作者" width="180"></el-table-column>
      <el-table-column prop="article" label="内容" width="500" height="200"></el-table-column>
      <el-table-column prop="imgUrl" label="图片" width="500"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.$axios
      .get("https://www.easy-mock.com/mock/5bcfcb722e971b3cf0a809d5/douban", {})
      .then(res => {
        this.tableData = res.data.data.indexInfo;
        // console.log(res.data.data.indexInfo)
      });
  },
  methods: {
    insertStyle({ row, column, rowIndex, columnIndex }) {
      if ((rowIndex + columnIndex) % 2 == 0) {
        if (columnIndex === 2) {
          return "overflow:hidden;text-overflow:ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;background:yellowgreen";
        }
        return "background:yellowgreen";
      } else {
        if (columnIndex === 2) {
          return "overflow:hidden;text-overflow:ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;background:yellow";
        }
        return "background:yellow";
      }
    }
  }
};
</script>
<style scoped>
#content {
  width: 1360px;
  margin: 0 auto;
}
</style>

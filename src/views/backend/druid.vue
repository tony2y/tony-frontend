<template>
  <div class="app-container" />
</template>

<script>
import { druid } from '@/api/article' // 引入方法

export default {
  data() {
    return {

    }
  },
  created() {
    this.$router.push({ path: 'http://localhost:8081/druid/index.html' })
  },
  methods: {
    loadTrees() {
      this.listLoading = true
      // 如果是顶级的父节点
      // 查找顶级对象
      druid().then(res => {
        this.datas = res.data
      })
    }
  }
}
</script>

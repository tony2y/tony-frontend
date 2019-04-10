<template>
  <div class="app-container" />
</template>

<script>
import { swagger } from '@/api/article' // 引入方法

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
      swagger().then(res => {
        this.datas = res.data
      })
    }
  }
}
</script>

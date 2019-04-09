<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>CPU</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
       <!-- <div class="text item">核心数</div>
      <div class="text item">{{cpu.cpuNum}}</div> -->
        <el-table :data="cpuList" style="width: 100%">
          <el-table-column  prop="name"  label="属性" width="180"></el-table-column>
          <el-table-column  prop="value" label="值"  width="180"></el-table-column>
        </el-table>
    </el-card>

  </div>
</template>

<script>
import { serverList } from '@/api/article'  // 引入方法
export default {
  data() {
    return {
      cpu:null,
      jvm:null,
      mem:null,
      sys:null,
      sysFiles:null,
      cpuList: [{
          name: '核心数',
          value: "cpu.cpuNum"
      },{
          name: '用户使用率',
          value: "cpu.used"
      },{
          name: '系统使用率',
          value: "cpu.sys"
      },{
          name: '当前空闲率',
          value: "cpu.free"
      }]
    }
  },
  created(){
   this.loadServer()
  },
  methods: {
    loadServer(){
        this.listLoading = true
          serverList().then(res => {
            if (res.data.status === 200) {
               var server = res.data.data
                console.log(res.data.data.cpu)
                this.cpu = server.cpu
                this.jvm = server.jvm
                this.mem = server.mem
                this.sys = server.sys
                this.sysFiles = server.sysFiles
            }else{

            }
          })
      },
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>

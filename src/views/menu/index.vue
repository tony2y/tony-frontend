<template>
  <div class="app-container">

    <div style="margin-bottom:20px;">

      <div class="option-item">
        <el-tag>展开/折叠</el-tag>
        <el-switch
          v-model="defaultExpandAll"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="reset"
        />
      </div>

      <div class="option-item">
        <el-tag>复选框</el-tag>
        <el-switch
          v-model="showCheckbox"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </div>

    </div>

    <tree-table 
    :key="key" 
    :default-expand-all="defaultExpandAll" 
    :data="datas"
    :columns="columns"
    :props="defaultProps"
    border
    highlight-current
    >
      <template slot="menuType" slot-scope="{scope}">
        <el-tag class="el-tag--info" v-if="scope.row._level === 0 ">目录</el-tag>
        <el-tag class="el-tag--success" v-if="scope.row._level === 1 ">菜单</el-tag>
        <el-tag class="el-tag--warning" v-if="scope.row._level === 2 ">按钮</el-tag>
      </template>
       <template slot="status" slot-scope="{scope}">
        <el-tag class="el-tag--primary" v-if="scope.row.status === 1 " >显示</el-tag>
        <el-tag class="el-tag--danger" v-if="scope.row.status === 2 " >隐藏</el-tag>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button type="primary" size="" @click="click(scope)">Click</el-button>
      </template>
    </tree-table>

  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import { menuList } from '@/api/article'  // 引入方法

export default {
  name: 'TreeTableDemo',
  components: { treeTable },
  data() {
    return {
      defaultExpandAll: true,
      showCheckbox: true,
      defaultProps: {
        children: 'children',
      },
      key: 1,
      
      columns: [
        // {
        //   label: '',
        //   width:80,
        //   redio: true
        // },
        {
          label: '菜单名称',
          key: 'permName',
          expand: true,
        },
        {
          label: '路径',
          key: 'url'
        },
        {
          label: '排序',
          key: 'orderNum'
        },
        {
          label: '类型',
          key: 'menuType'
        },
        {
          label: '状态',
          key: 'status'
        },
        {
          label: '权限标识',
          key: 'perms'
        },
        {
          label: '操作',
          key: 'operation'
        }
      ],
     datas: null,
    }
  },
  watch: {
    showCheckbox(val) {
      if (val) {
        this.columns.unshift({
          label: 'Checkbox',
          checkbox: true
        })
      } else {
        this.columns.shift()
      }
      this.reset()
    }
  },
  created(){
   this.loadTrees()
  },
  methods: {
    loadTrees(){
        this.listLoading = true
        // 如果是顶级的父节点
           // 查找顶级对象
          menuList(null).then(res => {
            console.log(res.data)
            this.datas = res.data
          })
      },
    reset() {
      ++this.key
    },
    click(scope) {
      console.log(scope)

      const row = scope.row
      const message = Object.keys(row)
        .map(i => {
          return `<p>${i}: ${row[i]}</p>`
        })
        .join('')

      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: message,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.option-item{
  display: inline-block;
  margin-right: 15px;
}
</style>

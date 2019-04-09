<template>

  <div class="app-container">
    <el-row>
      <el-col :span="3">
        公司列表
          <el-tree 
           :data="depts"
           :props="deptProps"
           v-loading="deptLoading"
           element-loading-text="加载中"
           @node-click="handleNodeClick"
           highlight-current
           default-expand-all
           >
        <span class="slot-t-node" slot-scope="{ node, data}">
          <i :class="{ 'iconfont icon-wenjian4': !node.expanded, 'iconfont icon-wenjianjia_f':node.expanded}"/>
          <span>{{ node.label }}</span>
        </span>
          </el-tree>
      </el-col>
      <el-col :span="20">
        <el-col :span="1"><div style="background: #99a9bf;"></div></el-col>
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="选择权限" @click.native="loadRoles"  />
      <el-input v-model="listQuery.userName" placeholder="账号" style="width: 200px;" class="filter-item"  />
      <el-input v-model="listQuery.phone" placeholder="手机号码" style="width: 200px;" class="filter-item" />
      <!-- <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select> -->
      <el-select v-model="listQuery.status" style="width: 140px" class="filter-item" >
        <el-option v-for="item in statusList" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-date-picker
        class="filter-item" 
        v-model="listQuery.created"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox> -->
    </div>

    <!-- 表格 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border  fit   highlight-current-row  style="width: 100%;" 
     element-loading-text="加载中"
     @selection-change="handleSelectionChange"
     >
    <!-- 数据栏 -->
      <el-table-column type="selection"  width="55"> </el-table-column>
      <el-table-column label="编号" prop="userId"  align="center" ></el-table-column>
      <el-table-column label="登录账号" prop="userName" align="center"></el-table-column>
      <el-table-column label="手机" prop="phone" ></el-table-column>
      <el-table-column label="创建时间" prop="created"  align="center"></el-table-column>
      <el-table-column label="状态"
       :filters="[{ text: '正常', value: '正常' }, { text: '禁用', value: '禁用' }]"
       :filter-method="filterTag"
       class-name="status-col" >
       <template slot-scope="scope">
        <!-- <template slot-scope="scope">
             <el-tag v-if="scope.row.status === 0" :type="scope.row.status  | statusFilter">正常</el-tag>
             <el-tag v-if="scope.row.status === 1" :type="scope.row.status  | statusFilter">禁用</el-tag>
        </template> -->
          <el-switch v-model="scope.row.status" 
           :active-value = "0"
           active-color="#13ce66" 
           :inactive-value = "1"
           inactive-color="#ff4949"
           @change="changeStatus(scope.row.userId,$event)"
           >
           </el-switch>
       </template>
      </el-table-column>
    <!-- 操作按钮栏 -->
     <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
       <template slot-scope="scope">
         <el-button type="primary" size="mini" @click="handleUpdate(scope.row.userId)">改密</el-button>
         <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row.userId)">删除</el-button>
       </template>
     </el-table-column>
    </el-table>
  <!-- 分页 -->
   <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
         </el-col>
</el-row>
    <!-- 点击显示修改密码弹出框 -->
   <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
     <el-form ref="dataForm" :rules="rules" :model="user" label-position="left" label-width="70px" style="width: 300px; margin-left:50px;">

      <el-form-item label="用户编号" prop="id">
         <el-input v-model="user.id"  disabled />
       </el-form-item>

       <el-form-item label="原密码" prop="oldPwd">
         <el-input type="password" v-model="user.oldPwd" placeholder="请输入原密码" show-password />
       </el-form-item>

        <el-form-item label="新密码" prop="newPwd">
         <el-input v-model="user.newPwd" placeholder="请输入新密码" show-password  />
       </el-form-item>

     </el-form>
     <!-- 确认取消按钮 -->
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormVisible = false">取消</el-button>
       <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button> -->
        <el-button type="primary" @click="updateData()">确认</el-button>
     </div>
   </el-dialog>


       <!-- 点击显示新增用户弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormAddVisible" width="30%">
     <el-form ref="dataFormAdd" :rules="rules" :model="adds" label-position="left" label-width="70px" style="width: 300px; margin-left:50px;">

      <el-form-item label="用户名" prop="userName">
         <el-input v-model="adds.userName" placeholder="请输入用户名" clearable/>
       </el-form-item>

       <el-form-item label="密码" prop="password">
         <el-input v-model="adds.password" placeholder="请输入密码" clearable />
       </el-form-item>

        <el-form-item label="手机" prop="phone">
         <el-input v-model="adds.phone" placeholder="请输入手机号" clearable />
       </el-form-item>

     </el-form>

   
     <!-- 确认取消按钮 -->
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormAddVisible = false">取消</el-button>
       <el-button type="primary" @click="createData()">确认</el-button>
     </div>
   </el-dialog>


          <!-- 点击显示权限列表弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogRoleVisible" width="30%">
     <!-- <el-form  :model="roles" label-position="left" label-width="70px" style="width: 300px; margin-left:50px;"> -->
       <el-input
          style="width: 200px;"
          placeholder="输入关键字查找"
          v-model="filterText">
      </el-input>
      <el-col>
        <!-- 权限列表 -->
          <el-tree 
           class="filter-tree"
           :data="roles"
           :props="rolesProps"
           ref="role"
           v-loading="roleLoading"
           element-loading-text="加载中"
           :filter-node-method="filterNode"
           @node-click="handleRoleNodeClick"
           highlight-current
           default-expand-all
           show-checkbox
           >
        <span class="slot-t-node" slot-scope="{ node, data}">
          <i :class="{ 'iconfont icon-wenjian4': !node.expanded, 'iconfont icon-wenjianjia_f':node.expanded}"/>
          <span>{{ node.label }}</span>  
        </span>
          </el-tree>
      </el-col>
     <!-- </el-form> -->

   
     <!-- 确认取消按钮 -->
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogRoleVisible = false">取消</el-button>
       <el-button type="primary" @click="selectRoles()">确认</el-button>
     </div>
   </el-dialog>
  </div>

</template>

<script>
  import { userList,menuList,deptList, removeUser, createUser, updatePass,updateStatus } from '@/api/article'  // 引入方法
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  //  import { successMsg,errorMsg } from '@/utils/util'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: 'success',
          1: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        filterText: '',
        depts:null,
        roles:null,
       deptProps: {
          id:'id',
          children: 'children',
          label: 'deptName'
        },
        rolesProps: {
          id:'id',
          children: 'children',
          label: 'permName'
        },
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,  // 表格加载
        roleLoading: true,  // 权限加载
        deptLoading: true,  // 部门加载
        listQuery: {
          page: 1,
          limit: 10,
          userName: null,
          phone: null,
          created: null,
          status:null
        },
        adds:{
          userName:null,
          password:null,
          phone:null,
        },
        user:{
          id:null,
          newPwd:null,
          oldPwd:null
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        statusList: [{ label: '正常', key: 0 }, { label: '禁用', key: 1 }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        // temp: {
        //   id: undefined,
        //   importance: 1,
        //   remark: '',
        //   timestamp: new Date(),
        //   title: '',
        //   type: '',
        //   status: 'published'
        // },
        dialogFormVisible: false,     // 弹出框(修改密码)
        dialogFormAddVisible:false,  // 弹出框(新增)
        dialogRoleVisible:false,     // 权限列表
        dialogStatus: '',
        textMap: {
          update: '修改密码',
          create: '新增用户',
          roles:  '选择权限'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
          phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
          oldPwd: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
          newPwd: [{ required: true, message: '新密码不能为空', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    watch: {
      filterText(val) {
        this.$refs.role.filter(val);
      }
    },
    created() {
      this.getList()
      this.loadDepts()
    },
    methods: {
      getList() {  // 表格内容
        this.listLoading = true
        userList(this.listQuery).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleNodeClick(data) {  // 选择部门树节点
        console.log(data);
      },
      handleRoleNodeClick(data) {  // 选择权限树节点
        this.$message.success(data.id+"");
      },
      selectRoles(){   // 选择的权限集合
        this.dialogRoleVisible = false
        console.log(this.$refs.role.getCheckedNodes())
        // this.$message.success(this.$refs.role.getCheckedNodes());
      },
      filterNode(value, data) {  // 根据关键字过滤树权限列表
        if (!value) return true;
        return data.permName.indexOf(value) !== -1;
      },
      loadDepts(){      //  加载部门列表
        this.deptLoading = true
        // 如果是顶级的父节点
          deptList(null).then(res => {
            // if (res.data.data.status === 200) {
              this.depts = res.data
            // }

        setTimeout(() => {
          this.deptLoading = false
        }, 1.5 * 1000)
          })
      },
      loadRoles(){     // 加载权限树列表
          this.roleLoading = true
             // this.resetTemp()
        this.dialogStatus = 'roles'
        this.dialogRoleVisible = true
          menuList(null).then(res => {
            this.roles = res.data
            
          setTimeout(() => {
          this.roleLoading = false
        }, 1.5 * 1000)
          })
      },
      changeStatus(id,status) { // 改变用户状态
        this.$confirm('确认要更改用户状态?', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          var data = {id:id,status:status}
          updateStatus(data).then(res => {
          if(res.data.status === 200){
          this.$message.success(res.data.msg);
          this.getList()
          }else{
          this.$message.error(res.data.msg); 
          }
          }) 
        });
      },
      handleSelectionChange(val) {  // 表格复选框
        this.multipleSelection = val;
      },
      handleFilter() {  // 搜索按钮
        // this.listQuery.page = 1
        this.getList()
      },
      filterTag(value, row) {
        return row.status === value;
      },
      handleModifyStatus(id) {  // 删除按钮
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeUser(id).then(res => {
          if(res.data.status === 200){
               this.$message.success(res.data.msg);
               this.getList()  // 删除成功返回列表
              }else{
                this.$message.error(res.data.msg); 
              }
        })
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });          
        });
      },
      // sortChange(data) {  // 编号排序
      //   const { prop, order } = data
      //   if (prop === 'userId') {
      //     this.sortByID(order)
      //   }
      // },
      // sortByID(order) {  // 编号排序
      // console.log(order)
      //   if (order === 'ascending') {
      //     this.listQuery.sort = '+userId'
      //   } else {
      //     this.listQuery.sort = '-userId'
      //   }
      //   this.handleFilter()
      // },
      handleCreate() {  // 新增用户按钮
        // this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormAddVisible = true
        this.$nextTick(() => {
          this.$refs['dataFormAdd'].clearValidate()
        })
      },
      createData() {    // 表单提交新增的信息按钮
        this.$refs['dataFormAdd'].validate((valid) => {
          if (valid) {
            // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            // this.temp.author = 'vue-element-admin'
            createUser(this.adds).then(res => {
              if(res.data.status === 200){
                this.list.unshift(this.adds)
                this.dialogFormAddVisible = false
                // successMsg(this, res.data.msg)
                this.$message.success(res.data.msg);
                this.getList();
              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        })
      },
      handleUpdate(tem) {  // 表格编辑按钮
        // this.temp = Object.assign({}, row) // copy obj
        // this.temp.timestamp = new Date(this.temp.timestamp)
        this.user.id = tem
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {   // 表单提交修改的信息按钮
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const data = Object.assign({}, this.user)
            updatePass(data).then(res => {
              if(res.data.status === 200){

              this.dialogFormVisible = false
              this.$message.success(res.data.msg);

              }else{
                this.$message.error(res.data.msg); 
              }
            })
          }
        })
      },
      // handleDelete(row) {
      //   this.$notify({
      //     title: '成功',
      //     message: '删除成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   const index = this.list.indexOf(row)
      //   this.list.splice(index, 1)
      // },
      // handleFetchPv(pv) {
      //   fetchPv(pv).then(response => {
      //     this.pvData = response.data.pvData
      //     this.dialogPvVisible = true
      //   })
      // },
      handleDownload() {  // 导出excel按钮
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['userId', 'userName', 'phone', 'created', 'status']
          const filterVal = ['userId', 'userName', 'phone', 'created', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {  // 格式化导出excel数据
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>



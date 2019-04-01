/**
 * 自定义方法
 */

export function successMsg(tis, option) { // 成功提示
  tis.$message({
    title: '成功',
    message: option,
    type: 'success',
    duration: 2000
  })
}

export function errorMsg(tis, option) { // 失败提示
  tis.$message({
    title: '错误',
    message: option,
    type: 'error',
    duration: 2000
  })
}

export function warningMsg(tis, option) { // 警告提示
  tis.$message({
    title: '警告',
    message: option,
    type: 'warning',
    duration: 2000
  })
}

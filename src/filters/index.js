
export const formatUserStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'success'
    case 1:
      return 'danger'
    case 2:
      return 'warning'
    case 3:
      return 'warning'
  }
  return 'danger'
}

export const formatUserStatus = (status) => {
  switch (status) {
    case 0:
      return '正常'
    case 1:
      return '已封禁'
    case 2:
      return '用户待完善信息'
    case 3:
      return '用户待完善信息'
  }
  return '异常'
}

export const formatPostColor = (status) => {
  switch (status) {
    case 0:
      return 'success'
    case 1:
      return 'warning'
    case 2:
      return 'danger'
  }
  return 'danger'
}

export const formatPostStatus = (status) => {
  switch (status) {
    case 0:
      return '通过审核'
    case 1:
      return '未审核'
    case 2:
      return '未通过审核'
  }
  return '帖子异常'
}

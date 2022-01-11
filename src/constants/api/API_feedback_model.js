import { GET, POST } from '@/utils/axios-default';

// 问题反馈模块
export default {
  //工单创建
  createTicket: (data) => POST('ticket/web/create', data),
  //查询工单分类
  categoryTicket: (data) => GET('ticket/web/category', data),
  //上传文件
  uploadFileTicket: (data) => POST('object/web/storage/image/upload', data),
};

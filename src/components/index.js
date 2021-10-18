
 import PageTools from './PageTools'
 import UploadExcel from './UploadExcel'
 import UploadImg from './UploadImg'
 import ImageHolder from './ImageHolder'
 export default {
   install(Vue) {
     Vue.component('PageTools', PageTools)
     // 注册导入excel组件
     Vue.component('UploadExcel', UploadExcel)
     // 挂载为全局组件
     Vue.component('UploadImg', UploadImg)
     // 将图片组件挂载为全局组件
     Vue.component('ImageHolder', ImageHolder)  
   }
 }
 
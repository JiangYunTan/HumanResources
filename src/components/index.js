
 import PageTools from './PageTools'
 import UploadExcel from './UploadExcel'
 import UploadImg from './UploadImg'
 import ImageHolder from './ImageHolder'
 import Lang from './Lang'
 import ScreenFull from './ScreenFull'
 export default {
   install(Vue) {
     Vue.component('PageTools', PageTools)
     // 注册导入excel组件
     Vue.component('UploadExcel', UploadExcel)
     // 挂载为全局组件
     Vue.component('UploadImg', UploadImg)
     // 将图片组件挂载为全局组件
     Vue.component('ImageHolder', ImageHolder)  
     // 将多语言组件挂载为全局组件
     Vue.component('Lang', Lang)
     // 将全屏组件挂载为全局组件
     Vue.component('ScreenFull', ScreenFull)
   }
 }
 
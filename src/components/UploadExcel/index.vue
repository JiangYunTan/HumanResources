<template>
  <div>
    <!-- 绘制隐藏域，就是实现文件的上传 -->
    <!-- 当选择文件以后，会触发 change 事件 -->
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <!-- 拖拽和上传按钮 -->
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop excel file here or
      <!-- 点击按钮，触发 click，在回调函数中，需要将隐藏域展示  -->
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        Browse
      </el-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  // 子组件定义 props 传递的属性
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // 将解析好的表头和具体的内容传递给父组件
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      // 获取到隐藏域，模拟用户的点击操作，这时候会弹出选择文件的弹框
      this.$refs['excel-upload-input'].click()
    },
    // 选择文件以后，触发的方法
    handleClick(e) {
      // 获取上传的文件对象
      const files = e.target.files
      // 获取到上传的具体文件
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      // 在读取到文件以后，开始交给 upload 方法
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      // 查看组件使用有没有传递 beforeUpload 方法
      if (!this.beforeUpload) {
        // 将上传的文件传递给 readerData 方法，进行解析
        this.readerData(rawFile)
        return
      }

      // 将上传的文件传递给 beforeUpload
      // 传递给组件使用以后，组件使用者开始验证，文件类型、文件的大小是否符合要求
      const before = this.beforeUpload(rawFile)
      if (before) {
        // 将上传的文件传递给 readerData 方法，进行解析
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        // 实例化读取文件的 FileReader 对象
        const reader = new FileReader()

        // 当读取完文件以后，执行 onload
        reader.onload = e => {
          // 读取的全部文件的内容
          const data = e.target.result
          // 使用 XLSX 插件读取上传的数据，开始进行解析
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          // header 是表头
          // results 具体的内容
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
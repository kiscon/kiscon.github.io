<template>
  <div class="storage-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><Upload /></el-icon>
          <span>稻谷入仓</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-divider content-position="left">基础信息</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购订单编号" prop="purchaseOrder">
              <el-select
                v-model="form.purchaseOrder"
                placeholder="请选择采购订单编号"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in purchaseOrders"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入仓日期" prop="storageDate">
              <el-date-picker
                v-model="form.storageDate"
                type="date"
                placeholder="选择入仓日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">原粮仓录入</el-divider>

        <el-row :gutter="20">
          <el-col :span="12" v-for="i in 6" :key="i">
            <el-form-item :label="`${i}号原粮仓`" :prop="`warehouse${i}`">
              <el-input
                v-model.number="form[`warehouse${i}`]"
                placeholder="请输入重量"
                type="number"
                :min="0"
                :precision="2"
              >
                <template #append>kg</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">其他信息</el-divider>

        <el-form-item label="检验报告" prop="inspectionReport">
          <el-upload
            v-model:file-list="form.inspectionReport"
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="3"
            :on-exceed="handleExceed"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              上传检验报告
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持 PDF、Word、图片格式，文件大小不超过 10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            <el-icon><Check /></el-icon>
            提交入仓
          </el-button>
          <el-button @click="resetForm">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="history-card" v-if="storageHistory.length > 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><List /></el-icon>
          <span>入仓记录</span>
        </div>
      </template>

      <el-table :data="storageHistory" border stripe>
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="purchaseOrder" label="采购订单号" width="150" />
        <el-table-column label="原粮仓重量" min-width="400">
          <template #default="{ row }">
            <span v-for="i in 6" :key="i">
              {{ i }}号仓: {{ row[`warehouse${i}`] || 0 }}吨
              <span v-if="i < 6"> | </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="storageDate" label="入仓日期" width="120" />
        <el-table-column prop="totalWeight" label="总重量" width="100">
          <template #default="{ row }"> {{ calculateTotal(row) }}吨 </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="danger" link size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  ElMessage,
  FormInstance,
  FormRules,
  UploadFile,
  UploadProps
} from 'element-plus'
import { Upload, Check, RefreshLeft, List } from '@element-plus/icons-vue'

interface StorageForm {
  warehouse1: number | null
  warehouse2: number | null
  warehouse3: number | null
  warehouse4: number | null
  warehouse5: number | null
  warehouse6: number | null
  purchaseOrder: string
  inspectionReport: UploadFile[]
  storageDate: string
  remark: string
  [key: string]: number | null | string | UploadFile[]
}

interface StorageRecord {
  id: number
  warehouse1: number
  warehouse2: number
  warehouse3: number
  warehouse4: number
  warehouse5: number
  warehouse6: number
  purchaseOrder: string
  storageDate: string
  remark: string
}

const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive<StorageForm>({
  warehouse1: null,
  warehouse2: null,
  warehouse3: null,
  warehouse4: null,
  warehouse5: null,
  warehouse6: null,
  purchaseOrder: '',
  inspectionReport: [],
  storageDate: '',
  remark: ''
})

const rules: FormRules = {
  purchaseOrder: [
    { required: true, message: '请选择采购订单号', trigger: 'change' }
  ],
  storageDate: [
    { required: true, message: '请选择入仓日期', trigger: 'change' }
  ]
}

const purchaseOrders = ref([
  { value: 'PO202401001', label: 'PO202401001 - 江苏稻谷采购' },
  { value: 'PO202401002', label: 'PO202401002 - 安徽稻谷采购' },
  { value: 'PO202401003', label: 'PO202401003 - 湖北稻谷采购' },
  { value: 'PO202401004', label: 'PO202401004 - 湖南稻谷采购' },
  { value: 'PO202401005', label: 'PO202401005 - 江西稻谷采购' }
])

const storageHistory = ref<StorageRecord[]>([
  {
    id: 1,
    warehouse1: 50,
    warehouse2: 45,
    warehouse3: 0,
    warehouse4: 0,
    warehouse5: 0,
    warehouse6: 0,
    purchaseOrder: 'PO202401001',
    storageDate: '2024-01-15',
    remark: '第一批次入仓'
  }
])

const handleFileChange: UploadProps['onChange'] = (uploadFile) => {
  console.log('File changed:', uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  ElMessage.warning(`最多上传 3 个文件，本次选择了 ${files.length} 个文件`)
}

const calculateTotal = (row: StorageRecord): number => {
  return (
    (row.warehouse1 || 0) +
    (row.warehouse2 || 0) +
    (row.warehouse3 || 0) +
    (row.warehouse4 || 0) +
    (row.warehouse5 || 0) +
    (row.warehouse6 || 0)
  )
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true

      setTimeout(() => {
        const newRecord: StorageRecord = {
          id: storageHistory.value.length + 1,
          warehouse1: form.warehouse1 || 0,
          warehouse2: form.warehouse2 || 0,
          warehouse3: form.warehouse3 || 0,
          warehouse4: form.warehouse4 || 0,
          warehouse5: form.warehouse5 || 0,
          warehouse6: form.warehouse6 || 0,
          purchaseOrder: form.purchaseOrder,
          storageDate: form.storageDate,
          remark: form.remark
        }

        storageHistory.value.unshift(newRecord)
        ElMessage.success('入仓记录提交成功')
        resetForm()
        submitting.value = false
      }, 1000)
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.inspectionReport = []
}
</script>

<style scoped>
.storage-container {
  max-width: 1400px;
  margin: 0 auto;
}

.form-card {
  margin-bottom: 20px;
}

.history-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-divider__text) {
  font-weight: bold;
  color: #409eff;
}
</style>
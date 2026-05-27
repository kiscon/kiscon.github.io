<template>
  <div class="bran-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><Setting /></el-icon>
          <span>糠加工</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
        <el-divider content-position="left">基础信息</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生产工单编号" prop="workOrderNo">
              <el-select
                v-model="form.workOrderNo"
                placeholder="请选择生产工单编号"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in workOrders"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加工日期" prop="processingDate">
              <el-date-picker
                v-model="form.processingDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">糠仓使用量</el-divider>

        <el-row :gutter="20">
          <el-col :span="12" v-for="i in 4" :key="i">
            <el-form-item
              :label="i === 4 ? `${i}号自加仓` : `${i}号外来仓`"
              :prop="`coolingWarehouse${i}`"
            >
              <el-input
                v-model.number="form[`coolingWarehouse${i}`]"
                placeholder="请输入使用量"
                type="number"
                :min="0"
                :precision="2"
              >
                <template #append>kg</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">加工产品</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成品糠" prop="finishedBran">
              <el-input
                v-model.number="form.finishedBran"
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

        <el-col :span="12">
          <el-form-item label="出糠率" prop="branYieldRate">
            <el-input
              v-model.number="form.branYieldRate"
              placeholder="请输入出糠率"
              type="number"
              disabled
              :min="0"
              :max="100"
              :precision="2"
            >
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-col>

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
            提交加工记录
          </el-button>
          <el-button @click="resetForm">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
          <el-button type="info" @click="calculateStats">
            <el-icon><DataAnalysis /></el-icon>
            计算统计
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="stats-card" v-if="showStats">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><DataAnalysis /></el-icon>
          <span>加工统计</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic
            title="外来仓总使用量"
            :value="totalCoolingUsage"
            suffix="kg"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="成品糠产量"
            :value="form.finishedBran || 0"
            suffix="kg"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="实际出糠率"
            :value="actualBranYield"
            :precision="2"
            suffix="%"
          />
        </el-col>
        <!-- <el-col :span="6">
          <el-statistic
            title="目标出糠率"
            :value="form.branYieldRate || 0"
            :precision="2"
            suffix="%"
          />
        </el-col> -->
      </el-row>
    </el-card>

    <el-card class="history-card" v-if="processingHistory.length > 0">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><List /></el-icon>
          <span>加工记录</span>
        </div>
      </template>

      <el-table :data="processingHistory" border stripe>
        <el-table-column prop="id" label="序号" width="80" />
        <el-table-column prop="workOrderNo" label="生产工单编号" width="150" />
        <el-table-column label="外来仓总使用量" width="140">
          <template #default="{ row }">
            {{
              (
                row.coolingWarehouse1 +
                row.coolingWarehouse2 +
                row.coolingWarehouse3
              ).toFixed(2)
            }}kg
          </template>
        </el-table-column>
        <el-table-column prop="finishedBran" label="成品糠" width="100">
          <template #default="{ row }"> {{ row.finishedBran }}kg </template>
        </el-table-column>
        <el-table-column prop="branYieldRate" label="出糠率" width="100">
          <template #default="{ row }"> {{ row.branYieldRate }}% </template>
        </el-table-column>
        <el-table-column label="加工日期" width="240">
          <template #default="{ row }">
            {{ row.processingDate?.join(' ~ ') || '-' }}
          </template>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, FormInstance, FormRules, UploadFile } from 'element-plus'
import {
  Setting,
  Check,
  RefreshLeft,
  DataAnalysis,
  List
} from '@element-plus/icons-vue'

interface BranForm {
  coolingWarehouse1: number | null
  coolingWarehouse2: number | null
  coolingWarehouse3: number | null
  coolingWarehouse4: number | null
  finishedBran: number | null
  branYieldRate: number | null
  batchNumber: string
  workOrderNo: string
  relatedOrder: string
  inspectionReport: UploadFile[]
  processingDate: string[]
  remark: string
  [key: string]: number | null | string | UploadFile[] | string[]
}

interface BranRecord {
  id: number
  coolingWarehouse1: number
  coolingWarehouse2: number
  coolingWarehouse3: number
  coolingWarehouse4: number
  finishedBran: number
  branYieldRate: number
  batchNumber: string
  workOrderNo: string
  relatedOrder: string
  processingDate: string[]
  remark: string
}

const formRef = ref<FormInstance>()
const submitting = ref(false)
const showStats = ref(false)

const form = reactive<BranForm>({
  coolingWarehouse1: null,
  coolingWarehouse2: null,
  coolingWarehouse3: null,
  coolingWarehouse4: null,
  finishedBran: null,
  branYieldRate: null,
  batchNumber: '',
  workOrderNo: '',
  relatedOrder: '',
  inspectionReport: [],
  processingDate: [],
  remark: ''
})

const rules: FormRules = {
  workOrderNo: [
    { required: true, message: '请选择生产工单编号', trigger: 'change' }
  ],
  // batchNumber: [
  //   { required: true, message: '请输入加工批次号', trigger: 'blur' }
  // ],
  // branYieldRate: [{ required: true, message: '请输入出糠率', trigger: 'blur' }],
  processingDate: [
    { required: true, message: '请选择加工日期', trigger: 'change' }
  ]
}

const workOrders = ref([
  { value: 'WO202403001', label: 'WO202403001 - 糠加工工单001' },
  { value: 'WO202403002', label: 'WO202403002 - 糠加工工单002' },
  { value: 'WO202403003', label: 'WO202403003 - 糠加工工单003' },
  { value: 'WO202403004', label: 'WO202403004 - 糠加工工单004' }
])

const processingHistory = ref<BranRecord[]>([
  {
    id: 1,
    coolingWarehouse1: 10,
    coolingWarehouse2: 8,
    coolingWarehouse3: 0,
    coolingWarehouse4: 0,
    finishedBran: 15,
    branYieldRate: 83,
    batchNumber: 'BR202401001',
    workOrderNo: 'WO202403001',
    relatedOrder: 'PO202401001',
    processingDate: ['2024-01-18', '2024-01-19'],
    remark: '第一批次糠加工'
  }
])

const totalCoolingUsage = computed(() => {
  return (
    (form.coolingWarehouse1 || 0) +
    (form.coolingWarehouse2 || 0) +
    (form.coolingWarehouse3 || 0) +
    (form.coolingWarehouse4 || 0)
  )
})

const actualBranYield = computed(() => {
  if (totalCoolingUsage.value === 0) return 0
  return ((form.finishedBran || 0) / totalCoolingUsage.value) * 100
})

const calculateStats = () => {
  showStats.value = true
  ElMessage.success('统计计算完成')
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true

      setTimeout(() => {
        const newRecord: BranRecord = {
          id: processingHistory.value.length + 1,
          coolingWarehouse1: form.coolingWarehouse1 || 0,
          coolingWarehouse2: form.coolingWarehouse2 || 0,
          coolingWarehouse3: form.coolingWarehouse3 || 0,
          coolingWarehouse4: form.coolingWarehouse4 || 0,
          finishedBran: form.finishedBran || 0,
          branYieldRate: form.branYieldRate || 0,
          batchNumber: form.batchNumber,
          workOrderNo: form.workOrderNo,
          relatedOrder: form.relatedOrder,
          processingDate: form.processingDate,
          remark: form.remark
        }

        processingHistory.value.unshift(newRecord)
        ElMessage.success('糠加工记录提交成功')
        resetForm()
        showStats.value = false
        submitting.value = false
      }, 1000)
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.inspectionReport = []
  showStats.value = false
}
</script>

<style scoped>
.bran-container {
  max-width: 1400px;
  margin: 0 auto;
}

.form-card {
  margin-bottom: 20px;
}

.stats-card {
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
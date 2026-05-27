<template>
  <div class="primary-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><Operation /></el-icon>
          <span>初加工</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
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

        <el-divider content-position="left">原粮仓使用量</el-divider>

        <el-row :gutter="20">
          <el-col :span="12" v-for="i in 6" :key="i">
            <el-form-item :label="`${i}号原粮仓`" :prop="`sourceWarehouse${i}`">
              <el-input
                v-model.number="form[`sourceWarehouse${i}`]"
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

        <el-divider content-position="left">凉米仓录入（标米）</el-divider>

        <el-row :gutter="20">
          <el-col :span="12" v-for="i in 7" :key="i">
            <el-form-item
              :label="`${i}号凉米仓`"
              :prop="`coolingWarehouse${i}`"
            >
              <el-input
                v-model.number="form[`coolingWarehouse${i}`]"
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

        <el-divider content-position="left">副产品录入</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="腹白米（9号仓）" prop="bellyRice">
              <el-input
                v-model.number="form.bellyRice"
                placeholder="请输入重量"
                type="number"
                :min="0"
                :precision="2"
              >
                <template #append>kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="碎米（8号仓）" prop="brokenRice">
              <el-input
                v-model.number="form.brokenRice"
                placeholder="请输入重量"
                type="number"
                :min="0"
                :precision="2"
              >
                <template #append>kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异色米" prop="coloredRice">
              <el-input
                v-model.number="form.coloredRice"
                placeholder="请输入重量"
                type="number"
                :min="0"
                :precision="2"
              >
                <template #append>kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="壳糠（4号仓）" prop="branRice">
              <el-input
                v-model.number="form.branRice"
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
          <el-form-item label="标米率" prop="standardRiceRate">
            <el-input
              v-model.number="form.standardRiceRate"
              placeholder="请输入标米率"
              disabled
              type="number"
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
            title="原粮总使用量"
            :value="totalSourceUsage"
            suffix="kg"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="标米总产量"
            :value="totalStandardRice"
            suffix="kg"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="副产品总量"
            :value="totalByProducts"
            suffix="kg"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="实际标米率"
            :value="actualRiceRate"
            :precision="2"
            suffix="%"
          />
        </el-col>
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
        <el-table-column prop="workOrderNo" label="生产工单号" width="150" />
        <el-table-column label="原粮使用量" width="150">
          <template #default="{ row }">
            {{ calculateSourceTotal(row) }}kg
          </template>
        </el-table-column>
        <el-table-column label="标米产量" width="120">
          <template #default="{ row }">
            {{ calculateStandardTotal(row) }}kg
          </template>
        </el-table-column>
        <el-table-column prop="bellyRice" label="腹白米" width="100">
          <template #default="{ row }"> {{ row.bellyRice || 0 }}kg </template>
        </el-table-column>
        <el-table-column prop="brokenRice" label="碎米" width="100">
          <template #default="{ row }"> {{ row.brokenRice || 0 }}kg </template>
        </el-table-column>
        <el-table-column prop="coloredRice" label="异色米" width="100">
          <template #default="{ row }"> {{ row.coloredRice || 0 }}kg </template>
        </el-table-column>
        <el-table-column prop="coloredRice" label="糠" width="100">
          <template #default="{ row }"> {{ row.branRice || 0 }}kg </template>
        </el-table-column>
        <el-table-column prop="standardRiceRate" label="标米率" width="100">
          <template #default="{ row }"> {{ row.standardRiceRate }}% </template>
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
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import {
  Operation,
  Check,
  RefreshLeft,
  DataAnalysis,
  List
} from '@element-plus/icons-vue'

interface PrimaryForm {
  sourceWarehouse1: number | null
  sourceWarehouse2: number | null
  sourceWarehouse3: number | null
  sourceWarehouse4: number | null
  sourceWarehouse5: number | null
  sourceWarehouse6: number | null
  coolingWarehouse1: number | null
  coolingWarehouse2: number | null
  coolingWarehouse3: number | null
  coolingWarehouse4: number | null
  coolingWarehouse5: number | null
  coolingWarehouse6: number | null
  coolingWarehouse7: number | null
  bellyRice: number | null
  brokenRice: number | null
  coloredRice: number | null
  branRice: number | null
  standardRiceRate: number | null
  purchaseOrder: string
  workOrderNo: string
  processingDate: string[]
  remark: string
  [key: string]: number | null | string | string[]
}

interface ProcessingRecord {
  id: number
  sourceWarehouse1: number
  sourceWarehouse2: number
  sourceWarehouse3: number
  sourceWarehouse4: number
  sourceWarehouse5: number
  sourceWarehouse6: number
  coolingWarehouse1: number
  coolingWarehouse2: number
  coolingWarehouse3: number
  coolingWarehouse4: number
  coolingWarehouse5: number
  coolingWarehouse6: number
  coolingWarehouse7: number
  bellyRice: number
  brokenRice: number
  coloredRice: number
  branRice: number
  standardRiceRate: number
  purchaseOrder: string
  workOrderNo: string
  processingDate: string[]
  remark: string
}

const formRef = ref<FormInstance>()
const submitting = ref(false)
const showStats = ref(false)

const form = reactive<PrimaryForm>({
  sourceWarehouse1: null,
  sourceWarehouse2: null,
  sourceWarehouse3: null,
  sourceWarehouse4: null,
  sourceWarehouse5: null,
  sourceWarehouse6: null,
  coolingWarehouse1: null,
  coolingWarehouse2: null,
  coolingWarehouse3: null,
  coolingWarehouse4: null,
  coolingWarehouse5: null,
  coolingWarehouse6: null,
  coolingWarehouse7: null,
  bellyRice: null,
  brokenRice: null,
  coloredRice: null,
  branRice: null,
  standardRiceRate: null,
  purchaseOrder: '',
  workOrderNo: '',
  processingDate: [],
  remark: ''
})

const rules: FormRules = {
  purchaseOrder: [
    { required: true, message: '请选择采购订单编号', trigger: 'change' }
  ],
  workOrderNo: [
    { required: true, message: '请选择生产工单编号', trigger: 'change' }
  ],
  processingDate: [
    { required: true, message: '请选择加工日期', trigger: 'change' }
  ],
  standardRiceRate: [
    // { required: true, message: '请输入标米率', trigger: 'blur' }
  ]
}

const purchaseOrders = ref([
  { value: 'PO202401001', label: 'PO202401001 - 江苏稻谷采购' },
  { value: 'PO202401002', label: 'PO202401002 - 安徽稻谷采购' },
  { value: 'PO202401003', label: 'PO202401003 - 湖北稻谷采购' }
])

const workOrders = ref([
  { value: 'WO202401001', label: 'WO202401001 - 初加工工单001' },
  { value: 'WO202401002', label: 'WO202401002 - 初加工工单002' },
  { value: 'WO202401003', label: 'WO202401003 - 初加工工单003' },
  { value: 'WO202401004', label: 'WO202401004 - 初加工工单004' }
])

const processingHistory = ref<ProcessingRecord[]>([
  {
    id: 1,
    sourceWarehouse1: 30,
    sourceWarehouse2: 20,
    sourceWarehouse3: 0,
    sourceWarehouse4: 0,
    sourceWarehouse5: 0,
    sourceWarehouse6: 0,
    coolingWarehouse1: 20,
    coolingWarehouse2: 15,
    coolingWarehouse3: 0,
    coolingWarehouse4: 0,
    coolingWarehouse5: 0,
    coolingWarehouse6: 0,
    coolingWarehouse7: 0,
    bellyRice: 4,
    brokenRice: 3,
    coloredRice: 2,
    branRice: 1,
    standardRiceRate: 75,
    purchaseOrder: 'PO202401001',
    workOrderNo: 'WO202401001',
    processingDate: ['2024-01-16', '2024-01-17'],
    remark: '第一批次初加工'
  }
])

const totalSourceUsage = computed(() => {
  return (
    (form.sourceWarehouse1 || 0) +
    (form.sourceWarehouse2 || 0) +
    (form.sourceWarehouse3 || 0) +
    (form.sourceWarehouse4 || 0) +
    (form.sourceWarehouse5 || 0) +
    (form.sourceWarehouse6 || 0)
  )
})

const totalStandardRice = computed(() => {
  return (
    (form.coolingWarehouse1 || 0) +
    (form.coolingWarehouse2 || 0) +
    (form.coolingWarehouse3 || 0) +
    (form.coolingWarehouse4 || 0) +
    (form.coolingWarehouse5 || 0) +
    (form.coolingWarehouse6 || 0) +
    (form.coolingWarehouse7 || 0)
  )
})

const totalByProducts = computed(() => {
  return (
    (form.bellyRice || 0) + (form.brokenRice || 0) + (form.coloredRice || 0)
  )
})

const actualRiceRate = computed(() => {
  if (totalSourceUsage.value === 0) return 0
  return (totalStandardRice.value / totalSourceUsage.value) * 100
})

const calculateSourceTotal = (row: ProcessingRecord): number => {
  return (
    row.sourceWarehouse1 +
    row.sourceWarehouse2 +
    row.sourceWarehouse3 +
    row.sourceWarehouse4 +
    row.sourceWarehouse5 +
    row.sourceWarehouse6
  )
}

const calculateStandardTotal = (row: ProcessingRecord): number => {
  return (
    row.coolingWarehouse1 +
    row.coolingWarehouse2 +
    row.coolingWarehouse3 +
    row.coolingWarehouse4 +
    row.coolingWarehouse5 +
    row.coolingWarehouse6 +
    row.coolingWarehouse7
  )
}

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
        const newRecord: ProcessingRecord = {
          id: processingHistory.value.length + 1,
          sourceWarehouse1: form.sourceWarehouse1 || 0,
          sourceWarehouse2: form.sourceWarehouse2 || 0,
          sourceWarehouse3: form.sourceWarehouse3 || 0,
          sourceWarehouse4: form.sourceWarehouse4 || 0,
          sourceWarehouse5: form.sourceWarehouse5 || 0,
          sourceWarehouse6: form.sourceWarehouse6 || 0,
          coolingWarehouse1: form.coolingWarehouse1 || 0,
          coolingWarehouse2: form.coolingWarehouse2 || 0,
          coolingWarehouse3: form.coolingWarehouse3 || 0,
          coolingWarehouse4: form.coolingWarehouse4 || 0,
          coolingWarehouse5: form.coolingWarehouse5 || 0,
          coolingWarehouse6: form.coolingWarehouse6 || 0,
          coolingWarehouse7: form.coolingWarehouse7 || 0,
          bellyRice: form.bellyRice || 0,
          brokenRice: form.brokenRice || 0,
          coloredRice: form.coloredRice || 0,
          branRice: form.branRice || 0,
          standardRiceRate: form.standardRiceRate || 0,
          purchaseOrder: form.purchaseOrder,
          workOrderNo: form.workOrderNo,
          processingDate: form.processingDate,
          remark: form.remark
        }

        processingHistory.value.unshift(newRecord)
        ElMessage.success('初加工记录提交成功')
        resetForm()
        showStats.value = false
        submitting.value = false
      }, 1000)
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  showStats.value = false
}
</script>

<style scoped>
.primary-container {
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
<template>
  <div class="refined-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><Star /></el-icon>
          <span>精加工</span>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
        <el-divider content-position="left">基础信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="销售订单编号" prop="salesOrder">
              <el-select
                v-model="form.salesOrder"
                placeholder="请选择销售订单编号"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in salesOrders"
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

        <el-divider content-position="left">凉米仓使用量</el-divider>

        <el-row :gutter="20">
          <el-col :span="12" v-for="i in 7" :key="i">
            <el-form-item
              :label="`${i}号凉米仓`"
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
            <el-form-item label="腹白米（9号仓）" prop="bellyRice">
              <el-input
                v-model.number="form.bellyRice"
                placeholder="请输入重量（kg）"
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
                placeholder="请输入重量（kg）"
                type="number"
                :min="0"
                :precision="2"
              >
                <template #append>kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精米" prop="refinedRice">
              <el-input
                v-model.number="form.refinedRice"
                placeholder="请输入重量（kg）"
                type="number"
                :min="0"
                :precision="2"
              >
                <template #append>kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抛光粉" prop="polishingPowder">
              <el-input
                v-model.number="form.polishingPowder"
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
          <el-form-item label="精米率" prop="refinedRiceRate">
            <el-input
              v-model.number="form.refinedRiceRate"
              placeholder="请输入精米率"
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
            title="凉米仓总使用量"
            :value="totalCoolingUsage"
            suffix="kg"
          />
        </el-col>
        <el-col :span="6">
          <el-statistic
            title="精米产量"
            :value="refinedRiceOutput"
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
            title="实际精米率"
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
        <el-table-column label="凉米仓使用量" width="150">
          <template #default="{ row }">
            {{ calculateCoolingTotal(row) }}kg
          </template>
        </el-table-column>
        <el-table-column prop="bellyRice" label="腹白米" width="100">
          <template #default="{ row }"> {{ row.bellyRice || 0 }}kg </template>
        </el-table-column>
        <el-table-column prop="brokenRice" label="碎米" width="100">
          <template #default="{ row }"> {{ row.brokenRice || 0 }}kg </template>
        </el-table-column>
        <el-table-column prop="polishingPowder" label="抛光粉" width="100">
          <template #default="{ row }">
            {{ row.polishingPowder || 0 }}kg
          </template>
        </el-table-column>
        <el-table-column prop="refinedRiceRate" label="精米率" width="100">
          <template #default="{ row }"> {{ row.refinedRiceRate }}% </template>
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
import {
  ElMessage,
  FormInstance,
  FormRules,
  UploadFile,
  UploadProps
} from 'element-plus'
import {
  Star,
  Check,
  RefreshLeft,
  DataAnalysis,
  List,
  Upload
} from '@element-plus/icons-vue'

interface RefinedForm {
  coolingWarehouse1: number | null
  coolingWarehouse2: number | null
  coolingWarehouse3: number | null
  coolingWarehouse4: number | null
  coolingWarehouse5: number | null
  coolingWarehouse6: number | null
  coolingWarehouse7: number | null
  bellyRice: number | null
  brokenRice: number | null
  refinedRice: number | null
  polishingPowder: number | null
  refinedRiceRate: number | null
  salesOrder: string
  workOrderNo: string
  inspectionReport: UploadFile[]
  processingDate: string[]
  remark: string
  [key: string]: number | null | string | UploadFile[] | string[]
}

interface RefinedRecord {
  id: number
  coolingWarehouse1: number
  coolingWarehouse2: number
  coolingWarehouse3: number
  coolingWarehouse4: number
  coolingWarehouse5: number
  coolingWarehouse6: number
  coolingWarehouse7: number
  bellyRice: number
  brokenRice: number
  refinedRice: number
  polishingPowder: number
  refinedRiceRate: number
  salesOrder: string
  workOrderNo: string
  processingDate: string[]
  remark: string
}

const formRef = ref<FormInstance>()
const submitting = ref(false)
const showStats = ref(false)

const form = reactive<RefinedForm>({
  coolingWarehouse1: null,
  coolingWarehouse2: null,
  coolingWarehouse3: null,
  coolingWarehouse4: null,
  coolingWarehouse5: null,
  coolingWarehouse6: null,
  coolingWarehouse7: null,
  bellyRice: null,
  brokenRice: null,
  refinedRice: null,
  polishingPowder: null,
  refinedRiceRate: null,
  salesOrder: '',
  workOrderNo: '',
  inspectionReport: [],
  processingDate: [],
  remark: ''
})

const rules: FormRules = {
  salesOrder: [
    { required: true, message: '请选择销售订单编号', trigger: 'change' }
  ],
  workOrderNo: [
    { required: true, message: '请选择生产工单编号', trigger: 'change' }
  ],
  processingDate: [
    { required: true, message: '请选择加工日期', trigger: 'change' }
  ]
  // refinedRiceRate: [
  //   { required: true, message: '请输入精米率', trigger: 'blur' }
  // ]
}

const salesOrders = ref([
  { value: 'SO202401001', label: 'SO202401001 - 上海销售订单' },
  { value: 'SO202401002', label: 'SO202401002 - 北京销售订单' },
  { value: 'SO202401003', label: 'SO202401003 - 广州销售订单' },
  { value: 'SO202401004', label: 'SO202401004 - 深圳销售订单' }
])

const workOrders = ref([
  { value: 'WO202402001', label: 'WO202402001 - 精加工工单001' },
  { value: 'WO202402002', label: 'WO202402002 - 精加工工单002' },
  { value: 'WO202402003', label: 'WO202402003 - 精加工工单003' },
  { value: 'WO202402004', label: 'WO202402004 - 精加工工单004' }
])

const processingHistory = ref<RefinedRecord[]>([
  {
    id: 1,
    coolingWarehouse1: 15,
    coolingWarehouse2: 10,
    coolingWarehouse3: 0,
    coolingWarehouse4: 0,
    coolingWarehouse5: 0,
    coolingWarehouse6: 0,
    coolingWarehouse7: 0,
    bellyRice: 3,
    brokenRice: 2,
    refinedRice: 18,
    polishingPowder: 1,
    refinedRiceRate: 85,
    salesOrder: 'SO202401001',
    workOrderNo: 'WO202402001',
    processingDate: ['2024-01-17', '2024-01-18'],
    remark: '第一批次精加工'
  }
])

const totalCoolingUsage = computed(() => {
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

const refinedRiceOutput = computed(() => {
  return totalCoolingUsage.value - totalByProducts.value
})

const totalByProducts = computed(() => {
  return (
    (form.bellyRice || 0) + (form.brokenRice || 0) + (form.polishingPowder || 0)
  )
})

const actualRiceRate = computed(() => {
  if (totalCoolingUsage.value === 0) return 0
  return (refinedRiceOutput.value / totalCoolingUsage.value) * 100
})

const calculateCoolingTotal = (row: RefinedRecord): number => {
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

const handleFileChange: UploadProps['onChange'] = (uploadFile) => {
  console.log('File changed:', uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  ElMessage.warning(`最多上传 3 个文件，本次选择了 ${files.length} 个文件`)
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
        const newRecord: RefinedRecord = {
          id: processingHistory.value.length + 1,
          coolingWarehouse1: form.coolingWarehouse1 || 0,
          coolingWarehouse2: form.coolingWarehouse2 || 0,
          coolingWarehouse3: form.coolingWarehouse3 || 0,
          coolingWarehouse4: form.coolingWarehouse4 || 0,
          coolingWarehouse5: form.coolingWarehouse5 || 0,
          coolingWarehouse6: form.coolingWarehouse6 || 0,
          coolingWarehouse7: form.coolingWarehouse7 || 0,
          bellyRice: form.bellyRice || 0,
          brokenRice: form.brokenRice || 0,
          refinedRice: form.refinedRice || 0,
          polishingPowder: form.polishingPowder || 0,
          refinedRiceRate: form.refinedRiceRate || 0,
          salesOrder: form.salesOrder,
          workOrderNo: form.workOrderNo,
          processingDate: form.processingDate,
          remark: form.remark
        }

        processingHistory.value.unshift(newRecord)
        ElMessage.success('精加工记录提交成功')
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
.refined-container {
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
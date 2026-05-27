<template>
  <div class="report-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><Search /></el-icon>
          <span>投入产出报表查询</span>
        </div>
      </template>

      <el-form :model="queryForm" ref="queryFormRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="加工日期" prop="dateRange">
              <el-date-picker
                v-model="queryForm.dateRange"
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
          <el-col :span="12">
            <el-form-item label="生产工单号" prop="workOrderNo">
              <el-input
                v-model="queryForm.workOrderNo"
                placeholder="请输入生产工单号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="handleQuery" :loading="loading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic
            title="稻谷消耗量"
            :value="stats.riceConsumption"
            suffix="kg"
            :precision="2"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic
            title="成品糠总量"
            :value="stats.finishedBranTotal"
            suffix="kg"
            :precision="2"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic
            title="精米总量"
            :value="stats.refinedRiceTotal"
            suffix="kg"
            :precision="2"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic
            title="自加工标米总量"
            :value="stats.standardRiceTotal"
            suffix="kg"
            :precision="2"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic
            title="自加工糠总量"
            :value="stats.branTotal"
            suffix="kg"
            :precision="2"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic
            title="毛米率"
            :value="stats.grossRiceRate"
            suffix="%"
            :precision="2"
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            title="标米率"
            :value="stats.standardRiceRate"
            suffix="%"
            :precision="2"
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            title="精米率"
            :value="stats.refinedRiceRate"
            suffix="%"
            :precision="2"
          />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            title="出糠率"
            :value="stats.branYieldRate"
            suffix="%"
            :precision="2"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20"><List /></el-icon>
          <span>产出明细列表</span>
        </div>
      </template>

      <el-table :data="reportList" border stripe v-loading="loading">
        <el-table-column prop="workOrderNo" label="生产工单号" width="180" />
        <el-table-column prop="riceConsumption" label="稻谷消耗量" width="120">
          <template #default="{ row }"> {{ row.riceConsumption }}kg </template>
        </el-table-column>
        <el-table-column prop="standardRiceOutput" label="标米产量" width="120">
          <template #default="{ row }">
            {{ row.standardRiceOutput }}kg
          </template>
        </el-table-column>
        <el-table-column prop="bellyRice" label="腹白米" width="100">
          <template #default="{ row }"> {{ row.bellyRice }}kg </template>
        </el-table-column>
        <el-table-column prop="brokenRice" label="碎米" width="100">
          <template #default="{ row }"> {{ row.brokenRice }}kg </template>
        </el-table-column>
        <el-table-column prop="polishingPowder" label="抛光粉" width="100">
          <template #default="{ row }"> {{ row.polishingPowder }}kg </template>
        </el-table-column>
        <el-table-column prop="refinedRice" label="精米" width="100">
          <template #default="{ row }"> {{ row.refinedRice }}kg </template>
        </el-table-column>
        <el-table-column prop="coloredRice" label="异色米" width="100">
          <template #default="{ row }"> {{ row.coloredRice }}kg </template>
        </el-table-column>
        <el-table-column prop="finishedBran" label="成品糠" width="100">
          <template #default="{ row }"> {{ row.finishedBran }}kg </template>
        </el-table-column>
        <el-table-column label="加工日期" width="240">
          <template #default="{ row }">
            {{ row.processingDate?.join(' ~') || '-' }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Search, RefreshLeft, List } from '@element-plus/icons-vue'

interface QueryForm {
  dateRange: string[]
  workOrderNo: string
}

interface ReportItem {
  workOrderNo: string
  riceConsumption: number
  standardRiceOutput: number
  bellyRice: number
  brokenRice: number
  polishingPowder: number
  refinedRice: number
  coloredRice: number
  finishedBran: number
  processingDate: string[]
}

interface Stats {
  riceConsumption: number
  finishedBranTotal: number
  refinedRiceTotal: number
  standardRiceTotal: number
  branTotal: number
  grossRiceRate: number
  standardRiceRate: number
  refinedRiceRate: number
  branYieldRate: number
}

const queryFormRef = ref<FormInstance>()
const loading = ref(false)

const queryForm = reactive<QueryForm>({
  dateRange: [],
  workOrderNo: ''
})

const reportList = ref<ReportItem[]>([
  {
    workOrderNo: 'WO202401001',
    riceConsumption: 5000,
    standardRiceOutput: 3500,
    bellyRice: 300,
    brokenRice: 250,
    polishingPowder: 80,
    refinedRice: 2800,
    coloredRice: 150,
    finishedBran: 450,
    processingDate: ['2024-01-15', '2024-01-17']
  },
  {
    workOrderNo: 'WO202401002',
    riceConsumption: 4800,
    standardRiceOutput: 3360,
    bellyRice: 280,
    brokenRice: 240,
    polishingPowder: 75,
    refinedRice: 2680,
    coloredRice: 140,
    finishedBran: 420,
    processingDate: ['2024-01-18', '2024-01-20']
  },
  {
    workOrderNo: 'WO202402001',
    riceConsumption: 5200,
    standardRiceOutput: 3640,
    bellyRice: 310,
    brokenRice: 260,
    polishingPowder: 85,
    refinedRice: 2900,
    coloredRice: 160,
    finishedBran: 470,
    processingDate: ['2024-02-01', '2024-02-03']
  }
])

const stats = computed<Stats>(() => {
  const total = reportList.value.reduce(
    (acc, item) => ({
      riceConsumption: acc.riceConsumption + item.riceConsumption,
      finishedBranTotal: acc.finishedBranTotal + item.finishedBran,
      refinedRiceTotal: acc.refinedRiceTotal + item.refinedRice,
      standardRiceTotal: acc.standardRiceTotal + item.standardRiceOutput,
      branTotal:
        acc.branTotal + item.bellyRice + item.brokenRice + item.polishingPowder
    }),
    {
      riceConsumption: 0,
      finishedBranTotal: 0,
      refinedRiceTotal: 0,
      standardRiceTotal: 0,
      branTotal: 0
    }
  )

  const grossRiceRate =
    total.riceConsumption > 0
      ? ((total.standardRiceTotal + total.refinedRiceTotal) /
          total.riceConsumption) *
        100
      : 0
  const standardRiceRate =
    total.riceConsumption > 0
      ? (total.standardRiceTotal / total.riceConsumption) * 100
      : 0
  const refinedRiceRate =
    total.riceConsumption > 0
      ? (total.refinedRiceTotal / total.riceConsumption) * 100
      : 0
  const branYieldRate =
    total.riceConsumption > 0
      ? (total.finishedBranTotal / total.riceConsumption) * 100
      : 0

  return {
    ...total,
    grossRiceRate,
    standardRiceRate,
    refinedRiceRate,
    branYieldRate
  }
})

const handleQuery = () => {
  loading.value = true
  setTimeout(() => {
    ElMessage.success('查询成功')
    loading.value = false
  }, 500)
}

const handleReset = () => {
  queryFormRef.value?.resetFields()
  ElMessage.info('已重置查询条件')
}
</script>

<style scoped>
.report-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
}

.form-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

:deep(.el-card__header) {
  background-color: #f5f7fa;
  padding: 12px 20px;
}

:deep(.el-statistic__head) {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

:deep(.el-statistic__content) {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}
</style>

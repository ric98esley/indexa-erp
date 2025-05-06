<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['filters'])

const shortcuts = [
  {
    text: 'Hoy',
    value: new Date(),
  },
  {
    text: 'Ayer',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'Semana pasada',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
  {
    text: 'Mes pasado',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
      return date
    },
  },
  {
    text: 'Trimestre pasado',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 90)
      return date
    },
  }
]

const filters = reactive({
  limit: 10,
  offset: 1,
  ip: '',
  serial: '',
  alertType: '',
  location: '',
  startDate: '',
  endDate: '',
})

const geoClass = ({
  row,
  rowIndex,
}: {
  row: GeoAlert,
  rowIndex: number
}) => {
  if (row.alert) {
    return 'danger-row'
  }

  return ''
}

watch(filters, () => {
  emit('filters', filters)
}, { deep: true })
</script>

<template>
  <el-container>
    <el-col>
      <el-row>
        <el-form>
          <el-row>
            <el-form-item class="w-64 sm:w-auto ml-4">
              <el-date-picker v-model="filters.startDate" type="datetime" placeholder="Fecha de inicio"
                format="YYYY/MM/DD" value-format="x" :shortcuts="shortcuts" />
            </el-form-item>
            <div class="ml-4 w-10 flex items-center sm:items-start sm:mt-1">
              <span class="ml-2">al</span>
            </div>
            <el-form-item class="w-64 sm:w-auto ml-4 sm:ml-0 sm:mr-4">
              <el-date-picker v-model="filters.endDate" type="datetime" placeholder="Fecha limite" format="YYYY/MM/DD"
                value-format="x" />
            </el-form-item>
          </el-row>
        </el-form>
      </el-row>
      <el-table :data="props.data" :row-class-name="geoClass">
        <el-table-column prop="serial" label="Serial">
          <template #header>
            <el-input v-model="filters.serial" placeholder="Serial" clearable />
          </template>
          <template #default="{ row }">
            <span class="text-teal-500 underline">
              <NuxtLink :to="`/assets?serial=${row.serial}`" target="_blank">{{ row.serial }}</NuxtLink>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP">
          <template #header>
            <el-input v-model="filters.ip" placeholder="IP" clearable />
          </template>
        </el-table-column>
        <el-table-column prop="alertType" label="Description">
          <template #header>
            <el-input v-model="filters.alertType" placeholder="Description" clearable />
          </template>
        </el-table-column>
        <el-table-column prop="latitude" label="Coordenadas">
          <template #default="{ row }">
            {{ row.latitude }} ,{{ row.longitude }}
          </template>
        </el-table-column>
        <el-table-column prop="location.code" label="Lugar">
          <template #header>
            <el-input v-model="filters.location" placeholder="Lugar" clearable />
          </template>
          <template #default="{ row }">
            {{ row.location?.code ?? 'Activo no encontrado' }} - {{ row.location?.name }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Fecha">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
      </el-table>
      <Pagination v-model:offset="filters.offset" v-model:limit="filters.limit" :total="props.total" />
    </el-col>
  </el-container>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-5);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-5);
}

.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-5);
}

.el-table .info-row {
  --el-table-tr-bg-color: var(--el-color-info-light-5);
}

.cell {
  display: flex;
  align-items: center;
}
</style>
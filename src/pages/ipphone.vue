<template>
    <q-page class="q-pa-sm">
        <q-table
            title="Treats"
            :data="data"
            :columns="columns"
            row-key="number"
            :filter="filter"
            :loading="loading"
            :rows-per-page-options='[10,20,50]'
            >

            <template v-slot:top>
                IP телефония
                <q-space />
                <q-input  dense color="primary" v-model="filter" label='Поиск'>
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
                </q-input>
            </template>

            </q-table>
    </q-page>
</template>

<script>
export default {
  name: 'ipphone',
  data () {
    return {
      loading: true,
      filter: '',
      rowCount: 25,
      columns: [
            { label: 'Номер', align: 'center', name: 'number', field: 'number' },
            { label: 'ФИО', align: 'center', name: 'pers', field: 'pers' },
            { label: 'Отдел', align: 'center', name: 'deps', field: 'deps' },
        ],
      data: [],
      original: []
    }
  },
  mounted: function () {
      let self = this;
      var url = 'phones/'
      this.$axios({url: url}).then(function(response) {
          self.loading = false
          self.data = response['data']
      })
  }
}
</script>
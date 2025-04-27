<template>
  <div class="q-my-sm row">
    <h5 class="q-ma-none q-mr-sm">Учетные записи</h5>
    <q-btn @click="appendUser" icon="add"></q-btn>
  </div>
  <q-markup-table flat>
    <thead class="table-head">
      <tr>
        <th class="text-left">
          <span>Метки</span>
          <q-icon name="help_outline" size="xs" style="cursor: help">
            <q-tooltip class="bg-indigo text-subtitle2" :offset="[10, 10]"
              >Для указания нескольких меток олной пары логин/пароль используйте
              разделитель</q-tooltip
            >
          </q-icon>
        </th>
        <th class="text-left">Тип записи</th>
        <th class="text-left">Логин</th>
        <th class="text-left">Пароль</th>
        <th class="text-right"></th>
      </tr>
    </thead>
    <tbody>
            <tr v-for="(rows, i) in displayAccountsList" :key="i">
              <td>
                  <q-input
                    filled
                    v-model="rows.tag"
                    :rules="[fieldRules]"
                    @blur="checkModelForInsert(rows,i)"
                    :maxlength="50"
                  />
                </td>
                <td>
                  <q-select
                    filled
                    :options="MS.options"
                    emit-value
                    :rules="[fieldRules]"
                    map-options
                    option-value="value"
                    option-label="label"
                    v-model="rows.type"
                  />
                  </td>
                  <td :colspan="rows.type=='2'?2:1">
                      <q-input
                        filled
                        v-model="rows.login"
                        :rules="[fieldRules]"
                        :maxlength="100"
                        @blur="checkModelForInsert(rows,i)"
                      />
                    </td>
              <td v-if="rows.type!='2'">
                  <q-input
                    filled
                    :maxlength="100"
                    :rules="[fieldRules]"
                    @blur="checkModelForInsert(rows,i)"
                    :type="isPwd[i] ? 'password' : 'text'"
                    v-model="rows.password"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd[i] ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd[i] = !isPwd[i]"
                      />
                    </template>
                  </q-input>
                </td>
              <td>
                <q-btn
                  style="margin-top: -20px"
                  @click="removeManager(row,i)"
                  dense
                  size="lg"
                  flat
                  icon="delete"
                ></q-btn>
              </td>
            </tr>
    </tbody>
  </q-markup-table>
</template>
<script setup lang="ts">
import type { ITaskManager } from 'components/rowsInterfaces';
import { useManagerStore } from 'stores/managers';
import { onMounted, ref } from 'vue';
const MS = useManagerStore();
const displayAccountsList = ref<ITaskManager[]>([]);
const isPwd = ref<boolean[]>([]);

onMounted(() => {
  MS.clearManagerList();
  convertManagerList();
});

const convertManagerList = () => {
  displayAccountsList.value = JSON.parse(JSON.stringify(MS.displayAccountsList));
};
const fieldRules = (val: string | null): string | boolean => {
  return !!val || 'Значение не должно быть пустым';
};
const appendUser = () => {
  console.log(MS.defaultRowState);
  displayAccountsList.value.push({ tag: null, type: '2', login: null, password: null });
};
const validate =(row:ITaskManager)=>{
  let result=true;
  for (const [key, value] of Object.entries(row)) {
    if (key === 'index') {
      continue;
    } else if (key == 'password') {
      if(row.type=='2'){
        continue;
      }
    }else if(fieldRules(value)?.length){
      result=false;
      break
    }
  }
  return result
}
const checkModelForInsert=(row:ITaskManager,index:number)=> {
  if(validate(row)){
    if(row.index){
      MS.updateManager(row,index)
    }else{
      MS.appendManager(row)
      row.index=MS.managerList.length
    }
  }
}
// const updateManager = (index: number, value, key: 'type' | 'tag' | 'login' | 'password') => {
//   console.log(index, value, key, fieldRules(value), !!fieldRules(value)?.length);
//   if (key == 'type' && value == '2') {
//     MS.updateManager(index, null, 'password');
//   } else if (fieldRules(value)?.length) {
//     //MS.updateManager(index, lastValue.value, key);
//     return;
//   } else if (key == 'tag') {
//     MS.updateManager(
//       index,
//       (value || '')?.split(';').map((item) => {
//         return { text: item };
//       }),
//       key,
//     );
//     return;
//   }
//   MS.updateManager(index, value, key);
// };
const removeManager = (row:ITaskManager,index: number) => {
  isPwd.value.splice(index, 1);
  displayAccountsList.value.splice(index,1);
  MS.removeManager(index);
};
</script>

<style scoped lang="scss">
.table-head {
  th {
    width: 25%;
  }
}
</style>

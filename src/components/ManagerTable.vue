<template>
  <div class="q-my-sm row">
    <h5 class="q-ma-none q-mr-sm">Учетные записи</h5>
    <q-btn @click="appendUser" icon="add"></q-btn>
  </div>
  <q-markup-table flat>
    <thead class="table-head">
      <tr>
        <th class="text-left">
          Метки
          <q-icon name="info" size="xs" style="cursor: help">
            <q-tooltip class="bg-indigo" :offset="[10, 10]"
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
    {{displayAccountsList}}
      <tr v-for="(rows, i) in displayAccountsList" :key="i">
        <td>
            <q-input
              filled
              v-model="rows.tag"
              :rules="[fieldRules]"
              @blur="checkModelForInsert()"
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
              @update:model-value="
                (val) => {
                  updateManager(i, val, 'type');
                }
              "
              :model-value="rows.type"
            />
            </td>
            <td>
                <q-input
                  filled
                  :model-value="rows.login"
                  :rules="[fieldRules]"
                  :maxlength="100"
                  @update:model-value="
                    (val) => {
                      lastValue = val;
                    }
                  "
                  @blur="
                    (val) => {
                      updateManager(i, lastValue, 'login');
                    }
                  "
                />
              </td>
        <td>
            <q-input
              filled
              :maxlength="100"
              @blur="updateManager(i, lastValue, 'password')"
              :rules="[fieldRules]"
              :type="isPwd[i] ? 'password' : 'text'"
              @update:model-value="
                (val) => {
                  lastValue = val;
                }
              "
              :model-value="rows.password"
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
            @click="removeManager(i)"
            dense
            flat
            icon="delete"
          ></q-btn>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
  {{ MS.managerList }}
</template>
<script setup lang="ts">
import { useManagerStore } from 'stores/managers';
import { onMounted, ref } from 'vue';
const MS = useManagerStore();
const displayAccountsList = ref([]);
const isPwd = ref<boolean[]>([]);
const lastValue = ref<string | null>('');


onMounted(()=>{
  convertManagerList()
})

const convertManagerList=()=>{
  displayAccountsList.value=JSON.parse(JSON.stringify(MS.displayAccountsList))
}
const fieldRules = (val: string | null): string | boolean => {
  return !!val || 'Значение не должно быть пустым';
};
const appendUser = () => {
  MS.appendManager();
};
const updateManager = (index: number, value, key: 'type' | 'tag' | 'login' | 'password') => {
  console.log(index, value, key, fieldRules(value), !!fieldRules(value)?.length);
  if (key == 'type' && value == '2') {
    MS.updateManager(index, null, 'password');
  } else if (fieldRules(value)?.length) {
    //MS.updateManager(index, lastValue.value, key);
    return;
  } else if (key == 'tag') {
    MS.updateManager(
      index,
      (value || '')?.split(';').map((item) => {
        return { text: item };
      }),
      key,
    );
    return;
  }
  MS.updateManager(index, value, key);
};
const removeManager = (index: number) => {
  isPwd.value.splice(index, 1);
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

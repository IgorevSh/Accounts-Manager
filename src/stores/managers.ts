import { defineStore } from 'pinia';
import type { ITaskManager } from 'components/rowsInterfaces';
import { useStorage } from '@vueuse/core';

export const useManagerStore = defineStore('managers', {
  state: () => ({
    managerList: useStorage('managerList', [] as ITaskManager[]),
    options: [
      { label: 'Локальная ', value: '1' },
      { label: 'LDAP', value: '2' },
    ],
  }),
  getters: {
    displayAccountsList(state){
      return state.managerList.map(itm=>{
        return {
          tag:itm.tag?.map((tag)=>{
            return tag?.text
          }).join(';'),
          type:itm.type ||null,
          login:itm.login ||null,
          password:itm.password ||null
        }
      })
    }
  },
  actions: {
    appendManager(data: ITaskManager = { tag: [], type: '2', login: null, password: null }) {
      this.managerList.push(data);
    },
    updateManager(
      index: number,
      value:never,
      key: 'type' | 'tag' | 'login' | 'password',
    ) {
      if (this.managerList?.[index] && key) {
        this.managerList[index][key] = value;
      }
    },
    removeManager(index: number) {
      this.managerList.splice(index, 1);
    },
  },
});

import {ElLoading} from 'element-plus'

export const useAppStore = defineStore('App', {
    state: () => ({
        loading: null
    }),
    actions: {
        load(isLoad) {
            if (isLoad)
                this.loading = ElLoading.service({fullscreen: true, lock: true});
            else if (this.loading) this.loading.close()
        }
    },
});
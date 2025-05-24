export const useUnionsStore = defineStore('Unions', {
    state: () => ({
        unions: [],
        active: null
    }),
    actions: {
        async me() {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                const res = await $axios('unions');
                this.unions = res.data;
                return res;
            } catch (err) {
                console.error('Register error:', err);
                throw err;
            }
        },
        async getActive(id) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                const res = await $axios('unions/' + id);
                this.active = res.data;
                return this.active;
            } catch (err) {
                console.error('Register error:', err);
                throw err;
            }
        },
        async create(data) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            const postData = {data}
            try {
                const res = await $axios.post('unions', postData);
                await this.me()
                return res;
            } catch (err) {
                console.error('Register error:', err);
                throw err.response;
            }
        },
        async confirm(id, isConfirm) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            const postData = {data: {status: isConfirm ? 'confirm' : 'not_confirm'}}
            try {
                const res = await $axios.put('unions/' + id + '/confirm', postData);
                await this.me()
                return res;
            } catch (err) {
                console.error('Register error:', err);
                throw err.response;
            }
        },
        async sign(id) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                const res = await $axios.post('unions/' + id + '/sign')
                await this.me()
                return res;
            } catch (err) {
                console.error('Register error:', err);
                throw err.response;
            }
        }
    },
});

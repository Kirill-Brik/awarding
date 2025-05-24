export const useUserStore = defineStore('User', {
    state: () => ({
        user: useCookie('user')
    }),
    hydrate(storeState, initialState) {
        storeState.user = useCookie('user')
    },
    actions: {
        async login(identifier, password, init_invite) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                const res = await $axios.post('auth/local', {identifier, password});
                this.user = res.data.user;
                this.user.jwt = res.data.jwt;
                if (init_invite)
                    await this.update({init_invite})
                return this.user;
            } catch (err) {
                console.error('Login error:', err);
                throw err.response;
            }
        },
        async register(data, init_invite) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                const res = await $axios.post('auth/local/register', data, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                console.log(res)
                this.user = res.data.user;
                this.user.jwt = res.data.jwt;
                if (init_invite)
                    await this.update({init_invite})
                return this.user;
            } catch (err) {
                console.error('Register error:', err);
                throw err.response;
            }
        },
        async logout() {
            this.user = null;
            return this.user
        },
        async me() {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                const res = await $axios('users/me');
                const jwt = this.user.jwt
                this.user = res.data;
                this.user.jwt = jwt;
                return this.user;
            } catch (err) {
                console.error('me error:', err);
                throw err;
            }
        },
        async update(data) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                const res = await $axios.put('users/' + this.user.id, data, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                await this.me()
                return res;
            } catch (err) {
                console.error('update error:', err);
                throw err.response;
            }
        },
        async changePassword(data) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                return await $axios.post('auth/change-password', data);
            } catch (err) {
                console.error('change Pass error:', err);
                throw err.response;
            }
        },
        async forgotPassword(data) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                return await $axios.post('auth/forgot-password', data);
            } catch (err) {
                console.error('forgotPassword error:', err);
                throw err.response;
            }
        },
        async resetPassword(data) {
            const nuxtApp = useNuxtApp();
            const $axios = nuxtApp.$axios;
            try {
                return await $axios.post('auth/reset-password', data);
            } catch (err) {
                console.error('resetPassword error:', err);
                throw err.response;
            }
        }
    },
});

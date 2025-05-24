export default defineNuxtRouteMiddleware(async (to, from) => {
    const blackList = ['/profile']
    const userStore = useUserStore()
    const nuxtApp = useNuxtApp()
    if (to.query.auth) {
        await userStore.logout()
        return navigateTo({
            path: to.query.auth === 'register' ? '/register' : '/',
            query: {
                invite: to.query.id,
                email: to.query.email,
                surname: to.query.surname,
                first_name: to.query.first_name,
                middle_name: to.query.middle_name,
                gender: to.query.gender
            },
        })
    } else if (blackList.includes(to.path) && !userStore.user && !to.query.invite) return navigateTo('/')
    else if (to.path === '/reset-password' && to.query.code && userStore.user) {
        await userStore.logout()
        return
    } else if (to.path !== '/profile' && userStore.user && !to.query.invite) return navigateTo('/profile')
})

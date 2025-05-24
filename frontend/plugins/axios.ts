import axios from 'axios';
import {useUserStore} from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const router = useRouter();

    const instance = axios.create({
        baseURL: config.public.apiBase as string,
    });

    // Добавление интерцепторов запросов
    instance.interceptors.request.use((request) => {
        // Логирование запросов
        if (import.meta.client) console.log('Starting Request', request);

        // Пример добавления токена авторизации
        const userStore = useUserStore()
        if (userStore.user && userStore.user.jwt) {
            request.headers.Authorization = `Bearer ${userStore.user.jwt}`;
        }

        return request;
    }, (error) => {
        // Логирование ошибок запросов
        console.error('Request Error', error);
        return Promise.reject(error);
    });

    // Добавление интерцепторов ответов
    instance.interceptors.response.use((response) => {
        // Логирование ответов
        if (import.meta.client) console.log('Response:', response);
        return response;
    }, (error) => {
        // Логирование ошибок ответов
        console.error('Response Error', error);

        if (error.response) {
            switch (error.response.status) {
                case 404:
                    router.push('/404');
                    break;
                case 500:
                    router.push('/500');
                    break;
                // Можно добавить еще особые ошибки для перехода
            }
        }

        return Promise.reject(error);
    });

    nuxtApp.provide('axios', instance);
});

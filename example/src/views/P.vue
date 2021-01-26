<template>
    <main class="p-1 bg-light">
        <ul class="list">
            <li class="card" v-for="item in list" :key="item.createdAt">
                <a class="card__img" target="_new" :href="base + item.fileURL">
                    <img v-lazy="base + item.fileURL" :alt="base + item.fileURLt" />
                </a>
                <div class="p-1">
                    <h4 class="text-dark">{{ formatTime(item.createdAt) }}</h4>
                    <h5 class="text-dark mt-1">{{ item.host }}</h5>
                    <p class="mt-1 font-6" style="    word-break: break-word;">{{ item.URL.split('/')[item.URL.split('/').length - 1] }}</p>
                    <a class="text-info mt-1 d-block" target="_new" :href="item.URL">查看产品</a>
                </div>
            </li>
        </ul>
    </main>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
export default {
    name: 'P',
    data() {
        return {
            base: 'https://image.afacesocks.com/',
            list: [],
        };
    },

    async mounted() {
        const http = axios.create({
            baseURL: 'https://leancloud.cn:443/1.1/classes/',
            timeout: 1000,
            headers: {
                'X-LC-Id': 'vJNmEEOC7YmjcmMVSYy9RnSk-gzGzoHsz',
                'X-LC-Key': '18Cff63ypKTyKVdzwkUUVH7M',
                'Content-Type': 'application/json',
            },
        });
        const { data } = await http.get('https://leancloud.cn:443/1.1/classes/UploadLog?order=-createdAt&limit=1000');
        this.list = data.results;
    },

    methods: {
        formatTime(time) {
            return dayjs(time).format('YYYY-MM-DD HH:mm');
        },
    },
};
</script>

<style lang="scss">
.list {
    display: flex;
    flex-wrap: wrap;
    > .card {
        background: #fff;
        flex-shrink: 0;
        flex-grow: 1;
        flex-basis: 10%;
        max-width: 100%;
        box-shadow: 1px 2px 8px 2px rgba(#000, 0.1);
        margin-right: 8px;
        margin-bottom: 8px;
        > .card__img {
            background: #ddd;
            display: block;
            width: 100%;
            > img {
                display: block;
                object-fit: contain;
                width: 100%;
                height: 240px;
            }
        }
    }
}
</style>
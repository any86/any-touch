<template>
    <main class="ovh p-1 bg-light">
        <ul class="list">
            <li class="card" v-for="item in list" :key="item.URL">
                <a class="card__img" target="_new" :href="base+item.fileURL">
                    <img :src="base+item.fileURL" :alt="base+item.fileURLt" />
                </a>
                <div class="p-1">
                    <h4 class="text-dark">{{item.createdAt}}</h4>
                    <h5 class="text-dark">{{item.host}}</h5>
                    <a class="text-info" target="_new" :href="item.URL">查看产品</a>
                </div>
            </li>
        </ul>
    </main>
</template>

<script>
import axios from 'axios';
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

        const { data } = await http.get('https://leancloud.cn:443/1.1/classes/UploadLog?order=-createdAt');
        this.list = data.results;
    },
};
</script>

<style lang="scss">
.list {
    display: flex;
    flex-wrap: wrap;
    > .card {
        background: #fff;
        width: 300px;
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

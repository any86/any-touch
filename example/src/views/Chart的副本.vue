<template>
    <main>
        <svg>
            <rect>123</rect>
        </svg>
    </main>
</template>

<script>
import axios from 'axios';
import G6 from '@antv/g6';
export default {
    name: 'Chart',

    data() {
        return {
            data: {},
        };
    },


    mounted() {
        // const data = {
        //     nodes: [{
        //         id: 'node1',
        //         x: 100,
        //         y: 200,
        //         label:'节点1',
        //         deviceId:100,
        //         deviceInof:{},
                
        //     }, {
        //         id: 'node2',
        //         x: 300,
        //         y: 200,
        //         label:'节点2'
        //     }, {
        //         id: 'node3',
        //         x: 500,
        //         y: 400,
        //         label:'节点3'
        //     }],
        //     edges: [{
        //         target: 'node2',
        //         source: 'node1'
        //     },{
        //         target: 'node3',
        //         source: 'node1'
        //     }]
        // };
        // const graph = new G6.Graph({
        //     container: this.$el,
        //     width: 500,
        //     height: 500,
        //     defaultNode: {
        //         shape: 'rect',
        //         style: {
        //             fill: '#fff',
        //             stroke: '#096dd9'
        //         }
        //     },
        //     nodeStateStyles: {
        //         hover: {
        //             lineWidth: 3
        //         },
        //         select: {
        //             lineWidth: 5
        //         }
        //     }
        // });
        // graph.data(data);
        // graph.render();
    },

    methods: {}
};
</script>

<style lang="scss">

</style>

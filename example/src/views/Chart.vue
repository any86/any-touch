<template>
    <main>
        <svg ref="svg" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <!-- <rect class="node" />
            <line
                x1="50"
                y1="60"
                x2="50"
                y2="300"
                style="fill: red; stroke: black; stroke-width: 2"
            />-->
            <text ref="text" x="100" y="100">{{maxWidth}}</text>
            <!-- <g v-for="({title}) in nodes" :key="title">
                <rect x="400" y="300" class="node" />
                <text x="460" y="330" text-anchor="middle" dominant-baseline="middle">{{title}}</text>
            </g> -->
        </svg>
    </main>
</template>

<script>
import axios from 'axios';
const nodes = [
                {
                    title: '顶级菜单和校区',
                    children: [
                        {
                            title: '1-1',
                            children: [{ title: '1-1-1' }, { title: '1-1-2' }]
                        },
                        { 
                            title: '1-2',
                            children: [{ 
                                title: '1-2-1',
                                children: [{ 
                                    title: '1-2-1-1'
                                }]
                            }]
                        }
                    ]
                }
            ]
export default {
    name: 'Chart',

    data() {
        const ITEM_WIDTH = 200;
        const ITEM_HEIGHT = 100;
        const ITEM_MARGIN = 16;
        return {
            ITEM_WIDTH,
            ITEM_HEIGHT,
            ITEM_MARGIN,
            nodes:[],
            maxLength:0,
        };
    },
    
    computed: {
        maxWidth(){
            return this.maxLength * (this.ITEM_WIDTH + 2 * this.ITEM_MARGIN);
        }
    },

    mounted() {
        const l = this.$refs.svg.scrollWidth;
        const array = [nodes];
        let i = 0;
        this.maxLength = nodes.length;
        while(void 0 !== array[i] && 0 < array[i].length){
            this.maxLength = Math.max(this.maxLength, array[i].length);
            for(const node of array[i]){
                const {children} = node;
                
                if(void 0 !== children){
                    array[i+1] = array[i+1] || [];
                    array[i+1].push(...children);
                }
            }
            i++
        }

        this.nodes = array.map(levelNodes=>{
            return levelNodes;
        });
        // 添加定位信息
        for(const nodes of array){
            const {length} = nodes;
            for(let i = length-1;i>=0;i--){
                console.log({i})
            }
        }

    },

    methods: {
        calcTextWidth(text) {
            const ns = 'http://www.w3.org/2000/svg';
            const { body } = document;
            const textNode = document.createElementNS(ns, 'text');
            const svgNode = document.createElementNS(ns, 'svg');
            svgNode.setAttribute('width', 0);
            svgNode.setAttribute('height', 0);
            textNode.innerHTML = text;
            body.appendChild(svgNode);
            svgNode.appendChild(textNode);
            const width = textNode.getComputedTextLength();
            body.removeChild(svgNode);
            return width;
        }
    }
};
</script>

<style scope lang="scss">
main {
    // height:500px;
    // width:500px;
    text {
        //   stroke-width:1;
        fill: #000;
        // stroke:rgb(0,0,0);
    }
    .node {
        fill: transparent;
        stroke-width: 1;
        stroke: rgb(0, 0, 0);
        width: 120px;
        height: 60px;
    }
}
</style>

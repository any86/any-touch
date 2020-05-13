<template>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">
    <g transform="translate(100, 100)">
        <path v-for="linkPath in linkPaths" :key="linkPath" :d="linkPath" class="line" />
    </g>

    <g transform="translate(100, 100)">
        <foreignObject
            v-for="(node,index) in nodes"
            :key="'foreignObject'+index"
            :width="itemWidth"
            :height="itemHeight"
            :x="node.y - itemWidth/2"
            :y="node.x - itemHeight/2"
            @panstart="onPanstart"
            @panmove="onPanmove(index,$event)"
        >
            <body style="padding:8px;" xmlns="http://www.w3.org/1999/xhtml">
                <p class="text">一段需要word wrap的文字。</p>
            </body>
        </foreignObject>
    </g>
</svg>
</template>

<script>
import * as d3 from 'd3';
import Core from '../../../packages/core/dist/index.es.js';
import Pan from '../../../packages/pan/dist/index.es.js';
import { treeChart, dataset } from './draw';
Core.use(Pan, { threshold: 0 });
const pointsGroup = [];
const paths = [];
export default {
    name: 'Draw',

    props: {
        itemWidth: {
            type: Number,
            default: 160
        },
        itemHeight: {
            type: Number,
            default: 100
        }
    },

    data() {
        return {
            nodes: [],
            linkPaths: [],
            tree: {}
        };
    },
    mounted() {
        this.renderTree();
        const at = new Core(this.$el);
        this.$on('hook:destroy', at.destroy);
    },
    methods: {
        renderTree() {
            const width = 1000;
            const height = 1000;
            const svg = d3.select(svg);
            const tree = (data) => {
                const root = d3.hierarchy(data);
                root.dx = 110;
                root.dy = width / (root.height + 1);
                return d3
                    .tree()
                    .separation(function(a, b) {
                        return (a.parent == b.parent ? 2 : 1) / a.depth;
                    })
                    .nodeSize([root.dx, root.dy])(root);
            };

            this.tree = tree(dataset);
            this.updateLink();
            this.nodes = this.tree.descendants();
        },

        updateLink() {
            this.linkPaths = this.tree.links().map((link) => {
                return d3
                    .linkHorizontal()
                    .x((d) => d.y)
                    .y((d) => d.x)(link);
            });
        },

        // https://blog.csdn.net/qq_34414916/article/details/80026029
        // https://www.jianshu.com/p/64305821087a
        // https://github.com/d3/d3-shape/blob/master/src/curve/monotone.js
        onPanstart(ev) {},

        onPanmove(index, ev) {
            const { deltaX, deltaY } = ev;
            this.nodes[index].x += deltaY;
            this.nodes[index].y += deltaX;
            this.updateLink();
        },

        onPanend(ev) {}
    }
};
</script>

<style scope lang="scss">
.line {
    fill: none;
    stroke: rgb(3, 159, 107);
    stroke-width: 1;
}
.circle {
    fill: rgb(3, 159, 107);
}

.text {
    background-color: rgb(3, 159, 107);
    padding: 16px;
    color: #fff;
    box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    cursor:move;
}
</style>
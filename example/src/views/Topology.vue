<template>
<article>
    <header>
        实现基于
        <a target="_new" href="https://github.com/d3/d3">d3</a> /
        <a target="_new" href="https://github.com/vuejs/vue">vue</a> /
        <a target="_new" href="https://github.com/any86/any-touch">any-touch</a>
    </header>

    <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" style="width:100%;">
        <g transform="translate(100, 100)">
            <template v-for="(linkPath, index) in linkPaths">
                <path v-if="linkPath" :key="index" :d="linkPath" class="line" />
            </template>
        </g>

        <g transform="translate(100, 100)">
            <foreignObject
                v-for="(node,index) in nodes"
                v-show="!node.hidden"
                :class="{[`at-${action}`]:activeNode===node}"
                :key="'foreignObject'+index"
                :width="itemWidth"
                :height="itemHeight"
                :x="node.y - itemWidth/2"
                :y="node.x - itemHeight/2"
                @panstart="onPanstart(index,$event)"
                @panmove="onPanmove(index,$event)"
                @panend="onPanend"
                @pancancel="onPanend"
                @tap="onTap(index)"
            >
                <body xmlns="http://www.w3.org/1999/xhtml">
                    <div class="text">
                        <p>节点层级: {{node.depth}}</p>
                        <p>节点顺序: {{index}}</p>
                    </div>
                </body>
            </foreignObject>
        </g>
    </svg>
</article>
</template>

<script>
// import * as d3 from 'd3';
// import Core from '../../../packages/core/dist/index.es.js';
// import Pan from '../../../packages/pan/dist/index.es.js';
// Core.use(Pan, { threshold: 0 });
import {hierarchy, tree} from 'd3-hierarchy'
import {linkHorizontal} from 'd3-shape'
import AnyTouch from '../../../packages/any-touch/dist/any-touch.umd';
import { dataset, animate } from './utils';
// console.log({hierarchy, tree,linkHorizontal,AnyTouch,dataset,animate})
const pointsGroup = [];
const paths = [];
export default {
    name: 'Topology',

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
            tree: {},
            activeNode: null,
            action: ''
        };
    },
    mounted() {
        this.renderTree();
        const at = new AnyTouch(this.$el);
        this.$on('hook:destroy', at.destroy);
    },
    methods: {
        /**
         * 把普通树形变成d3需要的树形
         */
        genTreeData(data) {
            const width = 1000;
            const height = 1000;
            // hierarchy把普通的树形数据变成d3的tree结构,
            // 这样tree就有了d3的方法, 可以通过方法获取子节点(tree.descendants)/父节点/节点数等信息
            const root = hierarchy(data);
            // 遍历子节点,descendants是后代的意思,
            // 但是其实也会包含当前节点本身.
            // 给节点增加hidden字段用来控制当前节点显示/隐藏.
            root.descendants().forEach((node) => {
                node.hidden = false;
            });
            // d3.tree运行后会返回一个函数,
            // 通过函数可以设置图形的一些尺寸(nodeSize)/位置间距(separation)信息
            // 这样在返回的函数中传入刚才输入的d3.tree结构数据, 比如上面的root,
            // 那么拓扑所需的数据就都全了.
            return (
                tree()
                    .separation(function(a, b) {
                        // 同级元素调整间隙比例
                        // 一般就用2:1就好
                        return (a.parent == b.parent ? 2 : 1) / a.depth;
                    })
                    // 节点尺寸
                    .nodeSize([110, width / (root.height + 1)])(root)
            );
        },

        /**
         * 生成节点数组 => [Node, Node]
         * 用来给模板渲染元素
         */
        updateNodes() {
            this.nodes = this.tree.descendants();
        },

        /**
         * 生成线
         */
        updateLinks() {
            // tree.links会根据节点数据生成连线数据
            this.linkPaths = this.tree.links().map((link) => {
                // d.linkHorizontal和上面的d3.tree一样,
                // 可以当做构造函数,
                // 其返回一个函数
                // 可以用函数上的x/y方法指定
                // 由于默认生成tree数据是上下结构的拓扑数据,
                // 所以为了生成左至右的线需要把X/Y数据颠倒
                // 最终生成线数据结构类似这样:{source:{},target:{}}
                if (!link.target.hidden) {
                    return linkHorizontal()
                        .x((d) => d.y)
                        .y((d) => d.x)(link);
                }
            });
        },
        /**
         * 生成所需数据
         */
        renderTree() {
            this.tree = this.genTreeData(dataset);
            this.updateLinks();
            this.updateNodes();
        },

        /**
         * 拖拽开始, 记录当前节点
         */
        onPanstart(index, e) {
            const [item] = this.nodes.splice(index, 1);
            this.nodes.push(item);
            this.activeNode = item;
        },

        /**
         * 拖拽中
         * 变化节点坐标
         * 重新生成连线数据
         */
        onPanmove(index, e) {
            this.action = e.type;
            const { deltaX, deltaY } = e;
            const { length } = this.nodes;
            this.activeNode.x += deltaY;
            this.activeNode.y += deltaX;
            this.updateLinks();
        },

        /**
         * 取消当前节点激活
         */
        onPanend() {
            this.activeNode = null;
        },

        /**
         *
         */
        onTap(index) {
            this.activeNode = this.nodes[index];
            // 当前节点记录是否收起/展开
            if (void 0 === this.activeNode.collapse) {
                this.$set(this.activeNode, 'collapse', true);
            } else {
                this.activeNode.collapse = !this.activeNode.collapse;
            }
            const { x, y, collapse } = this.activeNode;
            // descendants返回的子节点包含自己, 所以排除自己
            const [a, ...childNodes] = this.activeNode.descendants();
            // 根据节点折叠状态来展开/折叠子节点显示
            childNodes.forEach((node) => {
                if (collapse) {
                    const x1 = node.x;
                    const y1 = node.y;
                    // 存储展开时候的位置,
                    // 下次复原位置用
                    node._x = x1;
                    node._y = y1;
                    animate(1, 0, 200, (value, isDone) => {
                        node.x = x - (x - x1) * value;
                        node.y = y - (y - y1) * value;
                        if (isDone) {
                            node.hidden = true;
                        }
                        this.updateLinks();
                    });
                } else {
                    node.hidden = false;
                    // 此处让value从0 - 1在200ms内不停变化
                    // 从而让节点位置变化实现展开收缩动画
                    animate(0, 1, 200, (value) => {
                        node.x = x + (node._x - x) * value;
                        node.y = y + (node._y - y) * value;
                        this.updateLinks();
                    });
                }
            });

            // this.updateNodes();
            // this.updateLinks();
        }
    }
};
</script>

<style scope lang="scss">
header {
    position: sticky;
    width: 100%;
    top: 0;
    left: 0;
    padding: 16px;
    box-shadow:1px 2px 8px rgba(0,0,0,.1);
    a {
        color: #69c;
    }
}
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
    margin: 8px;
    width: 90%;
    padding: 8px;
    text-align: center;
    color: #fff;
    box-shadow: 1px 2px 8px rgba(4, 108, 73, 0.5);
    border-radius: 4px;
    cursor: pointer;
}

foreignObject.at-panmove .text {
    cursor: move;

    background-color: rgb(3, 159, 107, 0.7);
}
</style>
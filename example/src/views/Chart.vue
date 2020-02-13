<template>
    <main id="container"></main>
</template>

<script>
import G6 from '@antv/g6';

import axios from 'axios';

export default {
    name: 'Chart',

    data() {
        return {};
    },

    computed: {
        maxWidth() {
            return this.maxLength * (this.ITEM_WIDTH + 2 * this.ITEM_MARGIN);
        }
    },

    mounted() {
        fetch('chart.json')
            .then((res) => res.json())
            .then((data) => {
                const width = document.getElementById('container').scrollWidth;
                const height = document.getElementById('container').scrollHeight || 500;
                const graph = new G6.TreeGraph({
                    container: 'container',
                    width,
                    height,
                    linkCenter: true,
                    modes: {
                        default: [
                            {
                                type: 'collapse-expand',
                                onChange: function onChange(item, collapsed) {
                                    const data = item.get('model').data;
                                    data.collapsed = collapsed;
                                    return true;
                                }
                            },
                            'drag-canvas',
                            'zoom-canvas'
                        ]
                    },
                    defaultNode: {
                        shape:'rect',
                        size: 26,
                        anchorPoints: [
                            [0, 0.5],
                            [1, 0.5]
                        ],
                        style: {
                            fill: '#c6e5fe',
                            stroke: '#7ba7f9'
                        }
                    },
                    defaultEdge: {
                        type: 'cubic-vertical',
                        style: {
                            stroke: '#a8b5c2'
                        }
                    },
                    layout: {
                        workerEnabled: true,
                        type: 'compactBox',
                        direction: 'TB',
                        nodeSep:100,
                        preventOverlap:true,
                        getId: function getId(d) {
                            return d.id;
                        },
                        getHeight: function getHeight() {
                            return 16;
                        },
                        getWidth: function getWidth() {
                            return 16;
                        },
                        getVGap: function getVGap() {
                            return 80;
                        },
                        getHGap: function getHGap(n) {
                            return 20;
                        }
                    }
                });
                
                graph.on('node:click',ev=>{
                    console.log(ev)
                })

                graph.node(function(node) {
                    let position = 'right';
                    let rotate = 0;
                    if (!node.children) {
                        position = 'bottom';
                        rotate = Math.PI / 3;
                    }
                    return {
                        label: node.name,
                        labelCfg: {
                            position,
                            offset: 5,
                            style: {
                                rotate,
                                textAlign: 'start',
                                fill:"#6f6f6f"
                            }
                        }
                    };
                });

                graph.data(data);
                graph.render();
                graph.fitView();
            });
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

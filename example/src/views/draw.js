import * as d3 from 'd3';
export const dataset = {
    "name": "新中新",
    x:1000,
    y:1000,
    "children": [{
        "name": "第一级",
        "children": [{
            "name": "第二级A",
            "children": [{
                "name": "第三级A",
                "value": 3938
            }, {
                "name": "第三级B",
                "value": 1112
            }, ]
        }, ]
    }]
}

export function treeChart(id, dataset) {
    const width = 900;
    const height = 500;
    const svg = d3
        .select(id)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    const tree = data => {
        const root = d3.hierarchy(data);
        root.dx = 110;
        root.dy = width / (root.height + 1);
        return d3.tree().separation(function(a, b) {
            return (a.parent == b.parent ? 2 : 1) / a.depth;
        }).nodeSize([root.dx, root.dy])(root);
    };

    const root = tree(dataset);
    

    root.links().map(link=>{
        return d3.linkHorizontal().x(d =>d.y).y(d => d.x)(link)
    })



    
    return;


    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
    });
    const g = svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('transform', `translate(${root.dy / 3},${root.dx - x0})`);

    g.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr(
            'd',
            d3
            .linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)
        );

    const node = g
        .append('g')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    node
        .append('circle')
        .attr('fill', d => (d.children ? '#555' : '#999'))
        .attr('r', 2.5);

    node
        .append('text')
        .attr('dy', '0.31em')
        .attr('x', d => (d.children ? -6 : 6))
        .attr('text-anchor', d => (d.children ? 'end' : 'start'))
        .text(d => d.data.name)
        .clone(true)
        .lower()
        .attr('stroke', 'white');
}





export function canvas(canvas) {
    const pointsGroup = [];
    const context = canvas.getContext('2d');
    context.strokeStyle = '#f60';
    context.moveTo(0, 0);
    context.lineTo(300, 300);
    context.stroke();
}


function drawLine(context) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(300, 300);
    context.stroke();
    context.closePath();
}
Vue.component('chart1', {
    template: "<div v-bind:class='classObject'  v-bind:style='{display:show}' :id='\"chart\"+idPlot'>{{msg}}<div :id='idPlot'></div></div>",
    props: {
        getPlot: {type: Function},
        url: {type: String},
        idPlot: {type: String},
        msg: {type: String}
    },
    data: function () {
        return {
            classObject: {
                box1: false,
                box2: true,
                box3: false
            },
            show: 'none',
            index: null,
        }
    },
    methods: {
        chart: function (id = '1', dataInit) {
            var chartDom = document.getElementById(id);
            chartDom.style.width = '100%';
            chartDom.style.height = '100%';
            if (dataInit !== false) {
                this.myChart = echarts.init(chartDom, 'purple-passion');
                this.myChart.clear();

                var data = dataInit

                var titleArr = [], seriesArr = [];
                colors = [['#9b8bba', 'rgba(0, 0, 0, 0)'], ['#e098c7', 'rgba(0, 0, 0, 0)'], ['#8fd3e8', 'rgba(0, 0, 0, 0)'], ['#71669e', 'rgba(0, 0, 0, 0)']]
                data.forEach(function (item, index) {
                    titleArr.push(
                        {
                            text: item.type,
                            left: index * 100 / (data.length) + 12 + '%',
                            top: '65%',
                            textAlign: 'center',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: '16',
                                color: colors[index][0],
                                textAlign: 'center',
                            },
                        }
                    );
                    seriesArr.push(
                        {
                            name: item.type,
                            type: 'pie',
                            clockWise: false,
                            radius: [60, 70],
                            itemStyle: {
                                normal: {
                                    color: colors[index][0],
                                    shadowColor: colors[index][0],
                                    shadowBlur: 0,
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    },
                                }
                            },
                            hoverAnimation: false,
                            center: [index * 100 / data.length + 12 + '%', '40%'],
                            data: [{
                                name: item.name,
                                value: item.value,
                                label: {
                                    normal: {
                                        formatter: function (params) {
                                            return params.value + '%';
                                        },
                                        position: 'center',
                                        show: true,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold',
                                            color: colors[index][0]
                                        }
                                    }
                                },
                            }, {
                                value: 100 - item.value,
                                name: 'invisible',
                                itemStyle: {
                                    normal: {
                                        color: colors[index][1]
                                    },
                                    emphasis: {
                                        color: colors[index][1]
                                    }
                                }
                            }]
                        }
                    )
                });


                var option = {
                    title: titleArr,
                    tooltip: {
                        trigger: 'item',
                        axisPointer: {
                            type: 'shadow'
                        },
                    },
                    series: seriesArr
                }
                this.myChart.setOption(option)
                var that = this
                this.index = this.$parent.pageComponent.length
                if ((this.index + 1) % 2 === 0) {
                    this.classObject.box1 = false;
                    this.classObject.box2 = false;
                    this.classObject.box3 = true;
                } else {
                    this.classObject.box1 = false;
                    this.classObject.box2 = true;
                    this.classObject.box3 = false;
                }
                this.$parent.pageComponent.push(this)
                this.myChart.getZr().on('click', function (params) {
                    that.$emit('trans', that);
                });
            }
        },
    },
    mounted: function () {
        this.getPlot(this.url, this.idPlot, this.chart)
    }
})

Vue.component('chart2', {
    template: "<div v-bind:class='classObject'  v-bind:style='{display:show}' :id='\"chart\"+idPlot'>{{msg}}<div :id='idPlot'></div></div>",
    props: {
        getPlot: {type: Function},
        url: {type: String},
        idPlot: {type: String},
        msg: {type: String}
    },
    data: function () {
        return {
            classObject: {
                box1: false,
                box2: true,
                box3: false
            },
            show: 'none',
            index: null,
        }
    },
    methods: {
        chart: function (id = '2', dataInit) {
            var chartDom = document.getElementById(id);
            chartDom.style.width = '100%';
            chartDom.style.height = '100%';
            if (dataInit !== false) {
                this.myChart = echarts.init(chartDom, 'purple-passion');
                var that = this;

                var columnslist = dataInit['columns']
                var valueList = dataInit['datas']
                var visualmap = [], titles = [], xaxis = [], yaxis = [], grid = [], series = []
                for (let i = 0; i < valueList['names'].length; i++) {
                    visualmap.push({
                        show: false,
                        type: 'continuous',
                        seriesIndex: i,
                        min: 0,
                        max: Math.max(...valueList['datas'][i])
                    })
                    titles.push(
                        {
                            left: 'center',
                            top: 1 / columnslist.length * 100 * i + "%",
                            text: columnslist[i]
                        },
                    )
                    xaxis.push(
                        {
                            data: valueList['names'][i],
                            gridIndex: i
                        }
                    )
                    yaxis.push(
                        {
                            gridIndex: i
                        }
                    )
                    if (columnslist.length === 1) {
                        grid.push(
                            {}
                        )
                    } else {
                        grid.push(
                            {
                                bottom: '60%'
                            },
                            {
                                top: '60%'
                            }
                        )
                    }

                    series.push(
                        {
                            type: 'line',
                            showSymbol: false,
                            data: valueList['datas'][i],
                            xAxisIndex: i,
                            yAxisIndex: i,
                            areaStyle: {
                                opacity: 0.8,
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#e098c7'
                                    },
                                    {
                                        offset: 1,
                                        color: '#9b8bba'
                                    }
                                ])
                            },
                        }
                    )
                }
                option = {
                    // Make gradient line here
                    visualMap: visualmap,
                    title: titles,
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: xaxis,
                    yAxis: yaxis,
                    grid: grid,
                    series: series
                };

                this.myChart.setOption(option)
                this.index = this.$parent.pageComponent.length
                if ((this.index + 1) % 2 === 0) {
                    this.classObject.box1 = false;
                    this.classObject.box2 = false;
                    this.classObject.box3 = true;
                } else {
                    this.classObject.box1 = false;
                    this.classObject.box2 = true;
                    this.classObject.box3 = false;
                }
                this.$parent.pageComponent.push(this)
                this.myChart.getZr().on('click', function (params) {
                    that.$emit('trans', that);
                });
            }
        },
    },
    mounted: function () {
        this.getPlot(this.url, this.idPlot, this.chart)
    }
})

Vue.component('chart3', {
    template: "<div v-bind:class='classObject'  v-bind:style='{display:show}' :id='\"chart\"+idPlot'>{{msg}}<div :id='idPlot'></div></div>",
    props: {
        getPlot: {type: Function},
        url: {type: String},
        idPlot: {type: String},
        msg: {type: String}
    },
    data: function () {
        return {
            classObject: {
                box1: false,
                box2: true,
                box3: false
            },
            index: null,
            show: 'none',
        }
    },
    methods: {
        chart: function (id = '3', dataInit) {
            var chartDom = document.getElementById(id);
            chartDom.style.width = '100%';
            chartDom.style.height = '90%';
            if (dataInit !== false) {
                this.dataSet = dataInit['data'];
                var maxNum = dataInit['maxNum']
                this.myChart = echarts.init(chartDom, 'purple-passion');
                var option;
                var that = this

                option = {
                    backgroundColor: 'rgb(0,0,0,0)',
                    grid3D: {},
                    tooltip: {},
                    xAxis3D: {
                        type: 'category',
                        name: this.dataSet[0][1],
                        nameTextStyle: {
                            color: "#fff",
                            fontSize: 12,
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    yAxis3D: {
                        type: 'category',
                        name: this.dataSet[0][0],
                        nameTextStyle: {
                            color: "#fff",
                            fontSize: 12,
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    zAxis3D: {
                        name: this.dataSet[0][2],
                        nameTextStyle: {
                            color: "#fff",
                            fontSize: 12,
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    visualMap: {
                        max: maxNum,
                        dimension: this.dataSet[0][1]
                    },
                    dataset: {
                        source: this.dataSet
                    },
                    series: [
                        {
                            type: 'bar3D',
                            shading: 'lambert',
                            encode: {
                                x: this.dataSet[0][1],
                                y: this.dataSet[0][0],
                                z: this.dataSet[0][2],
                                tooltip: [0, 1, 2]
                            }
                        }
                    ]
                };

                this.myChart.setOption(option, true);

                this.index = this.$parent.pageComponent.length
                if ((this.index + 1) % 2 === 0) {
                    this.classObject.box1 = false;
                    this.classObject.box2 = false;
                    this.classObject.box3 = true;
                } else {
                    this.classObject.box1 = false;
                    this.classObject.box2 = true;
                    this.classObject.box3 = false;
                }
                this.$parent.pageComponent.push(this)
                try {
                    this.myChart.getZr().on('click', function (params) {
                        that.$emit('trans', that);
                    });
                } catch (error) {
                    console.log(error)
                }
            }
        }
    },
    mounted: function () {
        this.getPlot(this.url, this.idPlot, this.chart)
    }
})

Vue.component('chart4', {
    template: "<div v-bind:class='classObject'  v-bind:style='{display:show}' :id='\"chart\"+idPlot'>{{msg}}<div :id='idPlot'></div></div>",
    props: {
        getPlot: {type: Function},
        url: {type: String},
        idPlot: {type: String},
        msg: {type: String}
    },
    data: function () {
        return {
            classObject: {
                box1: false,
                box2: true,
                box3: false
            },
            index: null,
            show: 'none',
        }
    },
    methods: {
        chart: function (id = '4', dataInit) {
            var chartDom = document.getElementById(id);
            chartDom.style.width = '100%';
            chartDom.style.height = '100%';
            if (dataInit !== false) {
                this.myChart = echarts.init(chartDom, 'purple-passion');

                var img = 'data:image/png;base64,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';
                var trafficWay = dataInit['data']
                var count = dataInit['total']
                var data = [];
                var color = ['#9b8bba', '#e098c7', '#8fd3e8', '#71669e', '#cc70af', '#7cb4cc', '#ff3000']
                var name = [];
                for (let i = 0; i < trafficWay.length; i++) {
                    name.push(trafficWay[i].name);
                }
                for (var i = 0; i < trafficWay.length; i++) {
                    data.push({
                        value: trafficWay[i].value,
                        name: trafficWay[i].name,
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                shadowBlur: 20,
                                borderColor: color[i],
                                shadowColor: color[i]
                            }
                        }
                    }, {
                        value: 2,
                        name: '',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                },
                                color: 'rgba(0, 0, 0, 0)',
                                borderColor: 'rgba(0, 0, 0, 0)',
                                borderWidth: 0
                            }
                        }
                    });
                }
                var seriesOption = [{
                    name: '',
                    type: 'pie',
                    clockWise: false,
                    radius: [105, 109],
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                color: '#ddd',
                                formatter: function (params) {
                                    var total = 0;
                                    for (var i = 0; i < trafficWay.length; i++) {
                                        total += trafficWay[i].value;
                                    }
                                    if (params.name !== '') {
                                        return '列名：' + params.name + '\n' + '\n' + '空值数：' + params.value + '条';
                                    } else {
                                        return '';
                                    }
                                },
                            },
                            labelLine: {
                                length: 30,
                                length2: 100,
                                show: true,
                                color: '#8fd3e8'
                            }
                        }
                    },
                    data: data
                }];
                option = {
                    color: color,
                    title: {
                        text: count + '条',
                        top: '48%',
                        textAlign: "center",
                        left: "49%",
                        textStyle: {
                            color: '#fff',
                            fontSize: 22,
                            fontWeight: '400'
                        }
                    },
                    graphic: {
                        elements: [{
                            type: "image",
                            z: 3,
                            style: {
                                image: img,
                                width: 178,
                                height: 178
                            },
                            left: 'center',
                            top: 'center',
                            position: [100, 100]
                        }]
                    },
                    tooltip: {
                        show: false
                    },
                    legend: {
                        icon: "circle",
                        orient: 'horizontal',
                        // x: 'left',
                        data: name,
                        right: 340,
                        bottom: 150,
                        align: 'right',
                        textStyle: {
                            color: "#fff"
                        },
                        itemGap: 20
                    },
                    toolbox: {
                        show: false
                    },
                    series: seriesOption
                }
                this.myChart.setOption(option);
                var that = this
                this.index = this.$parent.pageComponent.length
                if ((this.index + 1) % 2 === 0) {
                    this.classObject.box1 = false;
                    this.classObject.box2 = false;
                    this.classObject.box3 = true;
                } else {
                    this.classObject.box1 = false;
                    this.classObject.box2 = true;
                    this.classObject.box3 = false;
                }
                this.$parent.pageComponent.push(this)
                this.myChart.getZr().on('click', function (params) {
                    that.$emit('trans', that);
                });
            }
        }
    },
    mounted: function () {
        this.getPlot(this.url, this.idPlot, this.chart)
    }
})

Vue.component('chart5', {
    template: "<div v-bind:class='classObject'  v-bind:style='{display:show}' :id='\"chart\"+idPlot'>{{msg}}<div :id='idPlot'></div></div>",
    props: {
        getPlot: {type: Function},
        url: {type: String},
        idPlot: {type: String},
        msg: {type: String}
    },
    data: function () {
        return {
            classObject: {
                box1: false,
                box2: true,
                box3: false
            },
            index: null,
            show: 'none',
        }
    },
    methods: {
        chart: function (id = '5', dataInit) {
            var chartDom = document.getElementById(id);
            chartDom.style.width = '100%';
            chartDom.style.height = '90%';
            if (dataInit !== false) {
                this.myChart = echarts.init(chartDom, 'purple-passion');

                var data = dataInit

                option = {
                    dataset: [
                        {
                            source: data
                        },
                        {
                            transform: {type: 'boxplot'}
                        }
                    ],
                    tooltip: {
                        trigger: 'item',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '10%',
                        top: '20%',
                        right: '10%',
                        bottom: '15%'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        nameGap: 30,
                        splitArea: {
                            show: true
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: 'Value',
                        splitArea: {
                            show: false
                        }
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            start: 2,
                            end: data.length * 10
                        },
                        {
                            show: true,
                            type: 'slider',
                            top: '90%',
                            xAxisIndex: [0],
                            start: 2,
                            end: data.length * 10
                        }
                    ],
                    series: [
                        {
                            name: 'category',
                            type: 'boxplot',
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#e098c7'
                                }, {
                                    offset: 1,
                                    color: '#8fd3e8'
                                }]),
                                borderWidth: 1,
                                borderColor: '#e098c7',
                            },
                            datasetIndex: 0
                        }
                    ]
                };
                this.myChart.setOption(option);
                var that = this
                this.index = this.$parent.pageComponent.length
                if ((this.index + 1) % 2 === 0) {
                    this.classObject.box1 = false;
                    this.classObject.box2 = false;
                    this.classObject.box3 = true;
                } else {
                    this.classObject.box1 = false;
                    this.classObject.box2 = true;
                    this.classObject.box3 = false;
                }
                this.$parent.pageComponent.push(this)
                this.myChart.getZr().on('click', function (params) {
                    that.$emit('trans', that);
                });
            }
        }
    },
    mounted: function () {
        this.getPlot(this.url, this.idPlot, this.chart)
    }
})

Vue.component('chart6', {
    template: "<div v-bind:class='classObject'  v-bind:style='{display:show}' :id='\"chart\"+idPlot'>{{msg}}<div :id='idPlot'></div></div>",
    props: {
        getPlot: {type: Function},
        url: {type: String},
        idPlot: {type: String},
        msg: {type: String}
    },
    data: function () {
        return {
            classObject: {
                box1: false,
                box2: true,
                box3: false
            },
            index: null,
            show: 'none',
        }
    },
    methods: {
        chart: function (id = '6', dataInit) {
            var chartDom = document.getElementById(id);
            chartDom.style.width = '100%';
            chartDom.style.height = '90%';

            if (dataInit !== false) {
                this.myChart = echarts.init(chartDom, 'purple-passion');
                var data = dataInit['data']
                var parallelAxis = dataInit['parallelAxis']
                var groupCategories = dataInit['groups']
                var groupName = dataInit['groupName']
                var groupDim = dataInit['groupDim']


                var groupColors = [];
                var hStep = Math.round(300 / (groupCategories.length - 1));
                for (var i = 0; i < groupCategories.length; i++) {
                    groupColors.push(echarts.color.modifyHSL('#e098c7', hStep * i));
                }

                function getOption(data) {
                    var lineStyle = {
                        width: 0.5,
                        opacity: 0.05
                    };
                    return {
                        tooltip: {
                            padding: 10,
                            backgroundColor: '#222',
                            borderColor: '#777',
                            borderWidth: 1
                        },
                        title: [
                            {
                                text: groupName,
                                top: 0,
                                left: 0,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        ],
                        visualMap: {
                            show: true,
                            type: 'piecewise',
                            categories: groupCategories,
                            dimension: groupDim,
                            inRange: {
                                color: groupColors
                            },
                            outOfRange: {
                                color: ['#ccc']
                            },
                            top: 20,
                            textStyle: {
                                color: '#fff'
                            },
                            realtime: false
                        },
                        parallelAxis: parallelAxis,
                        parallel: {
                            left: 280,
                            top: 20,
                            // top: 150,
                            // height: 300,
                            width: 400,
                            layout: 'vertical',
                            parallelAxisDefault: {
                                type: 'value',
                                name: 'nutrients',
                                nameLocation: 'end',
                                nameGap: 20,
                                nameTextStyle: {
                                    color: '#fff',
                                    fontSize: 14
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#aaa'
                                    }
                                },
                                axisTick: {
                                    lineStyle: {
                                        color: '#777'
                                    }
                                },
                                splitLine: {
                                    show: false
                                },
                                axisLabel: {
                                    color: '#fff'
                                },
                                realtime: false
                            }
                        },
                        animation: false,
                        series: [
                            {
                                name: "Group",
                                type: 'parallel',
                                lineStyle: lineStyle,
                                inactiveOpacity: 0,
                                activeOpacity: 0.01,
                                progressive: 500,
                                smooth: true,
                                data: data
                            }
                        ]
                    };
                }

                this.myChart.setOption((option = getOption(data)));
                var that = this
                this.index = this.$parent.pageComponent.length
                if ((this.index + 1) % 2 === 0) {
                    this.classObject.box1 = false;
                    this.classObject.box2 = false;
                    this.classObject.box3 = true;
                } else {
                    this.classObject.box1 = false;
                    this.classObject.box2 = true;
                    this.classObject.box3 = false;
                }
                this.$parent.pageComponent.push(this)
                this.myChart.getZr().on('click', function (params) {
                    that.$emit('trans', that);
                });
            }

        }
    },
    mounted: function () {
        this.getPlot(this.url, this.idPlot, this.chart)
    }
})

Vue.component('chart7', {
    template: "<div v-bind:class='classObject'  v-bind:style='{display:show}' :id='\"chart\"+idPlot'>{{msg}}<div :id='idPlot'></div></div>",
    props: {
        getPlot: {type: Function},
        url: {type: String},
        idPlot: {type: String},
        msg: {type: String}
    },
    data: function () {
        return {
            classObject: {
                box1: false,
                box2: true,
                box3: false
            },
            index: null,
            show: 'none',
        }
    },
    methods: {
        chart: function (id = '7', dataInit) {
            var chartDom = document.getElementById(id);
            chartDom.style.width = '100%';
            chartDom.style.height = '90%';

            if (dataInit !== false) {
                this.myChart = echarts.init(chartDom, 'purple-passion');
                var data = dataInit['data']
                var columnNames = dataInit['columns']
                var xName = dataInit['xName']
                var xData = dataInit['xData']

                var series = []
                var selected = {}
                for (let i = 0; i < data.length; i++) {
                    series.push({
                        name: columnNames[i],
                        type: 'line',
                        stack: 'Total',
                        data: data[i]
                    })
                    if (i===0){
                        selected[[columnNames[i]]]=true
                    }else
                    {
                        selected[[columnNames[i]]]=false
                    }

                }
                console.log(selected)
                option = {
                    title: {
                        text: xName
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: columnNames,
                        selected:selected
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        name: xName,
                        type: 'category',
                        boundaryGap: false,
                        data: xData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series:series
                };

                this.myChart.setOption(option);
                var that = this
                this.index = this.$parent.pageComponent.length
                if ((this.index + 1) % 2 === 0) {
                    this.classObject.box1 = false;
                    this.classObject.box2 = false;
                    this.classObject.box3 = true;
                } else {
                    this.classObject.box1 = false;
                    this.classObject.box2 = true;
                    this.classObject.box3 = false;
                }
                this.$parent.pageComponent.push(this)
                this.myChart.getZr().on('click', function (params) {
                    that.$emit('trans', that);
                });
            }

        }
    },
    mounted: function () {
        this.getPlot(this.url, this.idPlot, this.chart)
    }
})
var body = new Vue(
    {
        el: "#main",
        data: {
            show: {"dom": ''},
            pageComponent: [],
            showComponentIndex: [],
        },
        methods: {
            handleAvatarSuccess(){
                window.location.href="http://127.0.0.1:5000/";
            },
            getPlot(url, id, fun) {
                axios.get(url)
                    .then(response => (
                        fun(id, eval(response.data))
                    ))
                    .catch(error => console.log(error))
            },
            async transform(childComponent) {
                function sleep(time) {
                    return new Promise((resolve) => setTimeout(resolve, time));
                }

                var box1 = this.show.dom
                var id = childComponent.$el.id
                for (let box1Key in box1) {
                    if (box1Key !== id) {
                        var chart = childComponent.$el;
                        var box1Object = box1[box1Key]
                        var targetY = box1Object.$el.offsetTop;
                        var targetX = box1Object.$el.offsetLeft;
                        var sourceY = chart.offsetTop;
                        var sourceX = chart.offsetLeft;

                        tembox1 = childComponent.classObject.box1
                        tembox2 = childComponent.classObject.box2
                        tembox3 = childComponent.classObject.box3
                        childComponent.classObject.box1 = box1Object.classObject.box1;
                        childComponent.classObject.box2 = box1Object.classObject.box2;
                        childComponent.classObject.box3 = box1Object.classObject.box3;

                        $('#' + id).animate({top: targetY + 'px', left: targetX + 'px'})
                        await sleep(10).then(() => {
                            childComponent.myChart.resize();
                        })

                        var i = this.showComponentIndex.indexOf(childComponent)
                        this.showComponentIndex[i] = box1Object

                        box1Object.classObject.box1 = tembox1;
                        box1Object.classObject.box2 = tembox2;
                        box1Object.classObject.box3 = tembox3;
                        $('#' + box1Object.$el.id).animate({top: sourceY + 'px', left: sourceX + 'px'})

                        await sleep(10).then(() => {
                            box1Object.myChart.resize();
                        })
                        childComponent.$parent.pageComponent[childComponent.index] = box1Object
                        box1Object.index = childComponent.index
                        childComponent.index = -1
                        childComponent.$parent.show.dom = {id: childComponent}
                    }
                }
            },
            async handleCurrentChange(val) {
                var currentPageBoxIndex = (val - 1) * 2;
                var pageNum = Math.ceil(this.pageComponent.length / 2)
                var lastPageSize = this.pageComponent.length % 2
                var pageSize = 2
                var box
                var length = this.showComponentIndex.length
                for (let i = 0; i < length; i++) {
                    outBox = this.showComponentIndex.pop()
                    $('#' + outBox.$el.id).fadeOut();
                }

                function sleep(time) {
                    return new Promise((resolve) => setTimeout(resolve, time));
                }

                if (val === 1) {
                    for (let i = currentPageBoxIndex; i < currentPageBoxIndex + pageSize; i++) {
                        box = this.pageComponent[i];
                        $('#' + box.$el.id).fadeIn();
                        this.showComponentIndex.push(box)
                        await sleep(10).then(() => {
                            box.myChart.resize();
                        })
                    }
                } else if (val === pageNum) {
                    if (lastPageSize !== 0) {
                        for (let i = currentPageBoxIndex; i < currentPageBoxIndex + lastPageSize; i++) {
                            box = this.pageComponent[i];
                            $('#' + box.$el.id).fadeIn();
                            this.showComponentIndex.push(box)
                            await sleep(10).then(() => {
                                box.myChart.resize();
                            })
                        }
                    } else {
                        for (let i = currentPageBoxIndex; i < currentPageBoxIndex + pageSize; i++) {
                            box = this.pageComponent[i];
                            $('#' + box.$el.id).fadeIn();
                            this.showComponentIndex.push(box)
                            await sleep(10).then(() => {
                                box.myChart.resize();
                            })
                        }
                    }
                } else {
                    for (let i = currentPageBoxIndex; i < currentPageBoxIndex + pageSize; i++) {
                        box = this.pageComponent[i];
                        $('#' + box.$el.id).fadeIn();
                        this.showComponentIndex.push(box)
                        await sleep(10).then(() => {
                            box.myChart.resize();
                        })
                    }
                }

            },
            showInit: function () {
                var bigChart = this.pageComponent.pop()
                this.show.dom = {id: bigChart}
                var box1 = this.show.dom
                for (let showKey in box1) {
                    box1[showKey].classObject.box1 = true;
                    box1[showKey].classObject.box2 = false;
                    box1[showKey].classObject.box3 = false;
                    box1[showKey].show = '';
                    box1[showKey].index = -1;
                    setTimeout(function () {
                        box1[showKey].myChart.resize();
                    }, 20)
                }
                var box2 = this.pageComponent[0];
                var box3 = this.pageComponent[1];
                box2.classObject.box1 = false;
                box2.classObject.box2 = true;
                box2.classObject.box3 = false;
                box2.show = '';
                this.showComponentIndex.push(box2)
                setTimeout(function () {
                    box2.myChart.resize();
                }, 20)

                box3.classObject.box1 = false;
                box3.classObject.box2 = false;
                box3.classObject.box3 = true;
                box3.show = '';
                this.showComponentIndex.push(box3)
                setTimeout(function () {
                    box3.myChart.resize();
                }, 20)
                this.load.close();
            },
        },
        mounted: function () {
            if(this.$refs.upload !== undefined){
                var that = this
                this.load = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                t = setTimeout(init, 20)
                function init() {
                    clearTimeout(t);
                    if (that.pageComponent.length >= 3) {
                        that.showInit();
                    } else {
                        t = setTimeout(init, 20);
                    }
                }
            }
        }
    }
)
<template>
    <div style="margin-bottom:20px">
        <el-button size="small" @click="add(editableTabsvalue)">新增</el-button>
    </div>
    <el-tabs ref="tabs" v-model="editableTabsvalue" type="card" closable @tab-remove="removeTab">
        <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
            <canvas ref="canvas" :width="canvasWidth" height="400">
            </canvas>

            <div class="toolbar">
                <el-radio-group v-model="item.mode" class="tools" @change="canvasDraw(index)">
                    <el-radio-button label="pen">画笔</el-radio-button>
                    <el-radio-button label="eraser">橡皮檫</el-radio-button>
                    <el-radio-button label="rect">矩形</el-radio-button>
                    <el-radio-button label="select">选择</el-radio-button>
                </el-radio-group>
                <div>
                    <template v-if="item.mode === 'pen'">
                        <el-color-picker v-model="item.color" show-alpha :predefine='checkColors' />
                        <el-select v-model="item.lineWidth">
                            <!-- key -->
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </div>

                <div>
                    <el-button @click="removeTab(index,)">清屏</el-button>
                    <el-button @click="rename(index)">重命名</el-button>
                </div>

            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { fabric } from 'fabric'
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'
import eraser from '@/assets/img/eraser.png'
import pen from '@/assets/img/pen.png'
import "fabric/src/mixins/eraser_brush.mixin.js"
import {    } from 'vue'

export default {
    data() {
        return {
            cursors: {
                eraser,
                pen,
            },
            canvasWidth: 0,
            canvasHeight: 400,
            with: 0,
            height: 0,
            //value是个存储数据
            options: [
                { value: 10, label: '粗' },
                { value: 1, label: '细1' },
                { value: 3, label: '细2' },
            ],
            editableTabsvalue: 1,
            tabIndex: 1,
            editableTabs: [
                { title: '白板1', name: 1, color: '#000000', mode: 'pen', lineWidth: 3, },
            ],
            checkColors: ['#ff4500', '#ff8c00', '#ffd700', '#ff0000', '#00ff00', '#0000ff',],
            newArray: [],
            isDraw: false,
            beginPoint: null,
        }

    },
    methods: {
        init() {
            this.canvasWidth = this.$refs.tabs.$el.getBoundingClientRect().width
        },
        async cls(index) {
            try {
                await ElMessageBox.confirm('确认要删除吗？', '请确认', { type: 'warning' })
                const canvas = this.$refs.canvas[index]
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            } catch (error) {

            }
        },
        changeTool(idx, mode) {
            this.editableTabs[idx].mode = mode
        },
        changeColor(idx, color) {
            this.editableTabs[idx].color = color
        },
        async add() {
            try {
                const newTabName = `${++this.tabIndex}`
                const { value } = await ElMessageBox.prompt('确认要添加吗？', '请确认',
                    { inputValue: `白板${newTabName}` })

                this.editableTabs.push({
                    title: value,
                    name: newTabName,
                    color: '#000000',
                    mode: 'pen',
                    lineWidth: 3,

                })
                this.editableTabsvalue = newTabName
                this.$nextTick(() => {
                    this.canvasDraw(this.editableTabs.length - 1)
                })
            } catch (error) {

            }
        },
        async removeTab(index) {
            try {
                await ElMessageBox.confirm('确认要删除吗？', '请确认', { type: 'warning' })

                const canvas = this.editableTabs[index].canvas
                // canvas.clear()
                let children = canvas.getObjects()
                if (children.length > 0) {
                    canvas.remove(...children)
                }

                // const index = this.editableTabs.findIndex(item => item.name === name)
                // this.editableTabs.splice(index, 1)
                // if (name !== this.editableTabsvalue) return
                // if (index) {
                //     this.editableTabsvalue = this.editableTabs[index - 1].name
                // } else {
                //     this.editableTabsvalue = this.editableTabs[0].name
                // }
            } catch (error) {
            }
        },
        // handleMouse(event, idx) {
        //     const ctx = event.target.getContext('2d')
        //     const { offsetX: startX, offsetY: startY } = event
        //     ctx.beginPath()
        //     ctx.moveTo(startX, startY)

        //     const pencil = this.editableTabs[idx]
        //     if (this.editableTabs[idx].mode === 'pen') {
        //         ctx.lineWidth = pencil.lineWidth
        //         ctx.strokeStyle = pencil.color

        //     } else {
        //         ctx.lineWidth = 30
        //         ctx.strokeStyle = '#ffffff'
        //     }

        //     ctx.lineCap = 'round'
        //     ctx.lineJoin = 'round'
        //     document.onmousemove = (event) => {
        //         const { offsetX: endX, offsetY: endY } = event
        //         ctx.lineTo(endX, endY)
        //         ctx.stroke()
        //     }
        //     document.onmouseup = () => {
        //         ctx.closePath()
        //         document.onmousemove = null
        //         document.onmouseup = null
        //     }
        // },
        async rename(index) {
            try {
                const { value } = await ElMessageBox.prompt('重命名白板', '重命名')
                this.editableTabs[index].title = value
            } catch (error) {

            }
        },
        canvasDraw(index) {
            const canvas = this.getCanvas(index)

            if (this.editableTabs[index].mode === 'pen') {
                canvas.isDrawingMode = true
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
                canvas.freeDrawingBrush.width = this.editableTabs[index].lineWidth
            } else if (this.editableTabs[index].mode === 'eraser') {
                canvas.isDrawingMode = true
                canvas.freeDrawingBrush = new fabric.EraserBrush(canvas)
                canvas.freeDrawingBrush.width = 12
            } else if (this.editableTabs[index].mode === 'rect') {
                canvas.isDrawingMode = false
            }

        },
        getCanvas(index) {
            const board = this.editableTabs[index]
            let canvas = board.canvas
            if (!canvas) {
                const el = this.$refs.canvas[index]
                canvas = new fabric.Canvas(el)
                board.canvas =  markRaw(canvas)
                if (board.mode === 'rect') {
                    // canvas
                }
                let startX, startY
                canvas.on('mouse:down', e => {
                    if (board.mode === 'rect') {
                        canvas.isDrawingMode = false
                        const { x, y } = e.absolutePointer
                        startX = x
                        startY = y
                    }
                })
                canvas.on('mouse:up', e => {
                    if (board.mode === 'rect') {
                        const { x, y } = e.absolutePointer
                        const rect = new fabric.Rect({
                            fill: board.color,
                            top: startY,
                            left: startX,
                            width: Math.abs(x - startX),
                            height: Math.abs(y - startY),
                        })
                        canvas.add(rect)
                    }
                })
            }
            return canvas
        },
        drawRectangle() {

        },
    },
    mounted() {
        this.init()
        window.addEventListener('resize', () => this.init())
        this.$nextTick(() => {
            this.canvasDraw(0)
        })


        //      const el =this.$refs.canvas[0]
        //    const canvas= new fabric.Canvas(el)
        //    canvas.setDimensions({ width: this.canvasWidth, height: this.canvasHeight })
        //    const circle1 = new fabric.Circle({
        //        radius:40,
        //        fill:'#ff0000',
        //        top:100,
        //        left:100 
        //    circle.isDrawingMode = true
        // canvas.centerObject(circle)

        // console.log(canvas.getObjects())

        //    const c2 = new fabric.Canvas(el)
        //    console.log(canvas.toDataURL())
    }
}
</script>

<style scoped>
.toolbar {
    display: flex;
    justify-content: space-between;
}

.tools {
    margin-right: 24px;
}
</style>
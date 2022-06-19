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
                    <el-radio-button label="text">文本</el-radio-button>
                </el-radio-group>
                <div>
                   
                        <el-color-picker v-if="['pen','rect','text'].includes(item.mode)" v-model="item.color" show-alpha :predefine='checkColors'
                            @change="canvasDraw(index)" />
                        <el-select v-if="item.mode === 'pen' " v-model="item.lineWidth" @change="canvasDraw(index)">
                            <!-- key -->
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                   
                </div>

                <div>
                    <el-button @click="undo(index)">撤销</el-button>
                    <el-button @click="removeTab(index,)">清屏</el-button>
                    <el-button @click="deleteObject(index)">删除</el-button>
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
import { markRaw } from 'vue'
import 'fabric-history'

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
            this.$nextTick(() => {
                this.editableTabs.forEach((item, index) => {
                    const canvas = this.getCanvas(index)
                    canvas.setWidth(this.canvasWidth)
                })
            })

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
                console.log(children);
                if (children.length > 0) {
                    canvas.remove(...children)
                }
            } catch (error) {
            }
        },

        deleteObject(index) {
            const canvas = this.getCanvas(index)
            const selected = canvas.getActiveObjects()
            canvas.remove(...selected)
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
            const box = this.editableTabs[index]
            const { mode } = box
            if (mode === 'pen') {
                canvas.isDrawingMode = true
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
                canvas.freeDrawingBrush.width = box.lineWidth
                canvas.freeDrawingBrush.color = box.color
                canvas.skipTargetFind = true
                fabric.Object.prototype.selectable = true
            } else if (mode === 'eraser') {
                canvas.isDrawingMode = true
                canvas.freeDrawingBrush = new fabric.EraserBrush(canvas)
                canvas.freeDrawingBrush.width = 12
                canvas.skipTargetFind = false
                fabric.Object.prototype.selectable = true
            } else if (mode === 'rect') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = true
                fabric.Object.prototype.selectable = false
            } else if (mode === 'select') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = false
                fabric.Object.prototype.selectable = true
            } else if (mode === 'text') {
                canvas.isDrawingMode = false
                canvas.skipTargetFind = false
                fabric.Object.prototype.selectable = true
            }
        },
        undo(index){
            const canvas = this.getCanvas(index)
            canvas.undo()
        },
        getCanvas(index) {
            const board = this.editableTabs[index]
            let canvas = board.canvas
            if (!canvas) {
                const el = this.$refs.canvas[index]
                canvas = new fabric.Canvas(el)
                board.canvas = markRaw(canvas)
                let startX, startY
                canvas.on('mouse:down', e => {
                    startX = e.absolutePointer.x
                    startY = e.absolutePointer.y
                    if (board.mode === 'rect') {
                        canvas.isDrawingMode = false
                        canvas.selectionColor = 'transparent'
                        canvas.selectionBorderColor = board.color
                    }
                    if (board.mode === 'text') {
                        if (!e.target || !e.target.text) {
                            const text = new fabric.Textbox('', {
                                stroke:'rgba(0,0,0,0.25)',
                                fill: board.color,
                                width:50,
                                top:startY - 8,
                                left:startX,
                                fontSize: 16,
                                lineHeight: 1,
                                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                            })
                            canvas.add(text)
                            text.enterEditing()
                        }
                    }
                })
                canvas.on('mouse:up', e => {
                    if (board.mode === 'rect') {
                        const { x: endX, y: endY } = e.absolutePointer
                        const tempW = Math.abs(endX - startX)
                        const tempH = Math.abs(endY - startY)
                        if (tempW > 3 && tempH > 3) {
                            const rect = new fabric.Rect({
                                fill: 'transparent',
                                stroke: board.color,
                                storkeWidth: 3,
                                top: Math.min(startY, endY),
                                left: Math.min(startX, endX),
                                width: tempW - 3,
                                height: tempH - 3,
                            })

                            canvas.add(rect)
                        }
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
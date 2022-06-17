<template>
    <div class="common-layout">
        <div>
            <span>类型
                <el-select v-model="value" placeholder="类型">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <span class="second">开始日期
                <el-date-picker v-model="value1" type="date">
                </el-date-picker>
            </span>
            <el-button type="success">查询</el-button>
        </div>
        <div>
            <el-button type="primary" @click="isAdd=true;dialogVisible = true" class="primary">添加</el-button>
            <el-button type="primary" class="primary" @click="shanchu()" :disabled="pickOn">批量删除</el-button>
        </div>
        <div>
            <el-table table-layout="auto" :data="tableData" border style="width:100%" @selection-change="handleSelects">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="num" label="序号"></el-table-column>
                <el-table-column label="面壁者">
                    <template #default="{ row }">
                        <div class="userPhoto">
                            <el-image class="picture" style="width:25px;height:25px" :src="row.url"
                                :preview-src-list='[row.url]' :initial-index="1" fit="cover" preview-teleported />
                            <span>{{ row.name }}</span>
                            <span>({{ row.nick }})</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template #default="{ row }">
                        {{ row.genre === 1 ? "线上" : "线下" }}
                    </template>
                </el-table-column>
                <el-table-column prop="data" label="开始日期"></el-table-column>
                <el-table-column prop="grade" label="等级"></el-table-column>
                <el-table-column prop="growth" label="成长值"></el-table-column>
                <el-table-column prop="medal" label="成就勋章"></el-table-column>
                <el-table-column label="操作" :width="140">
                    <template #default="{ row }">
                        <!-- {{ scope.$index }} -->
                        <!-- 先拿到表单的数据，在保存到Data里，然后在显示出来，编辑 -->
                        <el-button size="small" type="primary" @click="handleEdit(row)">edit
                        </el-button>
                        <el-button @click="deleteDelete(row.id)" size="small" type="danger">del
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="page">
            <el-pagination small background layout="prev, pager, next" :total="50"  />
        </div>
        <el-dialog v-model="dialogVisible" :title="`${dioText}信息`" width="30%" @closed="handleClosed">
            <el-form :model="form" ref="Add" :rules="rules">
                <el-form-item prop="name" label="面壁者" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="genre" label="类型" :label-width="formLabelWidth">
                    <el-select v-model="form.genre" placeholder="请选择" autocomplete="off">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="data" label="开始日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.data" type="date" autocomplete="off"></el-date-picker>
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="handleSubmit">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <router-view />
</template>

<script>
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'
export default {
    data() {
        return {
            ab: [],
            activeIndex: '1',
            value: '',
            value1: new Date(),
            dialogVisible: false,
            formLabelWidth: '100px',
            isAdd: null,
            options: [
                { value: '', label: '全部' },
                { value: 1, label: '线上' },
                { value: 2, label: '线下' },
            ],
            tableData: [
                {
                    id: 1, data: '2022-04-18', grade: 1, growth: 1000, medal: '', num: 1,
                    name: '华晨', genre: 2, url: '../public/touxiang.jpeg', nick: '晨哥'
                },
                {
                    id: 2, data: '2022-04-19', grade: 2, growth: 1000, medal: '', num: 2,
                    name: '小美', genre: 1, url: '../public/nvsheng.jpeg', nick: '妹子'
                },
                {
                    id: 3, data: '2022-04-20', grade: 3, growth: 1000, medal: '', num: 3,
                    name: '哆啦A梦', genre: 1, url: '../public/donman.jpeg', nick: '机器猫'
                },
                {
                    id: 4, data: '2022-04-21', grade: 4, growth: 1000, medal: '', num: 4,
                    name: '华晨', genre: 2, url: '../public/touxiang.jpeg', nick: '啊龙'
                }
            ],
            form: this.getForm(),
            rules: {
                name: [
                    { required: true, message: "请输入名字", trigger: 'blur' },
                ],
                data: [
                    { required: true, message: "请填写日期", trigger: 'blur' },
                ],
                genre: [
                    { required: true, message: "请选择类型", trigger: 'blur' }, 
                ],

            },
        }
    },
    computed: {
        pickOn() {
            return !(this.ab.length)
        },
        dioText(){
            return this.isAdd ? '添加': '编辑'
        }
        // bb() {
        //     const { path } = this.$route
        //     if (path === '/pg') {
        //         return ['2']
        //     } else {
        //         return []
        //     }
        // }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleSubmit() {
            this.$refs.Add.validate((valid) => {
                console.log(valid);
                if (valid) {
                    if (this.isAdd) {
                        this.tableData.unshift({
                            ...this.form,
                            data: this.formatDate(this.form.data),
                        })
                    } else {
                        //  this.form.data = this.formatDate(this.form.data)
                    }
                    this.dialogVisible = false
                }
            })
        },
        handleEdit(scope) {
            this.isAdd = false
            this.form = scope
            this.dialogVisible = true
        },
        async deleteDelete(id) {
            try {
                await ElMessageBox.confirm('确认要删除吗？', '请确认', { type: 'warning' })
                const index = this.tableData.findIndex(item => item.id === id)
                this.tableData.splice(index, 1)
            } catch (error) {

            }
        },
        async shanchu() {
            try {
                await ElMessageBox.confirm('确认要删除吗？', '请确认', { type: 'warning' })
                for (let item of this.ab) {
                    const index = this.tableData.findIndex(u => u.id === item.id)
                    this.tableData.splice(index, 1)
                }
            } catch (error) {

            }
        },
        handleSelects(items) {
            this.ab = items
        },
        formatDate(date) {
            let y = date.getFullYear()
            let m = String(date.getMonth() + 1).padStart(2, '0')
            let d = String(date.getDate()).padStart(2, '0')
            return `${y}-${m}-${d}`
            //    date vs data
            // new Date()
            // date.getFullYear() date.getMonth()
            // 函数参数 => 返回
        },
        handleClosed(){
            this.form = this.getForm()
            this.$refs.Add.clearValidate()
        },
        getForm() {
            return {
                num: '',
                name: '',
                data: '',
                grade: '',
                growth: '',
                medal: '',
                genre: '',
            }
        },
    }
}
</script>

<style scoped>
.second {
    margin: 0 20px;
}


.primary {
    margin: 10px;
}

.page {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
}

.userPhoto {
    display: flex;
    align-items: center;
}

.picture {
    margin-right: 10px;
}
</style>
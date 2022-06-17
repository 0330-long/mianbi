<template>

    <el-container class="bassBox">
        <el-header class="header">
            <h1>面壁计划</h1>
            <el-menu mode="horizontal" :ellipsis="false" @select="handleSelect">
                <el-menu-item index="2">
                    <el-icon>
                        <ChatRound />
                    </el-icon>
                    <span>消息</span>
                </el-menu-item>
                <el-sub-menu index="1">
                    <template #title>
                        <el-avatar class="photo" :src="url" :size="30"></el-avatar>
                        <span>张三</span>
                    </template>
                    <el-menu-item index="1-0">个人用户</el-menu-item>
                    <el-menu-item index="1-1">设置</el-menu-item>
                    <el-menu-item @click="run" index="1-2">退出</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <!-- $route -->
                <el-menu router :default-active="activeActive" class="el-menu-vertical-demo" @open="handleOpen"
                    @close="handleClose">
                    <el-menu-item index="1">
                        <el-icon>
                            <HomeFilled />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <User />
                            </el-icon>
                            <span>面壁者</span>
                        </template>
                        <el-menu-item index="/base/page1">面壁者列表</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <List />
                            </el-icon>
                            <span>题库</span>
                        </template>
                        <el-menu-item index="3-0">题目管理</el-menu-item>
                        <el-menu-item index="3-1">答题</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="4">
                        <template #title>
                            <span>教学工具</span>
                        </template>
                        <el-menu-item index="/base/TabulaRasa">白板</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>
import { Edit, User, ChatRound, HomeFilled, List } from '@element-plus/icons-vue'
export default {
    components: {
        Edit, User, ChatRound, HomeFilled, List
    },
    data() {
        return {

            value: '',
            value1: '',
            size: '' | 'large' | 'small' > (''),
            fits: 'fill',
            url: 'https://img2.baidu.com/it/u=616073550,3510332021&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        }
    },
    // 给Menu 设置一个router,设置index为唯一路径，高亮设置相对应的路径
    computed: {
        activeActive() {
            return this.$route.path
        },
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
        run() {
            this.$router.replace('/lg')
        }
    }
}
</script>

<style scoped>
.bassBox {
    min-height: 100vh;
}

.el-menu-vertical-demo {
    height: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
}

.photo {
    margin-right: 10px;
}

.header :deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title),
.header :deep(.el-menu--horizontal),
.header :deep(.el-menu--horizontal>.el-menu-item.is-active),
.header :deep(.el-menu--horizontal>.el-menu-item) {
    border-bottom: 0;
}
</style>
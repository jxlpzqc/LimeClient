<template>
    <div id="app">
        <el-container v-loading="initing">
            <el-container>
                <el-aside width="200px">
                    <div class="logo-div">Lime项目管理系统</div>
                    <el-menu default-active="home" :default-openeds="['0']" :collapse="false">
                        <router-link to="/">
                            <el-menu-item index="home">欢迎</el-menu-item>
                        </router-link>
                        <el-submenu v-for="(menu, index) in allFuncs" :index="index+''" :key="index">
                            <template slot="title">{{menu.groupname}}</template>
                            <div v-for="(submenu,subindex) in menu.functions"
                                 :key="index+'-'+subindex">
                                <router-link :tag="div" :to="'/'+menu.id +'/'+ submenu.id">
                                    <el-menu-item :index="index+'-'+subindex">

                                        {{submenu.name}}
                                    </el-menu-item>
                                </router-link>
                            </div>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-header height="60px">
                        {{$route.name}}
                        <div class="user-info">
                            {{username}}
                        </div>
                    </el-header>
                    <el-main height>
                        <router-view @no-login="noLogin"></router-view>
                    </el-main>
                </el-container>
            </el-container>
            <el-footer class="copyright">
                Gently Powered By An Honest Liar,Cheng Ziqiu
            </el-footer>
        </el-container>
        <login :isLogin="isLogin" @login-succeed="loginInit"></login>
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    .logo-div {
        padding: 18px 2px 18px 2px;
        text-align: center;
        background: #eee;
        height: 24px;
    }

    .el-header {
        background-color: #b3c0d1;
        color: #333;
        line-height: 60px;
    }

    .user-info {
        float: right;
    }


    .basic-form {
        width: 400px;
    }

    a {
        color: black;
        text-decoration: none;
    }

    .router-link-active {
        color: blue;
        text-decoration: none;
    }

    .copyright {
        text-align: center;
    }
</style>

<script>
    import Login from "@/components/Login.vue";
    import AllFunctions from './AllFunctions'
    import {LimeHttp} from "./ajax";

    export default {
        components: {
            Login
        },
        data() {
            return {
                initing: true,

                isLogin: true,
                username: "未登录",
                permission: []
            };
        },
        provide() {
            return {
                username: this.username,
                permission: this.permission
            }
        },
        computed: {
            allFuncs() {
                if (this.permission.includes("all")) {
                    return AllFunctions.value;
                }

                let ret = [];
                for (let group of AllFunctions.value) {
                    let retGroup = {
                        groupname: group.groupname,
                        id: group.id,
                        functions: []
                    }
                    for (let func of group.functions) {
                        if (this.permission.includes(func.permission)) {
                            retGroup.functions.push(func)
                        }
                    }
                    if (retGroup.functions.length > 0) {
                        ret.push(retGroup)
                    }
                }
                return ret;
            }
        },
        methods: {
            loginInit(data) {
                this.isLogin = true;
                this.username = data.username;
                this.permission = data.permission;
            },

            noLogin() {
                this.isLogin = false;
            }
        },
        mounted() {
            LimeHttp.post("/user/checkStatus")
                .then((data) => {
                    this.$message(data.data.msg);
                    this.initing = false;
                    if (data.data.code == 0) {
                        this.isLogin = true;
                        this.username = data.data.data.username
                        this.permission = data.data.data.permission
                    } else {
                        this.isLogin = false;
                        this.$router.push("/")
                    }
                })
                .catch(() => {
                    this.$alert("服务器发生异常，系统初始化失败", "严重错误", {
                        showClose: false,
                        showConfirmButton: false
                    });
                })
        }
    };
</script>

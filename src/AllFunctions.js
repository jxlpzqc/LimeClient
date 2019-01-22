import Home from "./views/Home";
import NewProject from './views/Project/NewProject'

export default {

    value: [
        {
            groupname: "合同",
            id: "project",
            functions: [
                {name: "创建合同", id: "new", permission: "newProject", component: NewProject},
                {name: "我创建的", id: "my", permission: "newProject", component: ()=>{return import('./views/Project/MyCreated.vue')}},
                {name: "所有合同", id: "list", permission: "viewProject", component: ()=>{return import('./views/Project/AllProject.vue')}},

            ]
        },
        {
            groupname: "请款",
            id: "request",
            functions: [
                {name: "开具发票", id: "new", permission: "newInvoice", component: ()=>{return import("./views/Request/NewInvoice.vue")}},

            ]
        }

    ],
    addtion: [
        {name: "欢迎", path: '/', component: Home},
    ],
    getRoutes() {
        let routes = [];
        //Add Value
        for (let group of this.value) {
            for (let func of group.functions) {
                routes.push({
                    path: `/${group.id}/${func.id}`,
                    name: func.name,
                    component: func.component
                });

            }
        }
        //Add Addtion
        for (let func of this.addtion) {
            routes.push(func)
        }
        return routes;
    }
}
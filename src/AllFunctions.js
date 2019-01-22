import Home from "./views/Home";
import NewProject from './views/Project/NewProject'

export default {

    value: [
        {
            groupname: "合同",
            id: "project",
            functions: [
                {name: "创建合同", id: "new", permission: "NewProject", component: NewProject},
                {name: "我创建的", id: "my", permission: "NewProject", component: ()=>{return import('./views/Project/MyCreated.vue')}},
                {name: "所有合同", id: "list", permission: "ViewProject", component: ()=>{return import('./views/Project/AllProject.vue')}},

            ]
        },
        {
            groupname: "请款",
            id: "request",
            functions: [
                {name: "开票", id: "new", permission: "NewInvoice", component: ()=>{return import("./views/Request/NewInvoice.vue")}},
                {name: "收款", id: "arrive", permission: "MoneyArrive", component: ()=>{return import("./views/Request/MoneyArrive.vue")}},

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
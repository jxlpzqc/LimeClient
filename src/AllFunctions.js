import Home from "./views/Home";
import NewProject from './views/Project/NewProject'

export default {

    value: [
        {
            groupname: "合同",
            id: "project",
            functions: [
                {name: "创建合同", id: "new", permission: "newProject", component: NewProject},

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
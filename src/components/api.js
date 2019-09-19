import axios from 'axios';
export default { 
    getDict(data){
        return axios.get('/api/heart/saas/march/daemon/dict/master/uses', { params: data });
    },
    getPostList(data){  //获取岗位列表
        return axios.get('/api/heart/saas/march/security/post/list', { params: data });
    },
    addPostCode(data){ //添加岗位
        return axios.get('/api/heart/saas/march/security/usr/join/post', { params: data });
    },
    getRoleList(data){ //获取角色列表
        return axios.get('/api/heart/saas/march/security/role/list', { params: data });
    },
    addRoleCode(data){ //增加角色列表
        return axios.get('/api/heart/saas/march/security/usr/join/role', { params: data });
    },
    uploadImage(data){ //上传图片
        return axios.post('/staticapi/up/do', data);
    },
}
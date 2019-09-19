import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
var store = new Vuex.Store({
    state: {
        oCurrUser: {        //当前登陆用户信息
            userInfo: {},   //登陆用户信息
            userName: '',   //登陆用户名
            userId: '',     //登陆用户id
            wsCode: 0,      //登陆用户权限
            teamId: '',      //登陆团队id
            rank: '',        //身份
            defaultTeamId: '',  //默认团队ID
        },
    },
    mutations: {
        SETUSERINFO(state, payload) {
            state.oCurrUser.userInfo = payload.userInfo;
            state.oCurrUser.userName = payload.userName;
            state.oCurrUser.userId = payload.userId;
            state.oCurrUser.wsCode = payload.wsCode;
            state.oCurrUser.teamId = payload.teamId;
            state.oCurrUser.rank = payload.rank;
            state.oCurrUser.defaultTeamId = payload.defaultTeamId;
        },
        SETDEFAULTTEAM(state, payload) {
            state.oCurrUser.defaultTeamId = payload.defaultTeamId;
        },
    },
    actions: {
        SETUSERINFO(state, payload) {
            state.commit('SETUSERINFO', payload)
        },
        SETDEFAULTTEAM(state, payload) {
            state.commit('SETDEFAULTTEAM', payload)
        },
    },
    strict: true
})

export default store

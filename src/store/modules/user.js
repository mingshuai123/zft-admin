import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken ,setsessionInfo,getsessionInfo} from '@/utils/auth'
import { resetRouter } from '@/router'
const info=getToken()
const state = {
  viewDirection :'left',
  token: info,
  mobile: info.mobile,
  rank:info.rank,
  role_id:info.role_id,
  routerRole:info.routerRole,
  member_id:info.member_id,
  org_name:info.org_name
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, mobile) => {
    state.name = mobile
  },
  SET_ROLE: (state, roleid) => {
    state.roleid = roleid
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { mobile, code } = userInfo
    return new Promise((resolve, reject) => {
      login({ mobile: mobile, code: code }).then(response => {
        var  data  = response.data
        state.mobile=data.mobile;
        state.rank=data.rank;
        state.role_id=data.role_id;
        state.member_id=data.member_id
        state.token=data.token;
        state.org_name=data.org_name;
        if(data.role_id==5){
          data.rank==-1?state.routerRole=2:state.routerRole=1;
        }else if(data.role_id==6|| data.role_id==1||data.role_id==2){
          state.routerRole=3
        }else{
          state.routerRole=0
        }
        setsessionInfo(JSON.stringify(state));
        setToken(data.token)
        if(data.role_id==7){
          logout().then(res=>{
            setsessionInfo(null);
            commit('SET_TOKEN', '')
            removeToken()
            resetRouter()
            resolve({code:404})
          });
        }else{
          resolve(response)
        }
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { mobile, avatar } = data

        commit('SET_NAME', mobile)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        setsessionInfo(null);
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


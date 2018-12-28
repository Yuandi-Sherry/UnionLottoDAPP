import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getWeb3 from '../util/getWeb3'
import pollWeb3 from '../util/pollWeb3'
import getSeniorAuthority from '../util/getSeniorAuthority'
import getUnionLotto from '../util/getUnionLotto'
import {ABI} from '../util/constants/UnionLotto'

Vue.use(Vuex)
export const store = new Vuex.Store({
  strict: true,
  state,
  mutations: {
    registerWeb3Instance (state, payload) {
      let result = payload
      let web3Copy = state.web3
      web3Copy.isInjected = result.injectedWeb3
      web3Copy.networkId = result.networkId
      web3Copy.coinbase = result.coinbase
      web3Copy.balance = result.balance
      console.log("-------------------- payload.balance ------------------" + payload.balance)
      console.log("-------------------- web3Copy.balance ------------------" + web3Copy.balance)
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
      pollWeb3()
      
    },
    pollWeb3Instance (state, payload) {
      // console.log('pollWeb3Instance mutation being executed', payload)
      state.web3.coinbase = payload.coinbase
      // console.debug(parseInt(payload.balance, 10))
      state.web3.balance = payload.balance
    },
    registerSeniorAuthority (state, payload) {
      state.SeniorAuthority = () => payload
    },
    // 发布一个彩票
    registerUnionLotto(state, payload) {
      state.unionLottoName = payload.name
      state.recordPageName = payload.name
    },
    setCurrentLotto(state, payload) {
      state.currentUnionLotto = () => payload
    },
    setRecordPageName(state, payload) {
      state.recordPageName = payload
    },
    setUnionName(state, payload) {
      state.unionLottoName = payload
    }
  },
  actions: {
    registerWeb3 ({commit}) {
      getWeb3.then(result => {
        commit('registerWeb3Instance', result)
      }).catch(e => {
        console.log('---- error in action registerWeb3 ----')
        console.log(e)
      })
    },
    pollWeb3 ({commit}, payload) {
      commit('pollWeb3Instance', payload)
    },
    getSeniorAuthority ({commit}) {
      getSeniorAuthority.then(result => {
        commit('registerSeniorAuthority', result)
        state.SeniorAuthority().getLottos({
          from: state.web3.coinbase,
          gas: 3000000
        }, (err, result) => {
          if (result.length === 0) {
            console.log("[WARNING] There isn't any deployed UnionLotto Contract")
          } else if(result.length === 1) {
            // 显示出现问题
            console.log("[WARNING] There's only one deployed UnionLotto Contract")
            state.SeniorAuthority().getLatest({
              from: state.web3.coinbase,
              gas: 3000000
            }, (err, result) => {
              if(state.unionLottoName === '')
                commit('setUnionName', result)
              if(state.recordPageName === '')
                commit('setRecordPageName', result)
            })
          } else {
            console.log("[WARNING] There're 2 one deployed UnionLotto Contract")
            if(state.unionLottoName === '')
              commit('setUnionName', result[result.length-1])
            if(state.recordPageName === '')
              commit('setRecordPageName', result[result.length - 1])
          }

        })
        // resolve('next')
      }).catch(e => {
        console.log('---- error in getSeniorAuthority ----')
        console.log(e)
      })
    },
    publishUnionLotto ({commit}, payload) {
      // console.log(state.web3.coinbase)
      return new Promise(function (resolve, reject) {
        var UnionLottoAddress = null
        // console.log("payload.name sent to createUnionLotto" + payload.name)
        state.SeniorAuthority().createUnionLotto(payload.name, {
          gas: 3000000,
          from: state.web3.coinbase
        }, (err, result) => {
          if (err) {
            console.log('---- error in publishUnionLotto ----')
            console.log(err)
          } else {
            commit('registerUnionLotto', {name: payload.name, contract: result})
          }
        })      
      }).catch(e => console.log(e))
    },
    getUnionLotto({commit}, payload) {
      if(state.SeniorAuthority == null) {
        console.log('---- The senior authority is not assigned ----')
      } else {
        // set current Lotto
        return new Promise(function (resolve, reject) {
          // get contract address of union lotto with para name
          state.SeniorAuthority().getContractAddress(payload.name, {
            gas: 300000,
            from: state.web3.coinbase
          }, (err, result) => {
            if (err) {
              console.log('---- error in getUnionLotto ----')
              console.log(e)
            } else {
              // get the address of current lotto and deploy
              console.log('---- CURRENT LOTTO ADDRESS ----')
              console.log(result)
              var UnionLottoAddress = result
              let web3 = new Web3(window.web3.currentProvider)
              let unionLotto = web3.eth.contract(ABI)
              let unionLottoInstance = unionLotto.at(UnionLottoAddress)
              resolve(unionLottoInstance)
              commit('setCurrentLotto', unionLottoInstance)
            }
          })
        }).catch(e => {
          console.log("---- error in getUnionLotto Promise ----")
          console.log(e)
        })
      }
    },
    changeRecordPage({commit}, payload) {
      return new Promise(function (resolve, reject) {
        commit('setRecordPageName', payload)
        resolve()
      })
    }
  }
})

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
      console.log('registerWeb3instance Mutation being executed', payload)
      let result = payload
      let web3Copy = state.web3
      web3Copy.coinbase = result.coinbase
      web3Copy.networkId = result.networkId
      web3Copy.balance = parseInt(result.balance, 10)
      web3Copy.isInjected = result.injectedWeb3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
      pollWeb3()
    },
    pollWeb3Instance (state, payload) {
      // console.log('pollWeb3Instance mutation being executed', payload)
      state.web3.coinbase = payload.coinbase
      // console.debug(parseInt(payload.balance, 10))
      state.web3.balance = parseInt(payload.balance, 10)/1000000000000000000
    },
    registerSeniorAuthority (state, payload) {
      console.log('~~~~~~~~~~~~~Senior Authority contract instance~~~~~~~~~~~: ', payload)
      state.SeniorAuthority = () => payload
    },
    // 发布一个彩票
    registerUnionLotto(state, payload) {
      console.log('------debug4--------- ' + payload.name)
      state.unionLottoName = payload.name
      state.recordPageName = payload.name
      console.log('Union Lotto contract instance: ', payload.contract)
    },
    setCurrentLotto(state, payload) {
      console.log('mutations 当前彩票为: ', payload)
      state.currentUnionLotto = () => payload
    },
    setRecordPageName(state, payload) {
      state.recordPageName = payload
      console.log("current recordPageName: " + state.recordPageName)
    },
    setUnionName(state, payload) {
      state.unionLottoName = payload
      console.log("current unionLottoName: " + state.unionLottoName)
    }
  },
  actions: {
    registerWeb3 ({commit}) {
      console.log('registerWeb3 Action being executed')
      getWeb3.then(result => {
        console.log('committing result to registerWeb3Instance mutation')
        commit('registerWeb3Instance', result)
      }).catch(e => {
        console.log('error in action registerWeb3', e)
      })
    },
    pollWeb3 ({commit}, payload) {
      console.log('pollWeb3 action being executed')
      commit('pollWeb3Instance', payload)
    },
    getSeniorAuthority ({commit}) {
      getSeniorAuthority.then(result => {
        commit('registerSeniorAuthority', result)
        state.SeniorAuthority().getLottos({
          from: state.web3.coinbase,
          gas: 3000000
        }, (err, result) => {
          console.log("in index.js registerSeniorAuthority")
          console.log(result)
          if(state.unionLottoName === '')
            commit('setUnionName', result[1])
          if(state.recordPageName === '')
            commit('setRecordPageName', result[1])
        })
        // state.
      }).catch(e => console.log(e))
    },
    publishUnionLotto ({commit}, payload) {
      console.log(state.web3.coinbase)
      return new Promise(function (resolve, reject) {
        var UnionLottoAddress = null
        console.log(state)
        state.SeniorAuthority().createUnionLotto(payload.name, payload.date,{
          gas: 3000000,
          from: state.web3.coinbase
        }, (err, result) => {
          if (err) {
            console.log('error in betting')
            console.log(registerUnionLotto)
          } else {
            console.log('finish executing function [createUnionLotto]')
            console.log("-------debug1------ " + payload.name)
            commit('registerUnionLotto', {name: payload.name, contract: result})
            // state.unionLottoName = payload.name
          }
        })      
      }).then(result => {
          console.log("then!!!!!!!!!!!!!!")
      }).catch(e => console.log(e))
    },
    getUnionLotto({commit}, payload) {
      console.log("-------debug2------ " + payload.name)
      console.log(state.recordPageName)
      console.log(state.unionLottoName)
      if(state.SeniorAuthority == null) {
        console.log('权威机构未指定')
        console.log(state.SeniorAuthority)
      } else {
        // 设置当前的彩票
        console.log('当前权威机构')
        console.log(state.SeniorAuthority())
        return new Promise(function (resolve, reject) {
          console.log(' 设置当前的彩票')
          state.SeniorAuthority().test(payload.name, {
            gas: 300000,
            from: state.web3.coinbase
          }, (err, result) => {
            if (err) {
              console.log('error in getUnionLotto')
            } else {
              console.log('获得当前的Union Lotto地址')
              console.log(payload.name)
              console.log(JSON.stringify(result))
              var UnionLottoAddress = result
              let web3 = new Web3(window.web3.currentProvider)
              let unionLotto = web3.eth.contract(ABI)
              let unionLottoInstance = unionLotto.at(UnionLottoAddress)
              resolve(unionLottoInstance)
              commit('setCurrentLotto', unionLottoInstance)
            }
          })
        }).catch(e => {
          console.log("catch in getUnionLotto Promise")
        })
      }
    },
    changeRecordPage({commit}, payload) {
      return new Promise(function (resolve, reject) {
        commit('setRecordPageName', payload)
      })
    }
  }
})

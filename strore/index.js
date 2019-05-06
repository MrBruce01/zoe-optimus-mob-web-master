export const state = () => ({
  eventNo: 0,
  tempList: []
})


export const mutations = {
  setEventNo (state, value) {
    state.eventNo = value
  },

  setTempList (state, value){
    state.tempList = value
  }
}

export const getters = {
    getTempList (state) {
        return state.tempList
    }
}
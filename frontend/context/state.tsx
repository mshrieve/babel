import { createContext, useContext } from 'react'
import { ethers } from 'ethers'

const StateContext = createContext({})
const StateProvider = ({ children }) => {
  return <StateContext.Provider value={{}}>{children}</StateContext.Provider>
}
const useState = () => useContext(StateContext)

export { StateContext, StateProvider, useState }

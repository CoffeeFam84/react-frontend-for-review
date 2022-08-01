import React, { useContext } from 'react'

const RefreshContext = React.createContext({ slow: 0, fast: 0 })

const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow }
}

export default useRefresh
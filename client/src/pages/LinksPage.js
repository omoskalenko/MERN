import React, { useContext, useState, useCallback, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import Loader from '../components/Loader'
import LinksList from '../components/LinksList'

const linksInitialState = []

function LinksPage() {
  const { request, loading } = useHttp()
  const [links, setLinks] = useState(linksInitialState)
  const {token} = useContext(AuthContext)

  const getLinks = useCallback(
    async () => {
      try {
        const data = await request('/api/link', 'GET', null, {
          Authorization: `Bearer ${token}`
        })
        setLinks(data)
      } catch {

      }
    },
    [token, request],
  )
  

  useEffect(() => {
    getLinks()
  }, [getLinks])

  if(loading) {
    return <Loader />
  }
  return (
    <>
    {!loading && <LinksList links={links}/>}
    </>
  )
}

export default LinksPage

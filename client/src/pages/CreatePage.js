import React, { useState, useContext, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useHistory } from 'react-router-dom'
function CreatePage() {

  const history = useHistory()
  const { request } = useHttp()
  const { token } = useContext(AuthContext)
  const [link, setLink] = useState('')
  const [detail, setDetail] = useState()

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const pressHandler = async (e) => {
    if(e.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', { from: link }, {
          Authorization: `Bearer ${token}`
        })
        history.push(`/detail/${data.link._id}`)

        console.log("TCL: pressHandler -> data", data)
      } catch (error) {

      }
    }

  }


  return (

      <div className="row">
        <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
        <div className="input-field">
                  <input
                  placeholder="Вставьте ссылку"
                  id="email"
                  type="text"
                  name="email"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  onKeyPress={pressHandler}
                  />
                  <label htmlFor="first_name">Email</label>
              </div>
        </div>
      </div>

  )
}

export default CreatePage

import axios from "axios"

async function getListTodos(params) {
  const { token, project, collection, appid } = params
      
  return axios.get(`https://io.etter.cloud/v4/select_all/token/${token}/project/${project}/collection/${collection}/appid/${appid}`)
}

async function getDetailTodos(params) {
  const { token, project, collection, appid, id } = params
  
  return axios.get(`https://io.etter.cloud/v4/select_id/token/${token}/project/${project}/collection/${collection}/appid/${appid}/id/${id}`)
}

async function addTodo(params) {  
  return fetch('https://io.etter.cloud/v4/insert', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Accept': '*/*',
    },
    body : params,
  })
}

async function updateTodo(params) {
  return fetch('https://io.etter.cloud/v4/update_id', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Accept': '*/*', 
    },
    body: params,
  })
}

async function deleteTodo(params) {
  const { token, project, collection, appid, id } = params

  return axios.delete(`https://io.etter.cloud/v4/remove_id/token/${token}/project/${project}/collection/${collection}/appid/${appid}/id/${id}`)
}

export const api = {
  getListTodos,
  getDetailTodos,
  addTodo,
  updateTodo,
  deleteTodo,
}

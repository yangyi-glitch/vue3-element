import request from '@/utils/request.js'

export async function articlePage(data) {
    return await request.get('/article/list',{params:data})
}

export async function get(id) {
    return await request.get('/article/get?id='+id)
}

export async function delet(id) {
    return await request.post('/article/delet?id='+id)
}

export async function add(data) {
    return await request.post('/article/add',data)
}

export async function update(data) {
    return await request.post('/article/update',data)
}

export async function login(data) {
    return await request.post('/article/login',data)
}
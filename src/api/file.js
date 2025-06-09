import request from '@/utils/request.js'

export async function listService(data) {
    return await request.get('/file/list', {
        params: data
    })
}

export async function previewService(id) {
    return await request.get('/file/previewUrl?id=' + id)
}

export async function downloadService(id) {
    return await request.get('/file/download?id=' + id)
}

export async function deletService(id) {
    return await request.post('/file/delet?id=' + id)
}

export async function treeListService() {
    return await request.get('/file/area')
}
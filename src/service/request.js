export const device_id = 'xxxx'
export const version = '0.0.1'
//export const app_id = 'wx6b41841b50d9ff15'

//export const isDev = /devtools/.test(window.navigator.userAgent)

export const isDev = false

export const host = `http${isDev ? '' : 's'}://blink.51rencaiyun.com`

export function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timeout || 1000)
  })
}

export function request(option) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'sid',
      complete: function (res) {
        console.log('getStorage sid', res)
        option.header = Object.assign(option.header || {}, {
          'X-Session-Id': res.data || '',
          //'X-App-Id': app_id,
          'X-Device-Id': device_id,
          'X-Version': version,
        })
        option.fail = function (res) {
          console.log('fail', arguments)
          resolve(res || { code: -1, 'msg': 'error' })
        }
        option.complete = function (res) {
          console.log('complete', arguments)
          resolve(res || { code: -1, 'msg': 'error' })
        }
        wx.request({
          ...option,
          fail: res => {
            console.log('fail', res)
            reject(res)
          },
          success: ({ header, data, statusCode, errMsg }) => {
            console.debug('success', header, data, statusCode, errMsg)
            if (header['X-Session-Id']) {
              console.log('getStorage sid', res)
              wx.setStorage({
                key: "sid",
                data: header['X-Session-Id']
              })
            }
            resolve(data)
          },
          complete: res => {
            console.debug('complete', res)
            resolve(res || { code: -1, 'msg': 'error' })
          }
        })
        //return wx.request(option)
      }
    })
  })
}

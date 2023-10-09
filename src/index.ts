import { Context, Schema } from 'koishi'

// 导入nazrin核心
import { } from 'koishi-plugin-nazrin-core'
// 声明使用nazrin核心
export const using = ['nazrin']

export const name = 'nazrin-music-netease'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export async function apply(ctx: Context) {
  // 当前平台为netease
  const thisPlatform = 'netease'
  // 注册此平台
  ctx.nazrin.music.push(thisPlatform)

  ctx.on('nazrin/music', async keyword => {
    // keyword为关键词
    let findList = []
    const data = await ctx.http.get(`http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=1&offset=0&total=true&limit=10`)
    if (data.result.songCount <= 0) {
      findList = [
        {
          err: true,
          platform: thisPlatform
        }
      ]

      return ctx.emit('nazrin/search_over', findList)
    }

    const result = data.result.songs

    if (data.result.abroad) return
    
    findList = result.map(item => {
      let backObj = {
        name: item.name,
        author: item.artists[0].name,
        cover: '',
        url: `https://music.163.com/#/song?id=${item.id}`,
        platform: thisPlatform,
        err: false
      }

      return backObj
    })
    return ctx.emit('nazrin/search_over', findList) // 完成后调用此条，提交搜索结果给用户
  })

  ctx.on('nazrin/parse_music', async (platform, url) => {
    if (platform !== thisPlatform) { return } // 判断是否为本平台的解析请求
    const id = url.replace('https://music.163.com/#/song?id=', '')

    let songData = await ctx.http.get(`http://music.163.com/api/song/detail/?id=${id}&ids=%5B${id}%5D`)
    songData = songData.songs[0]
    let songResource = await ctx.http.get(`https://v.iarc.top/?type=song&id=${id}`)
    
    songResource = songResource[0]
    // 调用此条提交解析结果
    ctx.emit('nazrin/parse_over',
      songResource.url,
      songResource.name,
      songResource.artist,
      songResource.pic,
      (songData.duration / 1000) /* ?资源时长，单位s */,
      (songData.hMusic.bitrate / 1000),
      '66ccff')
  })
}

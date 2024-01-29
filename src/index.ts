import { Context, Schema } from 'koishi';
import { MusicSearch } from './api/NeteaseSearch';

// 导入nazrin核心
import { nazrin } from 'koishi-plugin-nazrin-core';
// 声明使用nazrin核心
export const inject = ['nazrin'];

export const name = 'nazrin-music-netease';

export interface Config { }

export const Config: Schema<Config> = Schema.object({});

export async function apply(ctx: Context)
{
  const thisPlatform = 'netease';

  if (!ctx.nazrin.music.includes(thisPlatform))
  {
    ctx.nazrin.music.push(thisPlatform);
  }
  ctx.on('nazrin/music', async (ctx: Context, keyword: string, episode?:number|'all') =>
  {
    const musicSearch = new MusicSearch(thisPlatform);
    const findList = await musicSearch.search(keyword);
    ctx.emit('nazrin/search_over', findList); // 完成后调用此条，提交搜索结果给用户
  });
  ctx.on('nazrin/parse_music', async (ctx: Context, platform: string, _url: any, data: any) =>
  {
    if (platform !== thisPlatform) { return; } // 判断是否为本平台的解析请求

    const musicSearch = new MusicSearch(platform);

    const MusicResource = await musicSearch.getVideo(data);
    if (!MusicResource) { return; }
    ctx.emit('nazrin/parse_over',
      MusicResource.url,
      MusicResource.name,
      MusicResource.author,
      MusicResource.cover,
      MusicResource.duration /* ?资源时长，单位s */,
      MusicResource.bitRate,
      MusicResource.color);
  });
}




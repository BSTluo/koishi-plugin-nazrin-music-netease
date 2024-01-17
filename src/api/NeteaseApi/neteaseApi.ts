
import axios from 'axios';
import { weapi } from './crypto';
export class NeteaseApi
{

  async getNeteaseMusicSearchData(keyWord: string)
  {
    const url = 'https://music.163.com/weapi/search/get';
    const params = {
      s: keyWord, // 关键词
      type: 1,
      limit: 30, // 返回歌曲数量
      offset: 0, // 偏移量
    };

    const encryptParam = new URLSearchParams(weapi(params)).toString();
    const headers = {
    };

    try
    {
      const response = await axios.post(url, encryptParam, {
        headers,
      });
      return response.data;
    } catch (error: any)
    {
      console.log(`error response: ${error}`);
      return null;
    }
  }

  async getNeteaseMusicDetail(id: number)
  {
      const url = new URL(`http://music.163.com/api/song/detail`);
      const params = {
          id: id.toString(),
          ids: `[${id}]`
      };
      url.search = new URLSearchParams(params).toString();

      try
      {
          const response = await axios.get(url.toString(), {
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const musicDetail: MusicDetail = response.data

          return musicDetail;
      } catch (error)
      {
          console.error('获取音乐详情失败', error);
          return null;
      }
  }

  async getSongResource(id: number)
  {
      const url = new URL(`https://v.iarc.top/`);
      const params = {
          type: 'song',
          id: id.toString()
      };
      url.search = new URLSearchParams(params).toString();

      try
      {
          const response = await axios.get(url.toString(), {
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          return response.data as songResource[];
      } catch (error)
      {
          console.error('获取歌曲资源失败', error);
          return null;
      }
  }
  /**
    * 针对有重定向的链接，获取重定向后的链接
    * @param shortUrl 重定向前的链接
    * @returns 
    */
  async getRedirectUrl(shortUrl: string)
  {
    try
    {
      const response = await axios.get(shortUrl, {
        maxRedirects: 0,
        responseType: 'stream' // 将 responseType 设置为 'stream'
      });
      return response.headers.location;
    } catch (error: any)
    {
      const response = error.response;
      const redirectUrl = response.headers.location;
      return redirectUrl;
    }
  }
}
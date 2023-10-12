
import axios from 'axios';
import { weapi } from '../crypto';
export class NeteaseApi{

    async getNeteaseMusicSearchData(keyWord: string) {
        const url = 'https://music.163.com/weapi/search/get';
        const params = {
          s: keyWord, // 关键词
          type: 1, 
          limit: 10, // 返回歌曲数量
          offset: 0, // 偏移量
        };
      
        const encryptParam = new URLSearchParams(weapi(params)).toString()
        const headers = {
          'User-Agent': 'your-user-agent', 
        };
      
        try {
          const response = await axios.post(url, encryptParam, {
            headers,
          });
          console.log(`response: ${JSON.stringify(response.data)}`);
          return response.data;
        } catch (error: any) {
          console.log(`error response: ${error}`);
          return null;
        }
      }

}
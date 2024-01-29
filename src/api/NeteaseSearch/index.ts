import { Logger } from "koishi";
import { NeteaseApi } from "../NeteaseApi/neteaseApi";
export class MusicSearch
{
    private logger = new Logger('Nazrin-Music-Netease');
    private neteaseApi: NeteaseApi;
    private thisPlatform: string;
    constructor(thisPlatform: string)
    {
        this.neteaseApi = new NeteaseApi();
        this.thisPlatform = thisPlatform;
    }

    public async search(keyword: string)
    {
        try
        {
            const findList = await this.searchMusic(keyword);
            return findList;
        } catch (error)
        {
            this.logger.error(error);
            return [];
        }
    }

    public async searchMusic(keyword: string)
    {
        let findList = [];

        const data = await this.neteaseApi.getNeteaseMusicSearchData(keyword);
        const result = data.result.songs;
        findList = result.map((item: { name: any; artists: { name: any; }[]; id: any; }) =>
        {
            let backObj = {
                name: item.name,
                author: item.artists[0].name,
                url: `https://music.163.com/#/song?id=${item.id}`,
                platform: this.thisPlatform,
                err: false,
                data: item
            };
            return backObj;
        });

        return findList;
    }

    public async getVideo(data: any)
    {
        try
        {
            const neteaseApi = new NeteaseApi();
            const id = data.id;
            const songData = await neteaseApi.getNeteaseMusicDetail(id);
            const songResources = await neteaseApi.getSongResource(id);
            if (songData && songResources)
            {
                const songs = songData.songs[0];
                const songResource = songResources[0];
                let songUrl = await neteaseApi.getRedirectUrl(songResource.url);
                const bitrate = songs.hMusic ? (songs.hMusic.bitrate / 1000) : 128; // 如果 songData.hMusic 存在则使用其比特率，否则使用默认值 128
                return this.returnCompleteVideoResource(songUrl, data.name, data.artists[0].name, songs.album.picUrl, (data.duration / 1000), bitrate, '66ccff');
            } else
            {
                throw new Error('getVideo: 无法获取歌曲数据');
            }
        } catch (error)
        {
            this.logger.error(error);
            return null;
        }


    }



    private returnCompleteVideoResource(url: string, name: string, author: string, cover: string, duration: number, bitRate: number, color: string)
    {
        const MusicResource: MusicResource = {
            url: url,
            name: name,
            author: author,
            cover: cover,
            duration: duration,
            bitRate: bitRate,
            color: color,
            error: null
        };
        return MusicResource;
    }
}


import { NeteaseApi } from "../NeteaseApi/neteaseApi";
export class MusicSearch
{
    private neteaseApi: NeteaseApi;
    private thisPlatform: string;
    constructor(thisPlatform: string)
    {
        this.neteaseApi = new NeteaseApi();
        this.thisPlatform = thisPlatform;
    }

    public async search(keyword: string)
    {
        const findList = await this.searchMusic(keyword);
        return findList;
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
        const neteaseApi = new NeteaseApi();
        const id = data.id;

        let songData = await neteaseApi.getNeteaseMusicDetail(id);
        songData = songData.songs[0];
        let songResource = await neteaseApi.getSongResource(id);
        songResource = songResource[0];
        const bitrate = songData.hMusic ? (songData.hMusic.bitrate / 1000) : 128; // 如果 songData.hMusic 存在则使用其比特率，否则使用默认值 128
        return this.returnCompleteVideoResource(songResource.url, data.name, data.artists[0].name, songResource.pic, (data.duration / 1000), bitrate, '66ccff');
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


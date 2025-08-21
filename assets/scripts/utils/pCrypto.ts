
export namespace pCrypto {
    export type TSlimType = 'o' | 'a'; // offer or answer

    export interface ISlimDesc {
        t: TSlimType;
        s: string; // sdp
    }

    export function enb64url(bytes: Uint8Array) {
        return btoa(String.fromCharCode(...bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    export function deb64url(str: string) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) {
            str += '=';
        }
        return Uint8Array.from(atob(str), c => c.charCodeAt(0));
    }

    export function slim(desc: RTCSessionDescriptionInit): ISlimDesc {
        const t = desc.type === 'offer' ? 'o' : 'a';
        return { t, s: desc.sdp }
    }

    export function unslim(x: ISlimDesc): RTCSessionDescriptionInit {
        return {
            type: x.t === 'o' ? 'offer' : 'answer',
            sdp: x.s
        }
    }

    export async function compress(str: string, algo: CompressionFormat = 'deflate-raw') {
        if(typeof CompressionStream !== 'undefined') {
            const _enc = new TextEncoder();
            const _cs = new CompressionStream(algo);
            const _stream = new Blob([_enc.encode(str)])
                                .stream()
                                .pipeThrough(_cs);
            const _buf = await new Response(_stream)
                            .arrayBuffer();

            return new Uint8Array(_buf);
        }

        return new TextEncoder().encode(str);
    }

    export async function decompress(bytes: Uint8Array, algo: CompressionFormat = 'deflate-raw') {
        if(typeof DecompressionStream !== 'undefined') {
            const _ds = new DecompressionStream(algo);
            const _stream = new Blob([bytes])
                                .stream()
                                .pipeThrough(_ds);
            const _buf = await new Response(_stream)
                            .arrayBuffer();

            return new TextDecoder().decode(_buf);
        }

        return new TextDecoder().decode(bytes);
    }

    export async function packer(desc: any) {
        const _json = JSON.stringify(slim(desc));
        const _compressed = await compress(_json);
        return enb64url(_compressed);
    }

    export async function unpacker(str: string) {
        const _bytes = deb64url(str);
        const _decompressed = await decompress(_bytes);
        return unslim(JSON.parse(_decompressed));
    }
}

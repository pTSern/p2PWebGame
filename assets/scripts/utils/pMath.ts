
import { Color, easing, IColorLike, IQuatLike, IRectLike, ISizeLike, IVec2Like, IVec3Like, Quat, Rect, Size, TweenEasing, Vec2, Vec3 } from "cc";
import pArray from "./pArray";
import pFunction from "./pFunction";

export namespace pMath  {
    type TNumberUnit = 'INTEGER' | 'FLOAT'

    export function get_most_significant_digit(value: number): number {
        if (value === 0) return 0;

        const magnitude = Math.floor(Math.log10(Math.abs(value)));
        const multiplier = Math.pow(10, magnitude);
        const firstDigit = Math.floor(Math.abs(value) / multiplier);

        return firstDigit * multiplier * (value < 0 ? -1 : 1);
    }

    export function random(min: number, max: number, type: TNumberUnit = "INTEGER", significant: boolean = false) {
        var number = min;
        switch(type) {
            case "INTEGER": {
                number = rand_int(min, max);
                break;
            }
            case "FLOAT": {
                number = Math.random() * (max - min) + min;
                break;
            }
        }
        significant && (number = get_most_significant_digit(number));
        return number;
    }

    interface _TRange { min: number, max: number };
    export function range(value: number, opt: _TRange): number;
    export function range(value: number, min: number, max: number): number
    export function range(value: number, min: _TRange | number, max?: number) {
        if(typeof min != 'number') {
            max = min.max;
            min = min.min;
        }

        return Math.max(Math.min(value, max), min);
    }

    export function rand<T>(arr: pFlex.TArray<T>, ...arrs: T[]) {
        arr = pArray.flatter(arr, ...arrs);
        const index = Math.floor(Math.random() * arr.length)
        return arr[index];
    }

    export type TValueType = 'Vec2' | 'Vec3' | 'Size' | 'Rect' | 'Color' | 'Quat';
    type _TData = IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like

    export function rand_int(min: number, max: number) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    export function random_float(min: number, max: number) { // min and max included
        return Math.random() * (max - min) + min;
    }

    export function vec2(other: IVec2Like): Vec2
    export function vec2(x?: number, y?: number): Vec2
    export function vec2(other: IVec2Like | number = 0, y: number = 0) {
        return (typeof other === 'number') ? new Vec2(other, y) : new Vec2(other.x, other.y);
    }

    export function vec3(other: IVec3Like): Vec3
    export function vec3(x?: number, y?: number, z?: number): Vec3
    export function vec3(other: IVec3Like | number = 0, y: number = 0, z: number = 0) {
        return (typeof other === 'number') ? new Vec3(other, y, z) : new Vec3(other.x, other.y, other.z);
    }

    export function size(other: ISizeLike): Size
    export function size(width?: number, height?: number): Size
    export function size(other: ISizeLike | number = 0, height: number = 0): Size {
        return (typeof other === 'number') ? new Size(other, height) : new Size(other.width, other.height);
    }

    export function rect(other: IRectLike): Rect
    export function rect(position: IVec2Like, size: ISizeLike): Rect
    export function rect(x?: number, y?: number, width?: number, height?: number): Rect
    export function rect(_other: IRectLike | IVec2Like | number = 0, _y: ISizeLike | number = 0, _width: number = 0, _height: number = 0): Size {
        if (typeof _other === 'number') {
            if (typeof _y === 'number') {
                return new Rect(_other, _y, _width, _height);
            }
        } else {
            const { x, y } = _other;

            if ('width' in _other) {
                return new Rect(x, y, _other.width, _other.height);
            } else if (typeof _y === 'object' && 'width' in _y) {
                return new Rect(x, y, _y.width, _y.height);
            }
        }
        return new Rect(0, 0, 0, 0);
    }

    export function quat(other: IQuatLike): Quat
    export function quat(x?: number, y?: number, z?: number, w?: number): Quat
    export function quat(other: IQuatLike | number = 0, y: number = 0, z: number = 0, w: number = 0): Quat {
        return (typeof other === 'number') ? new Quat(other, y, z, w) : new Quat(other.x, other.y, other.z, other.w);
    }

    export function color(other: IColorLike): Color
    export function color(r?: number, g?: number, b?: number, a?: number): Color
    export function color(other: IColorLike | number = 0, g: number = 0, b: number = 0, a: number = 0) {
        return (typeof other === 'number') ? new Color(other, g, b, a) : new Color(other.r, other.g, other.b, other.a);
    }

    export function create(type: 'Vec2', data: IVec2Like): Vec2
    export function create(type: 'Vec3', data: IVec3Like): Vec3
    export function create(type: 'Rect', data: IRectLike): Rect
    export function create(type: 'Size', data: ISizeLike): Size
    export function create(type: 'Quat', data: IQuatLike): Quat
    export function create(type: 'Color', data: IColorLike): Color
    export function create(type: TValueType, data: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like) {
        switch (type) {
            case "Vec2": return vec2(data as IVec2Like);
            case "Vec3": return vec3(data as IVec3Like);
            case "Size": return size(data as ISizeLike);
            case "Rect": return rect(data as IRectLike);
            case "Quat": return quat(data as IQuatLike);
            case "Color": return color(data as IColorLike);
        }
    }

    export function add(type: "Vec2", first: IVec2Like, second: IVec2Like, out?: IVec2Like): Vec2
    export function add(type: "Vec3", first: IVec3Like, second: IVec3Like, out?: IVec3Like): Vec3
    export function add(type: "Size", first: ISizeLike, second: ISizeLike, out?: ISizeLike): Size
    export function add(type: "Rect", first: IRectLike, second: IRectLike, out?: IRectLike): Rect
    export function add(type: "Quat", first: IQuatLike, second: IQuatLike, out?: IQuatLike): Quat
    export function add(type: "Color", first: IColorLike, second: IColorLike, out?: IColorLike): Color
    export function add(type: TValueType, first: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, second: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, out?: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like) {
        switch (type) {
            case "Vec2": {
                const _fx = (first as IVec2Like).x;
                const _fy = (first as IVec2Like).y;

                const _sx = (second as IVec2Like).x;
                const _sy = (second as IVec2Like).y;

                out = vec2(_fx + _sx, _fy + _sy);

                return out;
            }
            case "Vec3": {
                const _fx = (first as IVec3Like).x;
                const _fy = (first as IVec3Like).y;
                const _fz = (first as IVec3Like).z;

                const _sx = (second as IVec3Like).x;
                const _sy = (second as IVec3Like).y;
                const _sz = (second as IVec3Like).z;

                out = vec3(_fx + _sx, _fy + _sy, _fz + _sz);

                return out;
            }
            case "Size": {
                const _fw = (first as ISizeLike).width;
                const _fh = (first as ISizeLike).height;

                const _sw = (second as ISizeLike).width;
                const _sh = (second as ISizeLike).height;

                out = size(_fw + _sw, _fh + _sh);

                return out;
            }
            case "Rect": {
                const _fx = (first as IRectLike).x;
                const _fy = (first as IRectLike).y;
                const _fw = (first as IRectLike).width;
                const _fh = (first as IRectLike).height;

                const _sx = (second as IRectLike).x;
                const _sy = (second as IRectLike).y;
                const _sw = (second as IRectLike).width;
                const _sh = (second as IRectLike).height;

                out = rect(_fx + _sx, _fy + _sy, _fw + _sw, _fh + _sh);

                return out;
            }
            case "Color": {
                const _fr = (first as IColorLike).r;
                const _fg = (first as IColorLike).g;
                const _fb = (first as IColorLike).b;
                const _fa = (first as IColorLike).a;

                const _sr = (second as IColorLike).r;
                const _sg = (second as IColorLike).g;
                const _sb = (second as IColorLike).b;
                const _sa = (second as IColorLike).a;

                out = color(_fr + _sr, _fg + _sg, _fb + _sb, _fa + _sa);

                return out;
            }
            case "Quat": {
                const _fx = (first as IQuatLike).x;
                const _fy = (first as IQuatLike).y;
                const _fz = (first as IQuatLike).z;
                const _fw = (first as IQuatLike).w;

                const _sx = (second as IQuatLike).x;
                const _sy = (second as IQuatLike).y;
                const _sz = (second as IQuatLike).z;
                const _sw = (second as IQuatLike).w;

                out = quat(_fx + _sx, _fy + _sy, _fz + _sz, _fw + _sw);

                return out;
            }
        }
    }

    export function addf(type: "Vec2", first: IVec2Like, x: number, y: number, out?: IVec2Like): Vec2
    export function addf(type: "Vec3", first: IVec3Like, x: number, y: number, z: number, out?: IVec3Like): Vec3
    export function addf(type: "Size", first: ISizeLike, width: number, height: number, out?: ISizeLike): Size
    export function addf(type: "Rect", first: IRectLike, x: number, y: number, width: number, height: number, out?: IRectLike): Rect
    export function addf(type: "Quat", first: IQuatLike, x: number, y: number, z: number, w: number, out?: IQuatLike): Quat
    export function addf(type: "Color", first: IColorLike, r: number, g: number, b: number, a: number, out?: IColorLike): Color
    export function addf(type: TValueType, first: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, ...args: any[]) {
        switch (type) {
            case "Vec2": {
                const x = args[0] + (first as IVec2Like).x;
                const y = args[1] + (first as IVec2Like).y;

                args[2] = vec2(x, y);

                return args[2];
            }
            case "Vec3": {
                const x = args[0] + (first as IVec3Like).x;
                const y = args[1] + (first as IVec3Like).y;
                const z = args[2] + (first as IVec3Like).z;

                args[3] = vec3(x, y, z);

                return args[3];
            }
            case "Size": {
                const width = args[0] + (first as ISizeLike).width;
                const height = args[1] + (first as ISizeLike).height;

                args[2] = size(width, height);

                return args[2];
            }
            case "Rect": {
                const x = args[0] + (first as IVec2Like).x;
                const y = args[1] + (first as IVec2Like).y;

                const width = args[2] + (first as ISizeLike).width;
                const height = args[3] + (first as ISizeLike).height;

                args[4] = rect(x, y, width, height);

                return args[4]
            }
            case "Color": {
                const r = args[0] + (first as IColorLike).r;
                const g = args[1] + (first as IColorLike).g;
                const b = args[2] + (first as IColorLike).b;
                const a = args[3] + (first as IColorLike).a;

                args[4] = color(r, g, b, a);

                return args[4];
            }
            case "Quat": {
                const x = args[0] + (first as IQuatLike).x;
                const y = args[1] + (first as IQuatLike).y;
                const z = args[2] + (first as IQuatLike).z;
                const w = args[3] + (first as IQuatLike).w;

                args[4] = quat(x, y, z, w);

                return args[4];
            }
        }
    }

    export function subf(type: "Vec2", first: IVec2Like, x: number, y: number, out?: IVec2Like): Vec2
    export function subf(type: "Vec3", first: IVec3Like, x: number, y: number, z: number, out?: IVec3Like): Vec3
    export function subf(type: "Size", first: ISizeLike, width: number, height: number, out?: ISizeLike): Size
    export function subf(type: "Rect", first: IRectLike, x: number, y: number, width: number, height: number, out?: IRectLike): Rect
    export function subf(type: "Quat", first: IQuatLike, x: number, y: number, z: number, w: number, out?: IQuatLike): Quat
    export function subf(type: "Color", first: IColorLike, r: number, g: number, b: number, a: number, out?: IColorLike): Color
    export function subf(type: TValueType, first: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, ...args: any[]) {
        switch (type) {
            case "Vec2": {
                const x = args[0] - (first as IVec2Like).x;
                const y = args[1] - (first as IVec2Like).y;

                args[2] = vec2(x, y);

                return args[2];
            }
            case "Vec3": {
                const x = args[0] - (first as IVec3Like).x;
                const y = args[1] - (first as IVec3Like).y;
                const z = args[2] - (first as IVec3Like).z;

                args[3] = vec3(x, y, z);

                return args[3];
            }
            case "Size": {
                const width = args[0] - (first as ISizeLike).width;
                const height = args[1] - (first as ISizeLike).height;

                args[2] = size(width, height);

                return args[2];
            }
            case "Rect": {
                const x = args[0] - (first as IVec2Like).x;
                const y = args[1] - (first as IVec2Like).y;

                const width = args[2] - (first as ISizeLike).width;
                const height = args[3] - (first as ISizeLike).height;

                args[4] = rect(x, y, width, height);

                return args[4]
            }
            case "Color": {
                const r = args[0] - (first as IColorLike).r;
                const g = args[1] - (first as IColorLike).g;
                const b = args[2] - (first as IColorLike).b;
                const a = args[3] - (first as IColorLike).a;

                args[4] = color(r, g, b, a);

                return args[4];
            }
            case "Quat": {
                const x = args[0] - (first as IQuatLike).x;
                const y = args[1] - (first as IQuatLike).y;
                const z = args[2] - (first as IQuatLike).z;
                const w = args[3] - (first as IQuatLike).w;

                args[4] = quat(x, y, z, w);

                return args[4];
            }
        }
    }

    export function mulf(type: "Vec2", first: IVec2Like, x: number, y: number, out?: IVec2Like): Vec2
    export function mulf(type: "Vec3", first: IVec3Like, x: number, y: number, z: number, out?: IVec3Like): Vec3
    export function mulf(type: "Size", first: ISizeLike, width: number, height: number, out?: ISizeLike): Size
    export function mulf(type: "Rect", first: IRectLike, x: number, y: number, width: number, height: number, out?: IRectLike): Rect
    export function mulf(type: "Quat", first: IQuatLike, x: number, y: number, z: number, w: number, out?: IQuatLike): Quat
    export function mulf(type: "Color", first: IColorLike, r: number, g: number, b: number, a: number, out?: IColorLike): Color
    export function mulf(type: TValueType, first: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, ...args: any[]) {
        switch (type) {
            case "Vec2": {
                const x = args[0] * (first as IVec2Like).x;
                const y = args[1] * (first as IVec2Like).y;

                args[2] = vec2(x, y);

                return args[2];
            }
            case "Vec3": {
                const x = args[0] * (first as IVec3Like).x;
                const y = args[1] * (first as IVec3Like).y;
                const z = args[2] * (first as IVec3Like).z;

                args[3] = vec3(x, y, z);

                return args[3];
            }
            case "Size": {
                const width = args[0] * (first as ISizeLike).width;
                const height = args[1] * (first as ISizeLike).height;

                args[2] = size(width, height);

                return args[2];
            }
            case "Rect": {
                const x = args[0] * (first as IVec2Like).x;
                const y = args[1] * (first as IVec2Like).y;

                const width = args[2] * (first as ISizeLike).width;
                const height = args[3] * (first as ISizeLike).height;

                args[4] = rect(x, y, width, height);

                return args[4]
            }
            case "Color": {
                const r = args[0] * (first as IColorLike).r;
                const g = args[1] * (first as IColorLike).g;
                const b = args[2] * (first as IColorLike).b;
                const a = args[3] * (first as IColorLike).a;

                args[4] = color(r, g, b, a);

                return args[4];
            }
            case "Quat": {
                const x = args[0] * (first as IQuatLike).x;
                const y = args[1] * (first as IQuatLike).y;
                const z = args[2] * (first as IQuatLike).z;
                const w = args[3] * (first as IQuatLike).w;

                args[4] = quat(x, y, z, w);

                return args[4];
            }
        }
    }

    export function adds(type: "Vec2", first: IVec2Like, second: number, out?: IVec2Like): Vec2
    export function adds(type: "Vec3", first: IVec3Like, second: number, out?: IVec3Like): Vec3
    export function adds(type: "Size", first: ISizeLike, second: number, out?: ISizeLike): Size
    export function adds(type: "Rect", first: IRectLike, second: number, out?: IRectLike): Rect
    export function adds(type: "Quat", first: IQuatLike, second: number, out?: IQuatLike): Quat
    export function adds(type: "Color", first: IColorLike, second: number, out?: IColorLike): Color
    export function adds(type: TValueType, first: _TData, args: number, out?: _TData) {
        switch (type) {
            case "Vec2": return addf(type, first as IVec2Like, args, args, out as IVec2Like);
            case "Vec3": return addf(type, first as IVec3Like, args, args, args, out as IVec3Like);
            case "Size": return addf(type, first as ISizeLike, args, args, out as ISizeLike);
            case "Rect": return addf(type, first as IRectLike, args, args, args, args, out as IRectLike);
            case "Color": return addf(type, first as IColorLike, args, args, args, args, out as IColorLike);
            case "Quat": return addf(type, first as IQuatLike, args, args, args, args, out as IQuatLike);
        }
    }

    export function subs(type: "Vec2", first: IVec2Like, second: number, out?: IVec2Like): Vec2
    export function subs(type: "Vec3", first: IVec3Like, second: number, out?: IVec3Like): Vec3
    export function subs(type: "Size", first: ISizeLike, second: number, out?: ISizeLike): Size
    export function subs(type: "Rect", first: IRectLike, second: number, out?: IRectLike): Rect
    export function subs(type: "Quat", first: IQuatLike, second: number, out?: IQuatLike): Quat
    export function subs(type: "Color", first: IColorLike, second: number, out?: IColorLike): Color
    export function subs(type: TValueType, first: _TData, args: number, out?: _TData) {
        switch (type) {
            case "Vec2": return subf(type, first as IVec2Like, args, args, out as IVec2Like);
            case "Vec3": return subf(type, first as IVec3Like, args, args, args, out as IVec3Like);
            case "Size": return subf(type, first as ISizeLike, args, args, out as ISizeLike);
            case "Rect": return subf(type, first as IRectLike, args, args, args, args, out as IRectLike);
            case "Color": return subf(type, first as IColorLike, args, args, args, args, out as IColorLike);
            case "Quat": return subf(type, first as IQuatLike, args, args, args, args, out as IQuatLike);
        }
    }

    export function muls(type: "Vec2", first: IVec2Like, second: number, out?: IVec2Like): Vec2
    export function muls(type: "Vec3", first: IVec3Like, second: number, out?: IVec3Like): Vec3
    export function muls(type: "Size", first: ISizeLike, second: number, out?: ISizeLike): Size
    export function muls(type: "Rect", first: IRectLike, second: number, out?: IRectLike): Rect
    export function muls(type: "Quat", first: IQuatLike, second: number, out?: IQuatLike): Quat
    export function muls(type: "Color", first: IColorLike, second: number, out?: IColorLike): Color
    export function muls(type: TValueType, first: _TData, args: number, out?: _TData) {
        switch (type) {
            case "Vec2": return mulf(type, first as IVec2Like, args, args, out as IVec2Like);
            case "Vec3": return mulf(type, first as IVec3Like, args, args, args, out as IVec3Like);
            case "Size": return mulf(type, first as ISizeLike, args, args, out as ISizeLike);
            case "Rect": return mulf(type, first as IRectLike, args, args, args, args, out as IRectLike);
            case "Color": return mulf(type, first as IColorLike, args, args, args, args, out as IColorLike);
            case "Quat": return mulf(type, first as IQuatLike, args, args, args, args, out as IQuatLike);
        }
    }

    export function sub(type: "Vec2", first: IVec2Like, second: IVec2Like, out?: IVec2Like): Vec2
    export function sub(type: "Vec3", first: IVec3Like, second: IVec3Like, out?: IVec3Like): Vec3
    export function sub(type: "Size", first: ISizeLike, second: ISizeLike, out?: ISizeLike): Size
    export function sub(type: "Rect", first: IRectLike, second: IRectLike, out?: IRectLike): Rect
    export function sub(type: "Quat", first: IQuatLike, second: IQuatLike, out?: IQuatLike): Quat
    export function sub(type: "Color", first: IColorLike, second: IColorLike, out?: IColorLike): Color
    export function sub(type: TValueType, first: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, second: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, out?: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like) {
        switch (type) {
            case "Vec2": {
                const _fx = (first as IVec2Like).x;
                const _fy = (first as IVec2Like).y;

                const _sx = (second as IVec2Like).x;
                const _sy = (second as IVec2Like).y;

                out = vec2(_fx - _sx, _fy - _sy);

                return out;
            }
            case "Vec3": {
                const _fx = (first as IVec3Like).x;
                const _fy = (first as IVec3Like).y;
                const _fz = (first as IVec3Like).z;

                const _sx = (second as IVec3Like).x;
                const _sy = (second as IVec3Like).y;
                const _sz = (second as IVec3Like).z;

                out = vec3(_fx - _sx, _fy - _sy, _fz - _sz);

                return out;
            }
            case "Size": {
                const _fw = (first as ISizeLike).width;
                const _fh = (first as ISizeLike).height;

                const _sw = (second as ISizeLike).width;
                const _sh = (second as ISizeLike).height;

                out = size(_fw - _sw, _fh - _sh);

                return out;
            }
            case "Rect": {
                const _fx = (first as IRectLike).x;
                const _fy = (first as IRectLike).y;
                const _fw = (first as IRectLike).width;
                const _fh = (first as IRectLike).height;

                const _sx = (second as IRectLike).x;
                const _sy = (second as IRectLike).y;
                const _sw = (second as IRectLike).width;
                const _sh = (second as IRectLike).height;

                out = rect(_fx - _sx, _fy - _sy, _fw - _sw, _fh - _sh);

                return out;
            }
            case "Color": {
                const _fr = (first as IColorLike).r;
                const _fg = (first as IColorLike).g;
                const _fb = (first as IColorLike).b;
                const _fa = (first as IColorLike).a;

                const _sr = (second as IColorLike).r;
                const _sg = (second as IColorLike).g;
                const _sb = (second as IColorLike).b;
                const _sa = (second as IColorLike).a;

                out = color(_fr - _sr, _fg - _sg, _fb - _sb, _fa - _sa);

                return out;
            }
            case "Quat": {
                const _fx = (first as IQuatLike).x;
                const _fy = (first as IQuatLike).y;
                const _fz = (first as IQuatLike).z;
                const _fw = (first as IQuatLike).w;

                const _sx = (second as IQuatLike).x;
                const _sy = (second as IQuatLike).y;
                const _sz = (second as IQuatLike).z;
                const _sw = (second as IQuatLike).w;

                out = quat(_fx - _sx, _fy - _sy, _fz - _sz, _fw - _sw);

                return out;
            }
        }
    }

    export function mul(type: "Vec2", first: IVec2Like, second: IVec2Like, out?: IVec2Like): Vec2
    export function mul(type: "Vec3", first: IVec3Like, second: IVec3Like, out?: IVec3Like): Vec3
    export function mul(type: "Size", first: ISizeLike, second: ISizeLike, out?: ISizeLike): Size
    export function mul(type: "Rect", first: IRectLike, second: IRectLike, out?: IRectLike): Rect
    export function mul(type: "Quat", first: IQuatLike, second: IQuatLike, out?: IQuatLike): Quat
    export function mul(type: "Color", first: IColorLike, second: IColorLike, out?: IColorLike): Color
    export function mul(type: TValueType, first: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, second: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like, out?: IColorLike | IQuatLike | IRectLike | ISizeLike | IVec2Like | IVec3Like) {
        switch (type) {
            case "Vec2": {
                const _fx = (first as IVec2Like).x;
                const _fy = (first as IVec2Like).y;

                const _sx = (second as IVec2Like).x;
                const _sy = (second as IVec2Like).y;

                out = vec2(_fx * _sx, _fy * _sy);

                return out;
            }
            case "Vec3": {
                const _fx = (first as IVec3Like).x;
                const _fy = (first as IVec3Like).y;
                const _fz = (first as IVec3Like).z;

                const _sx = (second as IVec3Like).x;
                const _sy = (second as IVec3Like).y;
                const _sz = (second as IVec3Like).z;

                out = vec3(_fx * _sx, _fy * _sy, _fz * _sz);

                return out;
            }
            case "Size": {
                const _fw = (first as ISizeLike).width;
                const _fh = (first as ISizeLike).height;

                const _sw = (second as ISizeLike).width;
                const _sh = (second as ISizeLike).height;

                out = size(_fw * _sw, _fh * _sh);

                return out;
            }
            case "Rect": {
                const _fx = (first as IRectLike).x;
                const _fy = (first as IRectLike).y;
                const _fw = (first as IRectLike).width;
                const _fh = (first as IRectLike).height;

                const _sx = (second as IRectLike).x;
                const _sy = (second as IRectLike).y;
                const _sw = (second as IRectLike).width;
                const _sh = (second as IRectLike).height;

                out = rect(_fx * _sx, _fy * _sy, _fw * _sw, _fh * _sh);

                return out;
            }
            case "Color": {
                const _fr = (first as IColorLike).r;
                const _fg = (first as IColorLike).g;
                const _fb = (first as IColorLike).b;
                const _fa = (first as IColorLike).a;

                const _sr = (second as IColorLike).r;
                const _sg = (second as IColorLike).g;
                const _sb = (second as IColorLike).b;
                const _sa = (second as IColorLike).a;

                out = color(_fr * _sr, _fg * _sg, _fb * _sb, _fa * _sa);

                return out;
            }
            case "Quat": {
                const _fx = (first as IQuatLike).x;
                const _fy = (first as IQuatLike).y;
                const _fz = (first as IQuatLike).z;
                const _fw = (first as IQuatLike).w;

                const _sx = (second as IQuatLike).x;
                const _sy = (second as IQuatLike).y;
                const _sz = (second as IQuatLike).z;
                const _sw = (second as IQuatLike).w;

                out = quat(_fx * _sx, _fy * _sy, _fz * _sz, _fw * _sw);

                return out;
            }
        }
    }

    export namespace Angle {
        export type TUnit = 'degree' | 'radian';
        export type TType = 'Ox' | 'Oy' | 'Oz' | 'Between'

        export function unit(_angle: number, _input: TUnit, _output: TUnit) {
            if(_input === _output) return _angle;

            if (_input === 'degree' && _output === 'radian') {
                return _angle * Math.PI / 180;
            }

            if (_input === 'radian' && _output === 'degree') {
                return _angle * 180 / Math.PI;
            }
        }

        export function length(_start: IVec3Like, _target: IVec3Like) {
            const vts = vec3(_start.x - _target.x, _start.y - _target.y, _start.z - _target.z);
            return Math.sqrt(vts.x ** 2 + vts.y ** 2);
        }

        export function between(_start: IVec3Like, _target: IVec3Like, _type: TType = 'Between', _unit: TUnit = 'radian') {
            const vts = vec3(_start.x - _target.x, _start.y - _target.y, _start.z - _target.z);
            const mts = Math.sqrt(vts.x ** 2 + vts.y ** 2);

            if (mts === 0) return 0 

            switch(_type) {
                case "Ox": {
                    return unit(Math.atan2(vts.y, vts.x), 'radian', _unit);
                }
                case "Oy": {
                    return unit(Math.atan2(vts.x, vts.y), 'radian', _unit);
                }
                case "Oz": {
                    return unit(Math.atan2(vts.x, vts.z), 'radian', _unit);
                }
                case "Between": {
                    const _dot = _start.x * _target.x + _start.y * _target.y + _start.z * _target.z;
                    const _mags = Math.sqrt(_start.x ** 2 + _start.y ** 2 + _start.z ** 2);
                    const _magt = Math.sqrt(_target.x ** 2 + _target.y ** 2 + _target.z ** 2);

                    if (_mags === 0 || _magt === 0) {
                        return 0;
                    }

                    const _cos = Math.max(-1, Math.min(1, _dot / (_mags * _magt)));
                    return unit(Math.acos(_cos), 'radian', _unit);
                }
            }
        }
    }

    export function is_odd(num: pFlex.TArray<number>, ...nums: number[]) {
        nums = pArray.flatter(num, ...nums);
        return nums.every( _num => _num % 2 !== 0 )
    }

    export function get_easing(_easing: pFunction.TType<[number], number> | TweenEasing) {
        if(!_easing) return easing.linear;

        if(typeof _easing === 'function') {
            return _easing;
        }

        const _easer = easing[_easing];

        return (typeof _easer === 'function') ? _easer : easing.linear;
    }
}

export default pMath;

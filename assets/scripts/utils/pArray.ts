
type _TFinder<TType> = (curr: TType, prev: TType, value: TType) => boolean;
const _h_smaller_finder: _TFinder<number> = (curr, prev, value) => (curr <= value && curr > prev)

export namespace pArray {
    export type TFlex<TTarget, TIsReadonly extends boolean = false> = pFlex.TArray<TTarget, TIsReadonly>

    export function chunks<_TArray>(array: _TArray[], size: number): _TArray[][] {
        if(size <= 0) return [array];

        const _result: _TArray[][] = [];
        for (let i = 0; i < array.length; i += size) {
            _result.push(array.slice(i, i + size));
        }
        return _result;
    }

    export function shift(arr: number[], centerValue: number): number[] {
        if (arr.length === 0) return [];

        const _valueIndex = arr.indexOf(centerValue);
        if (_valueIndex === -1) return [...arr];

        const _centerIndex = Math.floor((arr.length - 1) / 2);

        const _rotateCount = (_valueIndex - _centerIndex + arr.length) % arr.length;

        return [
            ...arr.slice(_rotateCount),
            ...arr.slice(0, _rotateCount)
        ];
    }

    export function flatter<T, TIsReadonly extends boolean = false>(target: pFlex.TArray<T, TIsReadonly>, ...targets: T[]): T[] {
        if(target === undefined && targets.length <= 0) return[]
        //@ts-ignore
        return [target, ...targets].flat();
    }

    export function find_smaller_nearest<T>(list: T[], prop: pFlex.TKeyOf<T, number>, value: number, mechanic: _TFinder<number> = _h_smaller_finder) {
        return list.reduce((prev, curr) => {
            if(curr[prop] === undefined || typeof curr[prop] === 'number') {
                const _curr = curr[prop] as number;
                const _prev = prev ? prev[prop] as number : Number.NEGATIVE_INFINITY;
                if(mechanic(_curr, _prev, value)) return curr;
            }
            return prev;
        }, undefined as T | undefined)
    }

    export function shuffle<TType>(array: TType[]) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    export function extract_equally(arr: number[], data: number[][] = []) {
        if(arr.every(a => a <= 0)) return data;

        const _min = min(arr, 0);
        const _root = arr.map(a => Math.max(a - _min, 0));
        const _left = arr.map(() => _min);
        data.push(_left);

        return extract_equally(_root, data);
    }

    export function min(arr: number[], above: number = 0) {
        arr = arr.filter( e => e > above );
        return Math.min(...arr);
    }

    export function no_duplicated<T>(array: T[], property: keyof T): T[] {
        const uniqueMap = new Map<any, T>();
        array.forEach(item => {
            const key = item[property];
            uniqueMap.set(key, item);
        });
        return Array.from(uniqueMap.values());
    }
}

export default pArray;

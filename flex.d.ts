declare type TOnOff = 'on' | 'off';

declare namespace pFlex {
	type TConstructor<TArgs = any, TInstance = any, TAbstract extends boolean = false> = TAbstract extends false ? new (...args: TArgs[]) => TInstance : abstract new (...args: TArgs[]) => TInstance;
	
	type TKey = string | symbol | number;
	type TReadonlyArray<TType> = (readonly TType[] | TType[])
	
	type TPrototype<T> = { prototype: T };
	type TRecorder<_TKey extends TKey, TValue = any> = Partial<Record<_TKey, TValue>>
	type TExtractKeyArray<TKeys extends TKey[], TValue = any> = { [K in TKeys[number]]: TValue }
	
	type TExtractKey<TObject extends object[], TKeyof extends keyof TObject[number], TValue> = {
	    [ Key in TObject[number] as Key[TKeyof] & string ]: TValue
	}
	
	type TStaticKeys<TTarget> = {
	    [K in keyof TTarget] : TTarget[K] extends Function ? K : never
	}[keyof TTarget];
	
	type TKeyOf<TTarget, TCondition = any, TExclude extends boolean = false> = {
	    [K in keyof TTarget]: 
	        TExclude extends true 
	            ? (TTarget[K] extends TCondition ? never : K) 
	            : (TTarget[K] extends TCondition ? K : never);
	}[keyof TTarget];
	
	type TStringRecord<_TKey extends TKey[], TPartial extends boolean = false, TReturn = string> = TPartial extends true ? Partial<Record<_TKey[number], string>> : Record<_TKey[number], TReturn>;
	
	type TArray<TTarget, TIsReadonly extends boolean = false> = TTarget | ( TIsReadonly extends true ? readonly TTarget[] : TTarget[] );
	
	type TOption<TData, TKey extends TKeyOf<TData>> = {
	    key: TKey
	    data: TData[TKey]
	}
	
	type TArg<TName extends string, TType> = TType | { [K in TName]: TType };

	type TBuildNumericRange<
		N extends number,
	  	Result extends Array<number> = [],
	  	Current extends number = Result['length']
	> = Current extends N
	  ? [...Result, Current]
	  : TBuildNumericRange<N, [...Result, Current], Current extends number ? TAddOne<Current> : never>;
	
	type TAddOne<N extends number> = [
	  ...Array<N>,
	  0
	]['length'] extends infer L ? L extends number ? L : never : never;
	
	type TNumberToString<N extends number> = `${N}`;
	
}

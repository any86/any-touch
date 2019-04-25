import { AnyTouch } from './AnyTouch';
import VueDirective from './vueDirective';
// interface ABC {
//     a: number,
//     b: string,
//     c: [number, string]
// }

// interface DEF {
//     d?: null,
//     e?: undefined,
//     f?: any
// }

// interface ACE {
//     a: number,
//     c: [number, string],
//     e?: undefined
// }
// type Key = keyof ABC;
// type A = Record<'a' | 'c', ABC>
// type B = Pick<DEF, 'd' | 'f'>
// type C = Partial<ABC>
// type D = Required<DEF>
// type E = Readonly<ABC> // { readonly a: number; readonly b: string; readonly c: [number, string]; }
// // 从"前面"排除"后面"也有类型
// type F = Exclude<'a' | 'b' | 'c', 'a' | 'e' | 'f'> // 'b'|'c'
// // 提取2者公有类型
// type G = Extract<'a' | 'b', 'a' | 'e'> // 'a'
// type H = NonNullable<DEF | null | undefined> // DEF
// type I = ReturnType<() => number> // number
// interface TestClass {
//     new(n:number, s:string):TestClass;
// }

// type J = InstanceType<TestClass>
// // extends {new (...args:any):any}
// type K = Parameters<(s:string,n:number)=>void>
// type L = ConstructorParameters<TestClass>
export default class extends AnyTouch {
    // vue指令版
    static vTouch = VueDirective;
}
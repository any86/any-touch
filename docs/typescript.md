# Typescript
any-touch导出了一些类型. 

```typescript
import {AnyTouchEvent} from 'any-touch';
```



针对自定义的手势, 比如上面的"双击", 在 ts 中我们需要进行"类型扩充声明", 声明文件如下:

```typescript
// global.d.ts
import tap from '@any-touch/tap';
declare module '@any-touch/core' {
    // 扩充at.get('doubletap')返回值的类型
    // 如不扩充, get返回的插件实例类型不完整.
    export interface PluginContextMap {
        doubletap: ReturnType<typeof tap>;
    }

    // 扩充at.on('doubletap',e=>{})中的e的类型
    export interface EventMap {
        doubletap: AnyTouchEvent;
    }
}
```

当然不写声明文件也可以, **偷懒的方法是**:

```typescript
// ⭐让"e"和tap事件的e的类型一致,
// 毕竟都是tap识别器衍生的事件
at.on('doubletap' as 'tap', (e) => {});

// ⭐返回tap识别器的实例,
// 其实就是同一个识别器的实例
at.get('doubletap' as 'tap');
```

**注意**: 上面 2 种写法都 ok, 在这里写声明文件和断言其实没区别, 都可以正确的推导出其他部分的类型.
[:rocket: 返回目录](#目录)
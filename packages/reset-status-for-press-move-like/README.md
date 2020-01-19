# Recognizer
所有手势的基类.

## index
基类

## const
状态常量

## recognizeForPressMoveLike
"按压拖拽"类手势的必要方法

## resetStatusForPressMoveLike
"按压拖拽"类手势的重置状态函数, 由于**press**手势只使用`resetStatusForPressMoveLike`而不用`recognizeForPressMoveLike`, 所以独立打包.
## :alien:  概念

### 识别器

**识别器**就是识别如下手势的代码逻辑: 点击(tap) | 拖拽(pan) | 划(swipe) | 捏合缩放(pinch) | 旋转(rotate).

### requireFailure

如果你需要某 2 个手势的触发条件是互斥的, 那么就需要通过 requireFailure 来标记他们, 当一个"识别失败"另一个才能触发, 如[单击和双击](#requireFailure)就是互斥关系的 2 个手势.
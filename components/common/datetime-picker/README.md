# zm-datetime-picker 日期选择器

> 例子：http://localhost:3000/demo/components/common
    使用v-model 绑定选定时间值，返回根据format属性格式化后的时间值
  
   <zm-datetime-picker label="入院时间" format="yyyy-MM-dd hh" placeholder="请输入入院时间" v-model="data1.inTime"></zm-datetime-picker>
# 属性
## label 属性
说明：标题
类型：string
可选值：-
默认值：-


## placeholder 属性
说明：提示占位符
类型：string
可选值：-
默认值：请输入日期时间

## type 属性
说明：标题
类型：string
可选值：'datetime' 日期时间, 'date' 日期, 'time' 时间
默认值：datetime

## format 属性
说明：时间格式化串
类型：string
可选值：如：“yyyy-MM-dd hh” “yyyy-MM-dd hh:mm” “yyyy年MM月dd日” 等等
默认值：yyyy-MM-dd hh:mm:ss


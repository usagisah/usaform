# 路径系统

表单的任意字段中都可以访问其他任意位置的字段内容，一般情况可以直接获取所有表单内容自取即可，可是例外情况就不好用了

1. 监听其他字段的修改
2. 批量操作
3. 在数组中，不知道开始字段是从哪开始的，需要以自身出发，找到相对路径的其他属性

路径系统的写法类似于文件路径，写法上是一个字符串，以 `/` 分割，默认是从发起者字段为起点开始查找

为了易用性和支持批量，内部会将路径字符串分割`split`，分出来的每块都会转成正则和每个字段名称匹配，正则会进行缓存，性能可以得以保障

查找规则如下，找不到会直接退出

- 一般查找
  - `a/b/c` 找自己下边的 a，a下边的 b，b下边的c
- 正则查找 && 批量查找
  - `a/.*/c`  找自己下边的 a，a 下边所有的字段，所有字段下边的 c
  - `a/[0-9]/c` 找自己下边的 a，a 下边 0-9 的字段（通常用于数组），所有字段下边的 c
- 根部查找
  - `~/a` 从最顶层找下边的 a
- 向上找
  - `../a` 找父节点下的 a
- 搜索全部
  - `xx/xx/all` 
    - 必须是以 `all` 结尾才会找全部，否则会视为一般查找被转成正则
    - 通常用于方法调用中`call/callLayout/callElement`，它可以无视表单的深度查找所有
  
- 返回自己
  - `""` 空字符会返回自身
  - 因为直接修改暴露出来的响应式变量会存在很多未知的边界情况，建议除了 `PlainField` 始终使用内部提供的操作方式，来修改自身或者其他字段的值

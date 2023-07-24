# cloud-image
使用例子：
```
<cloud-image name="avatar" v-model="formData.avatar"  size="390x566"></cloud-image>
```

参数说明：
```
@property {String} name  上传文件前缀
@property {String} title  提示标题
@property {String} tips  提示说明
@property {String,Array} value 变量，可以是字符串或者数组
@property {String} suffixIcon  默认图标
@property {Number} imageNumber  上传文件数量，默认1
@property {String} size  文件显示尺寸，宽x高，例如：300x200
@property {Boolean} isHold  是否可用一直上传
```

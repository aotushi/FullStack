---
alias:
---

# 来源
> [性能优化之全面图片改造方案 - 掘金 (juejin.cn)](https://juejin.cn/post/7099398268190195742)
> [关于图片性能优化，你必须知道的 - 掘金 (juejin.cn)](https://juejin.cn/post/6943205424023732237)


这篇文章的思路非常厉害,从原理到实践,通过实验推理得出结论.

# 概况

## 图片

### 种类
-   jpg/jpeg
-   png
-   gif
-   WebBP
-   Avif
-   Jpeg xl



## 无损or有损

### 有损压缩
> 一种数据压缩[1]方法，经过此方法压缩、解压的数据会与原始数据**不同但是非常接近**。有损数据压缩又称破坏性资料压缩、不可逆压缩。

由于有损压缩减少了文件本身的数据量，且以牺牲图像质量为代价，因此压缩后的文件无论是在磁盘占用还是内存占用上都会比原始图像要小。针对于目前探讨的图片加载方式，对应的都是有损压缩，目标都是更小的内存占用和更快的解码速度。

### 无损压缩
>资料经过压缩[3]后，信息不被破坏，还能完全恢复到压缩前的原样。相比之下，有损数据压缩[4]只允许一个近似原始资料进行重建，以换取更好的压缩率。

无损压缩的方法可以通过一些编码手段，用结构化的数据来减少对重复信息的磁盘占用，针对图片来说减少了图片在磁盘上的空间占用。但是并不能减少图像的内存占用量，这是因为，当从磁盘或网络请求上获取图像时，浏览器又会对图片进行解码，把丢失的像素用适当的颜色信息填充进来。

**因此如果要减少图像占用内存的容量，就必须使用有损压缩方法。**




## webp
### 概念
> WebP 是一种现代**图像格式**，可为 Web 上的图像提供卓越的**无损和有损**压缩。使用 WebP可以创建更小、更丰富的图像，从而使 Web 更快。与 PNG 相比，WebP 无损图像的大小要[小 26% 。](https://link.juejin.cn/?target=https%3A%2F%2Fdevelopers.google.com%2Fspeed%2Fwebp%2Fdocs%2Fwebp_lossless_alpha_study%23results "https://developers.google.com/speed/webp/docs/webp_lossless_alpha_study#results")在同等 [SSIM](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FStructural_similarity "https://en.wikipedia.org/wiki/Structural_similarity")质量指数下， WebP 有损图像比可比较的 JPEG 图像[小 25-34% 。](https://link.juejin.cn/?target=https%3A%2F%2Fdevelopers.google.com%2Fspeed%2Fwebp%2Fdocs%2Fwebp_study "https://developers.google.com/speed/webp/docs/webp_study")无损 WebP**支持透明度**（也称为 alpha 通道），成本仅为[22% 额外字节](https://link.juejin.cn/?target=https%3A%2F%2Fdevelopers.google.com%2Fspeed%2Fwebp%2Fdocs%2Fwebp_lossless_alpha_study%23results "https://developers.google.com/speed/webp/docs/webp_lossless_alpha_study#results")。对于可以接受有损 RGB 压缩的情况，**有损 WebP 还支持透明度**，通常提供比 PNG 小 3 倍的文件大小。

也可以戳这里看下社区其他同学做的对比[效果](https://link.juejin.cn/?target=https%3A%2F%2Fisparta.github.io%2Fcompare-webp%2Findex.html%2312345 "https://isparta.github.io/compare-webp/index.html#12345")


### 压缩技术
webp的压缩技术基于 [VP8](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FVP8 "https://en.wikipedia.org/wiki/VP8")关键帧编码，无损 WebP 压缩使用已知的图像片段来精确地重建新的像素，在无法找到相应的匹配值的情况下，使用本地调色板进行优化。在webp的开发者平台已经有详细的压缩技术的推演，可以直接戳[这里](https://link.juejin.cn/?target=https%3A%2F%2Fdevelopers.google.com%2Fspeed%2Fwebp%2Fdocs%2Fcompression "https://developers.google.com/speed/webp/docs/compression")看下。

### webp应用效果
随着浏览器对 WebP 支持的普及，目前也有越来越多的互联网开始使用 WebP，这里分享几个数据：
-   YouTube 的视频略缩图采用 WebP 后，网页加载速度提升了 10%；
-   Google Chrome 应用商店采用 WebP 后，每天可以节省几 TB 的带宽，页面加载时间减少了30% 左右；
-   花瓣网在 2017 年 5 月开启 WebP 后，在网站总体请求量没有减少的情况下，整体带宽下降了近 50%。
> **结论：无论是技术上还是使用上都已经得到了可行的验证，并且有明显收益。**


## 优化思路
图片的优化分为加载阶段和显示阶段。

### 加载阶段

#### 图片体积

图片体积直接反应了网路需要加载的时间，等同于磁盘占用，因此减少图片体积能直接减少图片请求的时间。进而在首屏提升FCP等相关指标，让浏览器能更快拿到数据进行绘制。

#### 内存占用

内存占用和图片体积不等同，两张不同体积的图片可能有着相同的内存占用，因此优化内存占用可以让浏览器解码图片和光栅化的时间减少，因为不需要计算绘制那么多的图片信息。光栅化时间的减少直接影响了页面的渲染速度，以及页面的卡顿。

### 显示阶段

#### 加载占位

占位图是为了给用户有感知的加载，提升用户体验。避免用户等待过程中的流失。

#### 懒加载

懒加载也已经是当前各种站点的常规优化手段，懒加载尽量减少了不必要的资源请求以提高浏览器的渲染效率，减少内存占用。并显著减少不必要的带宽，是为用户和公司都省钱的方式。

#### 格式回退

对于浏览器对不同格式的图片支持程度不同，我们的一些优化手段和格式可能不太适用所有浏览器，但是为了保证性能和体验并最大兼容支持的浏览器，我们需要对图片进行格式降级处理。如对于不支持webp的浏览器自动降级为png。

#### 错误占位

错误占位也是必要的一步，当所有的尝试都失败后我们也需要一种良好的方式展示并给用户感知到。比如目前业务内的错误展示。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdc09990554e4eb9a750aa959ee41829~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 实践-实验阶段


## 实践-稳定阶段




## 图片性能优化方向

图片引起的内存占用情况，如果说有多张高性能的图片可以考虑通过canvas进行渲染，但是只有单张的话就没有那么大的必要了，更好的方式是通过设备的具体情况来做响应式的图片，比如使用img的src，根据设备情况来渲染不同的倍图。
```html
<img src="./image/oranges@1x.png" srcset="./image/oranges@2x.png 1x,./image/oranges@3x.png 2x" />
```
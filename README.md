# 天球探索實驗室

適用於高中地球科學與師資培育的互動天球教材。

**直接操作：https://changyi123456.github.io/celestial-sphere-lab/**

## 操作內容

- 外部天球、地面觀測、地球近看三種視角。
- 地點、經緯度、日期、時區與時間控制；以真實星表計算恆星方向。
- 緯度與天極、恆星周日／周年視運動、四季太陽路徑操作引導。
- 觀測筆記、資料記錄、CSV匯出與可列印學習單。

以支援WebGL的瀏覽器開啟。手機可拖曳觀看並使用「放大」功能。
所有程式、星表與地球材質已嵌入`index.html`，沒有外部CDN相依。

## 原始碼與更新

`source/`包含可修改的HTML、CSS、JavaScript、星表、材質與Python封裝程式。

```sh
python3 source/build.py --output dist
cp "dist/天球探索實驗室.html" index.html
```

將更新的`index.html`推送到main分支後，GitHub Pages會重新發布。
完整操作與模型限制見網頁內「操作與課程」「資料來源與模型限制」以及`source/使用與修改說明.txt`。

## 資料來源與授權

- 星表：David Nash／Astronexus [HYG v4.1](https://github.com/astronexus/HYG-Database/tree/main/hyg/CURRENT)，擷取視星等≤6.5的8,920筆資料；擷取資料依[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)提供，保留姓名、座標、星等、色指數與自行。原始授權見`source/assets/HYG-LICENSE.txt`。
- 地理、地形、海陸與經編輯的雲層材質：Tom Patterson的Natural Earth III，經[Bjørn Sandvik的WebGL Earth](https://github.com/turban/webgl-earth)取得；材質已縮小為適合網頁的解析度。
- 夜間燈光：[NASA Earth Observatory Black Marble 2016](https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/)，經縮圖處理。
- Three.js r128與OrbitControls：MIT授權，見`source/assets/THREE-LICENSE.txt`。
- 計算方法參考[USNO](https://aa.usno.navy.mil/faq/alt_az)及[NOAA](https://gml.noaa.gov/grad/solcalc/calcdetails.html)。

這是2000–2050年的教學近似模型。地球與天體的大小、距離不依真實比例；未納入大氣折射、章動、光行差、月球、行星、實際地形與即時天氣。雲層和夜燈為合成素材，不是即時影像。幾何晝長不等同氣象預報的日出日落。

筆記與觀測資料只儲存在使用者自己的瀏覽器，不上傳到伺服器。

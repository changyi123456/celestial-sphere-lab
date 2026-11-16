from pathlib import Path
import json,base64,re,argparse

root=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description='將天球教材封裝成可離線開啟的單一HTML')
parser.add_argument('--output',default=str(root/'dist'),help='輸出資料夾；預設為原始碼旁的dist')
out=Path(parser.parse_args().output).resolve()
assets={}
for key in ['earth-day.jpg','earth-night.jpg','clouds.png','bump.jpg','water.png']:
    mime='image/png' if key.endswith('.png') else 'image/jpeg'
    assets[key]='data:'+mime+';base64,'+base64.b64encode((root/'assets'/key).read_bytes()).decode()
catalogue='const STAR_CATALOGUE='+ (root/'assets/stars.json').read_text()+';\nconst ASSETS='+json.dumps(assets,separators=(',',':'))+';'
(root/'catalogue.js').write_text(catalogue)
html=(root/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+(root/'style.css').read_text()+'</style>')
def inline(match):
    src=match.group(1)
    return '<script>'+re.sub(r'</script',r'<\\/script',(root/src).read_text(),flags=re.I)+'</script>'
html=re.sub(r'<script src="([^"]+)"></script>',inline,html)
out.mkdir(exist_ok=True)
dest=out/'天球探索實驗室.html'
dest.write_text(html)
print(str(dest),len(html.encode()),'bytes')

from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request, urlopen
from urllib.parse import unquote
import json, hashlib, re

ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'research/products.json').read_text())
def fetch(url):
    with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=45) as res:
        return res.read(),res.url
def audit(p):
    row={'key':p['key'],'product_url':p['url'],'original_file':p['file'],'image_url':data['images'][p['file']]}
    try:
        html,final_url=fetch(p['url'])
        html=unquote(html.decode('utf-8','replace'))
        image,final_image=fetch(row['image_url'])
        filename=unquote(row['image_url']).split('/')[-1]
        asset_id=row['image_url'].split('/resized/')[1].split('-1000')[0]
        row.update(final_product_url=final_url,image_identified_on_product_page=filename in html or asset_id in html,
                   original_matches_official_sha256=hashlib.sha256(image).hexdigest()==hashlib.sha256((ROOT/'assets'/p['file']).read_bytes()).hexdigest(),
                   sha256=hashlib.sha256(image).hexdigest())
        title=re.search(r'<h1[^>]*>(.*?)</h1>',html,re.S)
        row['page_heading']=re.sub('<[^>]+>','',title.group(1)).strip() if title else None
    except Exception as e:row['error']=str(e)
    return row
with ThreadPoolExecutor(max_workers=4) as pool: rows=list(pool.map(audit,data['products']))
report={'checked':'2026-09-22','products':rows,'hero':'AI composition based on official Brandon, Aron and engraved tag references; not an original Bakli photograph.'}
(ROOT/'research/source-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(rows,ensure_ascii=False,indent=2))

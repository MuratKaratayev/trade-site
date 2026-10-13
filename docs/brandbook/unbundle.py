import json,re,sys,base64,gzip,os
src,out=sys.argv[1],sys.argv[2]
t=open(src,encoding='utf-8').read()
def block(kind):
    m=re.search(r'<script type="__bundler/'+kind+r'">(.*?)</script>',t,re.S); return m.group(1) if m else None
man=json.loads(block('manifest'))
tmpl=json.loads(block('template'))
po=block('page_order'); er=block('ext_resources')
print('page_order',po[:500] if po else None); print('ext_resources',(er or '')[:500])
print('template type',type(tmpl), (len(tmpl) if hasattr(tmpl,'__len__') else ''))
ext={'text/html':'html','text/javascript':'js','application/javascript':'js','text/css':'css','image/png':'png','image/jpeg':'jpg','image/svg+xml':'svg','font/woff2':'woff2','image/webp':'webp'}
for u,e in man.items():
    b=base64.b64decode(e['data'])
    if e.get('compressed'): b=gzip.decompress(b)
    fn=f"{out}/{u}.{ext.get(e['mime'],'bin')}"
    open(fn,'wb').write(b); print(u,e['mime'],len(b))
open(f'{out}/_template.txt','w').write(tmpl if isinstance(tmpl,str) else json.dumps(tmpl,ensure_ascii=False))

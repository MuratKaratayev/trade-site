from PIL import Image, ImageFilter
import numpy as np
from collections import deque
K=8
src=Image.open('upscale-837x132.png').convert('RGB').crop((0,0,172,132))
big=src.resize((src.width*K,src.height*K),Image.LANCZOS).filter(ImageFilter.GaussianBlur(K*1.6))
a=np.array(big).astype(float)
# «не-белизна»: расстояние до белого
dist=np.sqrt(((255-a)**2).sum(2))
m=dist>110
H,W=m.shape
# компоненты на уменьшенной сетке для скорости (шаг 2)
ms=m[::2,::2]; h,w=ms.shape
lab=np.zeros((h,w),int);n=0;sizes={}
for y in range(h):
    for x in range(w):
        if ms[y,x] and not lab[y,x]:
            n+=1;q=deque([(y,x)]);lab[y,x]=n;c=0
            while q:
                cy,cx=q.popleft();c+=1
                for dy,dx in((1,0),(-1,0),(0,1),(0,-1)):
                    ny,nx=cy+dy,cx+dx
                    if 0<=ny<h and 0<=nx<w and ms[ny,nx] and not lab[ny,nx]:
                        lab[ny,nx]=n;q.append((ny,nx))
            sizes[n]=c
big_lab=np.kron(lab,np.ones((2,2),int))[:H,:W]
comps=sorted(sizes,key=lambda k:-sizes[k])
print('components',[(k,sizes[k]) for k in comps[:8]])
src_big=np.array(src.resize((src.width*K,src.height*K),Image.LANCZOS)).astype(int)
for i,k in enumerate(comps[:6]):
    if sizes[k]<500: break
    lm=(big_lab==k)
    for _ in range(4):  # наращиваем метку на 4 px, чтобы покрыть край полной маски без «лесенки»
        P=np.pad(lm,1); lm=lm|P[:-2,1:-1]|P[2:,1:-1]|P[1:-1,:-2]|P[1:-1,2:]
    mk=lm&m
    ys,xs=np.where(mk)
    core=mk&(dist>np.percentile(dist[mk],60))
    col=np.median(src_big[core],0).astype(int)
    print(i,'bbox orig',xs.min()/K,xs.max()/K,ys.min()/K,ys.max()/K,'color #%02x%02x%02x'%tuple(col))
    Image.fromarray(np.where(mk,0,255).astype(np.uint8)).convert('1').save(f'mark_{i}.pbm')

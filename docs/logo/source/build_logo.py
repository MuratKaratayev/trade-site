import json, math, sys
P=json.load(open('params2.json'))
COL=['#7B6758','#B5441E','#96351A']  # внешний, средний, верхний
import re
MARK=[re.findall(r'<path d="([^"]+)"',open(f'mark_{i}.svg').read(),re.S)[0].replace('\n',' ') for i in range(3)]
TEXT='#1B1B1F'
f=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')

# ── Серпы: эллипс A минус эллипс B (тот же поворот+th2, масштаб k, сдвиг d) ──
def crescent(p):
    cx,cy,rx,ry,th,dx,dy,k,th2=p
    A=(cx,cy,rx,ry,th); B=(cx+dx,cy+dy,rx*k,ry*k,th+th2)
    def pt(E,t):
        x0,y0,a,b,r=E; c,s=math.cos(r),math.sin(r); u,v=a*math.cos(t),b*math.sin(t)
        return (x0+u*c-v*s, y0+u*s+v*c)
    def inside(E,q):
        x0,y0,a,b,r=E; c,s=math.cos(r),math.sin(r); x,y=q[0]-x0,q[1]-y0
        u=(x*c+y*s)/a; v=(-x*s+y*c)/b; return u*u+v*v-1
    N=3600
    def transitions(E,other,want_out):
        ts=[2*math.pi*i/N for i in range(N)]
        st=[(inside(other,pt(E,t))>0)==want_out for t in ts]
        res=[]
        for i in range(N):
            if st[i]!=st[(i+1)%N]:
                lo,hi=ts[i],ts[i]+2*math.pi/N
                for _ in range(50):
                    m=(lo+hi)/2
                    if ((inside(other,pt(E,m))>0)==want_out)==st[i]: lo=m
                    else: hi=m
                res.append(((lo+hi)/2, st[i]))  # st[i]=True → выходим из нужного участка
        return res
    # участок A вне B
    tr=transitions(A,B,True); assert len(tr)==2, tr
    start=[t for t,was in tr if not was][0]; end=[t for t,was in tr if was][0]
    span=(end-start)%(2*math.pi)
    p1=pt(A,start); p2=pt(A,end)
    # B: участок внутри A, идём от p2 к p1
    trb=transitions(B,A,False); assert len(trb)==2, trb
    bs=[t for t,was in trb if not was][0]; be=[t for t,was in trb if was][0]
    # bs..be (по возрастанию) — внутри A; концы совпадают с p1/p2 — определяем направление
    q_bs=pt(B,bs)
    d2=lambda a,b:(a[0]-b[0])**2+(a[1]-b[1])**2
    spanb=(be-bs)%(2*math.pi)
    if d2(q_bs,p2)<d2(q_bs,p1):  # от p2 идём по возрастанию ψ
        sweepB=1
    else: sweepB=0
    largeA=1 if span>math.pi else 0
    largeB=1 if spanb>math.pi else 0
    rotA=math.degrees(A[4]); rotB=math.degrees(B[4])
    return (f'M{f(p1[0])} {f(p1[1])}A{f(A[2])} {f(A[3])} {f(rotA)} {largeA} 1 {f(p2[0])} {f(p2[1])}'
            f'A{f(B[2])} {f(B[3])} {f(rotB)} {largeB} {sweepB} {f(p1[0])} {f(p1[1])}Z')

# ── Надпись: прямые штрихи, скругления в углах (Q-кривые), затем наклон ──
BASE,CAP,XH,DESC=74.5,41.6,51.7,85.6
def poly(pts,closed=False):
    # pts: [(x,y,r)] — r: радиус скругления в этой вершине
    n=len(pts); out=[]
    def cut(a,b,r):
        dx,dy=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dy); r=min(r,L/2.01)
        return (a[0]+dx*r/L, a[1]+dy*r/L)
    seq=pts+[pts[0],pts[1]] if closed else pts
    if closed:
        a=cut(pts[0],pts[1],pts[0][2]) if pts[0][2] else pts[0]
        out.append(f'M{f(a[0])} {f(a[1])}')
        rng=range(1,n+1)
    else:
        out.append(f'M{f(pts[0][0])} {f(pts[0][1])}'); rng=range(1,n-1)
    for i in rng:
        v=seq[i]; prev=seq[i-1]; nxt=seq[i+1]; r=v[2]
        if r:
            a=cut(v,prev,r); b=cut(v,nxt,r)
            out.append(f'L{f(a[0])} {f(a[1])}Q{f(v[0])} {f(v[1])} {f(b[0])} {f(b[1])}')
        else: out.append(f'L{f(v[0])} {f(v[1])}')
    if closed: out.append('Z')
    else: out.append(f'L{f(pts[-1][0])} {f(pts[-1][1])}')
    return ''.join(out)
L=lambda *p: poly([(x,y,0) for x,y in p])
def lerp_x(a,b,y): return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1])
def und(x1,x2,top): return poly([(x1,top,0),(x1,BASE,3.2),(x2,top,3.2),(x2,BASE,0)])  # «И/и»
def en(x1,x2,bar=62.0): return [L((x1,XH),(x1,BASE)),L((x2,XH),(x2,BASE)),L((x1,bar),(x2,bar))]
A1,A2,A3=(262.4,BASE),(280.6,CAP),(299.6,BASE)
glyphs=[
 L((171.4,CAP),(210.0,CAP)), L((191.8,CAP),(191.8,BASE)),                                   # T
 L((218.3,CAP),(218.3,BASE)), poly([(218.3,CAP,0),(252.9,CAP,6.5),(252.9,59.2,5.0),(218.3,59.2,0)]), L((250.6,59.2),(250.9,BASE)),  # R
 poly([(A1[0],A1[1],0),(A2[0],A2[1],2.2),(A3[0],A3[1],0)]), L((lerp_x(A1,A2,64.5),64.5),(lerp_x(A3,A2,64.5),64.5)),  # A
 poly([(310.0,CAP,3.0),(347.1,CAP,8.0),(347.1,BASE,8.0),(310.0,BASE,3.0)],closed=True),     # D
 poly([(387.0,CAP,0),(357.4,CAP,3.0),(357.4,BASE,3.0),(387.0,BASE,0)]), L((357.4,57.5),(385.6,57.5)),  # E
 L((395.5,60.5),(409.0,60.5)),                                                               # -
 und(418.9,457.3,CAP),                                                                       # И
 *en(467.2,496.3),                                                                           # н
 L((527.0,XH),(527.0,BASE)), L((505.8,XH),(527.0,62.0),(505.8,BASE)), L((549.3,XH),(527.0,62.0),(549.3,BASE)),  # ж
 und(559.2,588.2,XH), *en(598.3,627.1), und(636.9,665.9,XH),                                 # и н и
 L((677.4,XH),(677.4,DESC)), poly([(677.4,XH,0),(704.9,XH,6.0),(704.9,BASE,6.0),(677.4,BASE,0)]),  # р
 und(715.3,744.4,XH), *en(754.2,783.1),                                                       # и н
 poly([(793.2,BASE,0),(793.2,XH,3.0),(816.2,XH,0)]),                                          # г
]
SW=3.95
skew=f'translate(0 {BASE}) skewX(-10.25) translate(0 -{BASE})'
VB=(14,18,817,90)  # x y w h
def svg(mark=True,text=True,vb=VB,text_color=TEXT):
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="TRADE-Инжиниринг">']
    if mark:
        parts.append('<g id="mark" transform="scale(0.125) translate(0 1056) scale(0.1 -0.1)">'+''.join(f'<path fill="{COL[i]}" d="{MARK[i]}"/>' for i in range(3))+'</g>')
    if text:
        parts.append(f'<g id="wordmark" fill="none" stroke="{text_color}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round" transform="{skew}">'+''.join(f'<path d="{d}"/>' for d in glyphs)+'</g>')
    parts.append('</svg>'); return '\n'.join(parts)
open('logo.svg','w').write(svg())
open('logo-mark.svg','w').write(svg(text=False,vb=(14,18,148,90)))
open('logo-ondark.svg','w').write(svg(text_color='#F2F3F4'))
print('ok')

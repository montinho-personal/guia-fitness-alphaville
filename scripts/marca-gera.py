import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
OUT=sys.argv[1]
F='/usr/share/fonts/opentype/inter/'
def texto(fonte,s,x,y,tam,track=0):
    f=TTFont(F+fonte); gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm; k=tam/upm
    hm=f['hmtx']; pen=SVGPathPen(gs); cx=x
    for ch in s:
        g=cmap[ord(ch)]
        tp=TransformPen(pen,(k,0,0,-k,cx,y)); gs[g].draw(tp)
        cx+=hm[g][0]*k+track
    return pen.getCommands(), cx-track
ORA1,ORA2,NAVY,CLARO='#FF9F00','#FF6A00','#111827','#E5E7EB'
def defs(id_='g'):
    return f'<linearGradient id="{id_}" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="{ORA1}"/><stop offset="1" stop-color="{ORA2}"/></linearGradient>'
def simbolo(furo,halter,swoosh,gid='g',com_swoosh=True,furo_cheio=True):
    # caixa 100 x 120
    pin='M50 118C40 103 8 78 8 45A42 42 0 1 1 92 45C92 78 60 103 50 118Z'
    if furo is None:
        pin+=' M50 17A27 27 0 1 0 50 71A27 27 0 1 0 50 17Z'
        hole=''
    else:
        hole='<circle cx="50" cy="44" r="27" fill="%s"/>'%furo
    db=f'<g transform="rotate(-28 50 44)" fill="{halter}"><rect x="33" y="40.5" width="34" height="7" rx="3.5"/><rect x="26" y="30" width="9" height="28" rx="3.5"/><rect x="18.5" y="34.5" width="7" height="19" rx="3"/><rect x="65" y="30" width="9" height="28" rx="3.5"/><rect x="74.5" y="34.5" width="7" height="19" rx="3"/></g>'
    sw=f'<path d="M-6 112C22 88 58 76 104 74C66 82 34 94 4 116Z" fill="{swoosh}"/>' if com_swoosh else ''
    # dobra da fita: faixa clara na base do pino
    dobra=f'<path d="M50 118C46 108 52 92 70 84C60 94 56 104 50 118Z" fill="{ORA1}" opacity=".55"/>'
    return f'<g transform="translate(6 0)"><path d="{pin}" fill="url(#{gid})" fill-rule="evenodd"/>{dobra}{hole}{db}{sw}</g>'
def svg(w,h,body,extra_defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><defs>{defs()}{extra_defs}</defs>{body}</svg>\n'
def horizontal(guia,linha_txt,furo,halter,swoosh):
    # símbolo 100x120 em (0,0); texto à direita
    d1,x1=texto('InterDisplay-BlackItalic.otf','Guia',120,78,74,-1)
    d2,x2=texto('InterDisplay-BlackItalic.otf','Fitness',x1+14,78,74,-1)
    larg=x2
    T=24
    d3,x3=texto('InterDisplay-ExtraBoldItalic.otf','ALPHAVILLE',0,0,T,0)
    alvo=(larg-120)-2*(46+16)
    esp=max(2,(alvo-x3)/9)
    d3,x3=texto('InterDisplay-ExtraBoldItalic.otf','ALPHAVILLE',0,0,T,esp)
    cx=120+(larg-120)/2; x0=cx-x3/2
    d3,x3=texto('InterDisplay-ExtraBoldItalic.otf','ALPHAVILLE',x0,112,T,esp)
    l1=f'<rect x="{x0-16-46:.1f}" y="101" width="46" height="4.5" rx="2.2" fill="{ORA2}"/>'
    l2=f'<rect x="{x3+16:.1f}" y="101" width="46" height="4.5" rx="2.2" fill="{ORA2}"/>'
    body=simbolo(furo,halter,swoosh)+f'<path d="{d1}" fill="{guia}"/><path d="{d2}" fill="url(#t)"/><path d="{d3}" fill="{linha_txt}"/>'+l1+l2
    tg=f'<linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{ORA1}"/><stop offset=".55" stop-color="{ORA2}"/></linearGradient>'
    return svg(round(larg+4),122,body,tg)
def empilhado(guia,linha_txt,furo,halter,swoosh):
    d1,x1=texto('InterDisplay-BlackItalic.otf','Guia',104,52,56,-1)
    d2,x2=texto('InterDisplay-BlackItalic.otf','Fitness',100,100,56,-1)
    larg=max(x1,x2)
    d3,x3=texto('InterDisplay-ExtraBoldItalic.otf','ALPHAVILLE',0,0,15,0)
    esp=4.2
    d3,x3=texto('InterDisplay-ExtraBoldItalic.otf','ALPHAVILLE',0,0,15,esp)
    total=larg+4; cx=total/2+10; x0=cx-x3/2
    d3,x3=texto('InterDisplay-ExtraBoldItalic.otf','ALPHAVILLE',x0,140,15,esp)
    l1=f'<rect x="{x0-46:.1f}" y="133" width="34" height="3.4" rx="1.7" fill="{ORA2}"/>'
    l2=f'<rect x="{x3+12:.1f}" y="133" width="34" height="3.4" rx="1.7" fill="{ORA2}"/>'
    tg=f'<linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{ORA1}"/><stop offset=".55" stop-color="{ORA2}"/></linearGradient>'
    body='<g transform="translate(0 4) scale(.95)">'+simbolo(furo,halter,swoosh)+'</g>'+f'<path d="{d1}" fill="{guia}"/><path d="{d2}" fill="url(#t)"/><path d="{d3}" fill="{linha_txt}"/>'+l1+l2
    return svg(round(max(total,x3+50)),150,body,tg)
open(OUT+'/logo.svg','w').write(horizontal(NAVY,NAVY,None,NAVY,NAVY))
open(OUT+'/logo-dark.svg','w').write(horizontal('#FFFFFF',CLARO,NAVY,'#FFFFFF','#FFFFFF'))
open(OUT+'/logo-footer.svg','w').write(empilhado(NAVY,NAVY,None,NAVY,NAVY))
open(OUT+'/logo-footer-dark.svg','w').write(empilhado('#FFFFFF',CLARO,NAVY,'#FFFFFF','#FFFFFF'))
# favicon / símbolo: furo escuro, halter branco, sem swoosh (legível em 16px)
open(OUT+'/favicon.svg','w').write(svg(100,120,simbolo(NAVY,'#FFFFFF','#FFFFFF',com_swoosh=False)).replace('viewBox="0 0 100 120" width="100" height="120"','viewBox="-4 0 120 120" width="120" height="120"'))
# ícone de app: quadro escuro com símbolo e swoosh branco
tile=lambda r: svg(512,512,f'<rect width="512" height="512" rx="{r}" fill="{NAVY}"/><g transform="translate(116 86) scale(2.8)">'+simbolo(NAVY,'#FFFFFF','#FFFFFF')+'</g>')
open(OUT+'/icon-tile.svg','w').write(tile(112))
open(OUT+'/icon-square.svg','w').write(tile(0))

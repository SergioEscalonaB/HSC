import os
from PIL import Image, ImageDraw, ImageFont
import numpy as np

os.makedirs('assets/images/logo', exist_ok=True)
os.makedirs('assets/images/hero', exist_ok=True)
os.makedirs('assets/images/nosotros', exist_ok=True)
os.makedirs('assets/images/servicios/01-ingenieria-civil', exist_ok=True)
os.makedirs('assets/images/servicios/02-estructuras-metalicas', exist_ok=True)
os.makedirs('assets/images/servicios/03-montajes-electromecanicos', exist_ok=True)
os.makedirs('assets/images/servicios/04-obras-urbanismo', exist_ok=True)
os.makedirs('assets/images/servicios/05-mano-de-obra', exist_ok=True)
os.makedirs('assets/images/servicios/06-mecanizado-industrial', exist_ok=True)
os.makedirs('assets/images/proyectos/01-ternium-bahia-deprimido', exist_ok=True)
os.makedirs('assets/images/proyectos/02-ternium-bascula-industrial', exist_ok=True)
os.makedirs('assets/images/proyectos/03-ternium-naves-manizales', exist_ok=True)
os.makedirs('assets/images/proyectos/04-ternium-montajes-adecuaciones', exist_ok=True)
os.makedirs('assets/images/proyectos/05-ternium-atlantico-infraestructura', exist_ok=True)
os.makedirs('assets/images/proyectos/06-ternium-atlantico-mantenimiento', exist_ok=True)
os.makedirs('assets/images/proyectos/07-molinos-tres-castillos', exist_ok=True)
os.makedirs('assets/images/proyectos/08-proyectos-sociales', exist_ok=True)
os.makedirs('assets/images/clientes', exist_ok=True)

def find_photo_box(im_arr, search_box):
    x1, y1, x2, y2 = search_box
    region = im_arr[y1:y2, x1:x2]
    diff = np.abs(region[:, :, :3].astype(int) - np.array([241, 245, 246])).sum(axis=-1)
    diff2 = np.abs(region[:, :, :3].astype(int) - np.array([255, 255, 255])).sum(axis=-1)
    diff3 = np.abs(region[:, :, :3].astype(int) - np.array([245, 246, 248])).sum(axis=-1)
    mask = (diff > 25) & (diff2 > 25) & (diff3 > 25)
    
    row_prof = mask.sum(axis=1)
    col_prof = mask.sum(axis=0)
    
    valid_rows = np.where(row_prof > region.shape[1] * 0.25)[0]
    valid_cols = np.where(col_prof > region.shape[0] * 0.25)[0]
    
    if len(valid_rows) > 0 and len(valid_cols) > 0:
        return (int(x1 + valid_cols[0]), int(y1 + valid_rows[0]), int(x1 + valid_cols[-1]), int(y1 + valid_rows[-1]))
    return search_box

def create_canva_placeholder(path, title, subtitle):
    w, h = 800, 600
    img = Image.new('RGB', (w, h), color='#73bdf8')
    draw = ImageDraw.Draw(img)
    
    # Sky gradient effect
    for y in range(int(h * 0.65)):
        r = int(115 + (180 - 115) * (y / (h * 0.65)))
        g = int(189 + (220 - 189) * (y / (h * 0.65)))
        b = int(248 + (255 - 248) * (y / (h * 0.65)))
        draw.line([(0, y), (w, y)], fill=(r, g, b))
        
    # Sun / Cloud
    draw.ellipse([w*0.35, h*0.12, w*0.48, h*0.28], fill=(255, 255, 255, 220))
    draw.ellipse([w*0.42, h*0.08, w*0.58, h*0.28], fill=(255, 255, 255, 240))
    draw.ellipse([w*0.52, h*0.12, w*0.65, h*0.28], fill=(255, 255, 255, 220))
    
    # Back hill
    draw.ellipse([-w*0.2, h*0.45, w*0.7, h*1.2], fill='#8bc34a')
    # Front hill
    draw.ellipse([w*0.25, h*0.52, w*1.3, h*1.3], fill='#5b9a28')
    
    # Card banner overlay
    card_margin = 40
    card_h = 130
    card_y = h - card_h - 30
    draw.rounded_rectangle([card_margin, card_y, w - card_margin, h - 30], radius=16, fill=(11, 26, 46, 235), outline='#0ea5e9', width=2)
    
    # Text
    draw.text((card_margin + 24, card_y + 20), "📷 " + title, fill='#ffffff')
    draw.text((card_margin + 24, card_y + 52), subtitle, fill='#38bdf8')
    draw.text((card_margin + 24, card_y + 82), "Reemplazar en: " + path.replace('\\', '/'), fill='#94a3b8')
    
    img.save(path, quality=92)
    print(f"Created Canva placeholder: {path}")

# 1. Logo
im1 = Image.open('brochure/1.jpg')
logo_white = im1.crop((440, 360, 1480, 640))
logo_white.save('assets/images/logo/hsc-logo-white.png')

im2 = Image.open('brochure/2.jpg')
logo_dark = im2.crop((1710, 40, 1895, 115))
logo_dark.save('assets/images/logo/hsc-logo-nav.png')
print("Logos saved")

# 2. Nosotros / Hero
team_p2 = im2.crop((0, 0, 774, 1080))
team_p2.save('assets/images/nosotros/equipo-operativo.jpg', quality=95)

im10 = Image.open('brochure/10.jpg')
team_p10 = im10.crop((0, 0, 915, 1080))
team_p10.save('assets/images/nosotros/personal-calificado.jpg', quality=95)

hero_bg = im1.crop((0, 0, 1920, 1080))
hero_bg.save('assets/images/hero/hero-bg.jpg', quality=90)
print("Nosotros and Hero saved")

# 3. Servicios Grid Pages (4, 5, 6, 7, 8)
# Page 4: Civil (right)
im4 = Image.open('brochure/4.jpg')
im4.crop((889, 213, 1320, 589)).save('assets/images/servicios/01-ingenieria-civil/foto-1.jpg', quality=95)
im4.crop((1384, 213, 1815, 589)).save('assets/images/servicios/01-ingenieria-civil/foto-2.jpg', quality=95)
im4.crop((889, 621, 1320, 975)).save('assets/images/servicios/01-ingenieria-civil/foto-3.jpg', quality=95)
im4.crop((1384, 621, 1815, 975)).save('assets/images/servicios/01-ingenieria-civil/foto-4.jpg', quality=95)

# Page 5: Estructuras (left)
im5 = Image.open('brochure/5.jpg')
im5.crop((107, 229, 536, 603)).save('assets/images/servicios/02-estructuras-metalicas/foto-1.jpg', quality=95)
im5.crop((600, 229, 1030, 603)).save('assets/images/servicios/02-estructuras-metalicas/foto-2.jpg', quality=95)
im5.crop((107, 635, 536, 959)).save('assets/images/servicios/02-estructuras-metalicas/foto-3.jpg', quality=95)
im5.crop((600, 635, 1030, 959)).save('assets/images/servicios/02-estructuras-metalicas/foto-4.jpg', quality=95)

# Page 6: Montajes Electromecánicos (right)
im6 = Image.open('brochure/6.jpg')
im6.crop((889, 213, 1320, 589)).save('assets/images/servicios/03-montajes-electromecanicos/foto-1.jpg', quality=95)
im6.crop((1384, 213, 1815, 589)).save('assets/images/servicios/03-montajes-electromecanicos/foto-2.jpg', quality=95)
im6.crop((889, 621, 1320, 975)).save('assets/images/servicios/03-montajes-electromecanicos/foto-3.jpg', quality=95)
im6.crop((1384, 621, 1815, 975)).save('assets/images/servicios/03-montajes-electromecanicos/foto-4.jpg', quality=95)

# Page 7: Urbanismo (left)
im7 = Image.open('brochure/7.jpg')
im7.crop((107, 229, 536, 603)).save('assets/images/servicios/04-obras-urbanismo/foto-1.jpg', quality=95)
im7.crop((600, 229, 1030, 603)).save('assets/images/servicios/04-obras-urbanismo/foto-2.jpg', quality=95)
im7.crop((107, 635, 536, 959)).save('assets/images/servicios/04-obras-urbanismo/foto-3.jpg', quality=95)
im7.crop((600, 635, 1030, 959)).save('assets/images/servicios/04-obras-urbanismo/foto-4.jpg', quality=95)

# Page 8: Mano de Obra (right)
im8 = Image.open('brochure/8.jpg')
im8.crop((889, 213, 1320, 589)).save('assets/images/servicios/05-mano-de-obra/foto-1.jpg', quality=95)
im8.crop((1384, 213, 1815, 589)).save('assets/images/servicios/05-mano-de-obra/foto-2.jpg', quality=95)
im8.crop((889, 621, 1320, 975)).save('assets/images/servicios/05-mano-de-obra/foto-3.jpg', quality=95)
im8.crop((1384, 621, 1815, 975)).save('assets/images/servicios/05-mano-de-obra/foto-4.jpg', quality=95)

# Page 9: Canva placeholders for Mecanizado
create_canva_placeholder('assets/images/servicios/06-mecanizado-industrial/foto-1.jpg', 'Foto 1: Fabricación de Piezas Industriales', 'Mecanizado de precisión según planos')
create_canva_placeholder('assets/images/servicios/06-mecanizado-industrial/foto-2.jpg', 'Foto 2: Mecanizado de Precisión', 'Torno, fresado y acabados metalmecánicos')
create_canva_placeholder('assets/images/servicios/06-mecanizado-industrial/foto-3.jpg', 'Foto 3: Producción bajo Especificaciones', 'Control dimensional y tolerancias')
create_canva_placeholder('assets/images/servicios/06-mecanizado-industrial/foto-4.jpg', 'Foto 4: Componentes a Medida', 'Repuestos y ensambles industriales especiales')

print("Services photos processed successfully")

# 4. Proyectos
# Page 12 overview:
im12 = Image.open('brochure/12.jpg')
im12.crop((107, 328, 631, 687)).save('assets/images/proyectos/01-ternium-bahia-deprimido/foto-2.jpg', quality=95)
im12.crop((699, 328, 1223, 687)).save('assets/images/proyectos/03-ternium-naves-manizales/foto-1.jpg', quality=95)
im12.crop((1289, 328, 1811, 687)).save('assets/images/proyectos/07-molinos-tres-castillos/foto-2.jpg', quality=95)

# Page 13: Obra Civil y Proyectos Sociales (2x2 cards)
im13 = Image.open('brochure/13.jpg')
arr13 = np.array(im13)
# Card 1 (top-left: Bahía Deprimido)
b1 = find_photo_box(arr13, (150, 220, 880, 480))
im13.crop(b1).save('assets/images/proyectos/01-ternium-bahia-deprimido/foto-1.jpg', quality=95)
# Card 2 (top-right: Báscula Industrial)
b2 = find_photo_box(arr13, (980, 220, 1720, 480))
im13.crop(b2).save('assets/images/proyectos/02-ternium-bascula-industrial/foto-1.jpg', quality=95)
# Card 3 (bottom-left: Colegio Juan XXIII)
b3 = find_photo_box(arr13, (150, 620, 880, 860))
im13.crop(b3).save('assets/images/proyectos/08-proyectos-sociales/foto-1.jpg', quality=95)
# Card 4 (bottom-right: Colegio María Auxiliadora)
b4 = find_photo_box(arr13, (980, 620, 1720, 860))
im13.crop(b4).save('assets/images/proyectos/08-proyectos-sociales/foto-2.jpg', quality=95)

# Also secondary photo for Báscula
im13.crop((1400, 220, 1720, 460)).save('assets/images/proyectos/02-ternium-bascula-industrial/foto-2.jpg', quality=95)

# Page 14: Naves Industriales (2 photos)
im14 = Image.open('brochure/14.jpg')
arr14 = np.array(im14)
b14_1 = find_photo_box(arr14, (120, 250, 900, 620))
b14_2 = find_photo_box(arr14, (980, 250, 1800, 620))
im14.crop(b14_1).save('assets/images/proyectos/03-ternium-naves-manizales/foto-fragmentacion.jpg', quality=95)
im14.crop(b14_2).save('assets/images/proyectos/03-ternium-naves-manizales/foto-2.jpg', quality=95)

# Page 15: Montaje y Adecuaciones (3 photos)
im15 = Image.open('brochure/15.jpg')
arr15 = np.array(im15)
b15_1 = find_photo_box(arr15, (100, 240, 660, 620))
b15_2 = find_photo_box(arr15, (680, 240, 1240, 620))
b15_3 = find_photo_box(arr15, (1260, 240, 1820, 620))
im15.crop(b15_1).save('assets/images/proyectos/04-ternium-montajes-adecuaciones/foto-1.jpg', quality=95)
im15.crop(b15_2).save('assets/images/proyectos/04-ternium-montajes-adecuaciones/foto-2.jpg', quality=95)
im15.crop(b15_3).save('assets/images/proyectos/04-ternium-montajes-adecuaciones/foto-3.jpg', quality=95)

# Page 16: Infraestructura y Adecuaciones (4 cards)
im16 = Image.open('brochure/16.jpg')
arr16 = np.array(im16)
b16_1 = find_photo_box(arr16, (150, 220, 880, 480))
b16_2 = find_photo_box(arr16, (980, 220, 1720, 480))
b16_3 = find_photo_box(arr16, (150, 620, 880, 860))
b16_4 = find_photo_box(arr16, (980, 620, 1720, 860))
im16.crop(b16_1).save('assets/images/proyectos/05-ternium-atlantico-infraestructura/foto-1.jpg', quality=95)
im16.crop(b16_2).save('assets/images/proyectos/05-ternium-atlantico-infraestructura/foto-2.jpg', quality=95)
im16.crop(b16_3).save('assets/images/proyectos/05-ternium-atlantico-infraestructura/foto-3.jpg', quality=95)
im16.crop(b16_4).save('assets/images/proyectos/05-ternium-atlantico-infraestructura/foto-4.jpg', quality=95)

# Page 17: Operación y Mantenimiento (3 photos)
im17 = Image.open('brochure/17.jpg')
arr17 = np.array(im17)
b17_1 = find_photo_box(arr17, (150, 220, 880, 480))
b17_2 = find_photo_box(arr17, (980, 220, 1720, 480))
b17_3 = find_photo_box(arr17, (500, 620, 1420, 860))
im17.crop(b17_1).save('assets/images/proyectos/06-ternium-atlantico-mantenimiento/foto-1.jpg', quality=95)
im17.crop(b17_2).save('assets/images/proyectos/06-ternium-atlantico-mantenimiento/foto-2.jpg', quality=95)
im17.crop(b17_3).save('assets/images/proyectos/06-ternium-atlantico-mantenimiento/foto-3.jpg', quality=95)

# Page 18: Molinos 3 Castillos (1 photo)
im18 = Image.open('brochure/18.jpg')
arr18 = np.array(im18)
b18_1 = find_photo_box(arr18, (100, 250, 1000, 850))
im18.crop(b18_1).save('assets/images/proyectos/07-molinos-tres-castillos/foto-1.jpg', quality=95)

print("Project photos processed successfully")

# 5. Clientes
im19 = Image.open('brochure/19.jpg')
im19.crop((50, 220, 1870, 860)).save('assets/images/clientes/clientes-mural.png')
print("Clients mural saved")

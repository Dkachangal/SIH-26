from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from rembg import remove
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
import cv2
import io
import os
import time

app = FastAPI()

ENHANCED_DIR = "enhanced_images"
os.makedirs(ENHANCED_DIR, exist_ok=True)
app.mount("/enhanced_images", StaticFiles(directory=ENHANCED_DIR), name="enhanced_images")
BASE_URL = os.getenv("ENHANCER_BASE_URL", "http://localhost:8001")


# ---------------------------------------------------------------------------
# Color correction 
# ---------------------------------------------------------------------------

def auto_white_balance(img_cv):
    result = cv2.cvtColor(img_cv, cv2.COLOR_BGR2LAB)
    avg_a = np.average(result[:, :, 1])
    avg_b = np.average(result[:, :, 2])
    result[:, :, 1] = result[:, :, 1] - ((avg_a - 128) * (result[:, :, 0] / 255.0) * 1.1)
    result[:, :, 2] = result[:, :, 2] - ((avg_b - 128) * (result[:, :, 0] / 255.0) * 1.1)
    return cv2.cvtColor(result, cv2.COLOR_LAB2BGR)


def auto_contrast_lighting(img_cv):
    lab = cv2.cvtColor(img_cv, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8, 8))
    l2 = clahe.apply(l)
    lab2 = cv2.merge((l2, a, b))
    return cv2.cvtColor(lab2, cv2.COLOR_LAB2BGR)


def correct_product_colors(fg_image: Image.Image) -> Image.Image:
    r, g, b, a = fg_image.split()
    rgb = Image.merge("RGB", (r, g, b))

    img_cv = cv2.cvtColor(np.array(rgb), cv2.COLOR_RGB2BGR)
    img_cv = auto_white_balance(img_cv)
    img_cv = auto_contrast_lighting(img_cv)
    corrected_rgb = Image.fromarray(cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB))
    corrected_rgb = corrected_rgb.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=3))

    r2, g2, b2 = corrected_rgb.split()
    return Image.merge("RGBA", (r2, g2, b2, a))


# ---------------------------------------------------------------------------
# Scene building
# ---------------------------------------------------------------------------

def add_padding(fg_image: Image.Image, padding_ratio: float = 0.2) -> Image.Image:
    w, h = fg_image.size
    pad_w = int(w * padding_ratio)
    pad_h = int(h * padding_ratio)
    canvas = Image.new("RGBA", (w + pad_w * 2, h + pad_h * 2), (0, 0, 0, 0))
    canvas.paste(fg_image, (pad_w, pad_h), fg_image)
    return canvas


def create_gradient_background(width, height, top_color=(196, 188, 205), bottom_color=(140, 132, 150)):
    """Muted color gradient 'wall' (dusty mauve-gray by default) instead of
    flat white. Swap top_color/bottom_color for other muted palettes, e.g.
    sage:  (198, 205, 190) -> (150, 160, 140)
    slate: (188, 196, 205) -> (120, 130, 145)
    clay:  (210, 190, 175) -> (160, 135, 120)
    """
    t = np.linspace(0, 1, height, dtype=np.float32).reshape(height, 1, 1)
    top = np.array(top_color, dtype=np.float32).reshape(1, 1, 3)
    bottom = np.array(bottom_color, dtype=np.float32).reshape(1, 1, 3)
    gradient = (top * (1 - t) + bottom * t).astype(np.uint8)
    gradient = np.repeat(gradient, width, axis=1)
    return Image.fromarray(gradient, mode="RGB")


def create_wall_shadow(fg_image: Image.Image, blur_radius=30, offset=(18, 18), opacity=90):
    """Casts a soft shadow of the product's own silhouette directly behind it
    (offset diagonally, like light coming from the front-top-left), instead of
    squashing it into a floor shadow. Reads as the product mounted in front of
    a wall with the wall catching its shadow."""
    alpha = fg_image.split()[-1]
    width, height = fg_image.size

    shadow_alpha = alpha.filter(ImageFilter.GaussianBlur(blur_radius))
    shadow_alpha = shadow_alpha.point(lambda p: min(p, opacity))

    shadow_layer = Image.new("RGBA", (width, height), (20, 18, 22, 0))
    shadow_layer.putalpha(shadow_alpha)

    offset_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    offset_layer.paste(shadow_layer, offset, shadow_layer)
    return offset_layer


def compose_scene(fg_image: Image.Image) -> Image.Image:
    width, height = fg_image.size
    background = create_gradient_background(width, height).convert("RGBA")

    shadow = create_wall_shadow(
        fg_image,
        blur_radius=max(12, int(height * 0.035)),
        offset=(int(width * 0.03), int(height * 0.03)),
        opacity=90,
    )

    scene = Image.alpha_composite(background, shadow)
    scene = Image.alpha_composite(scene, fg_image)
    return scene.convert("RGB")


@app.post("/enhance")
async def enhance(image: UploadFile = File(...)):
    raw = await image.read()

    no_bg_bytes = remove(raw)
    fg_image = Image.open(io.BytesIO(no_bg_bytes)).convert("RGBA")

    fg_image = add_padding(fg_image, padding_ratio=0.2)
    fg_image = correct_product_colors(fg_image)
    final_pil = compose_scene(fg_image)

    final_pil = ImageEnhance.Brightness(final_pil).enhance(1.02)
    final_pil = ImageEnhance.Color(final_pil).enhance(1.05)

    filename = f"enhanced_{int(time.time() * 1000)}.jpg"
    filepath = os.path.join(ENHANCED_DIR, filename)
    final_pil.save(filepath, format="JPEG", quality=92)

    return {
        "enhancedImageUrl": f"{BASE_URL}/enhanced_images/{filename}"
    }
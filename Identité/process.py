import cv2
import numpy as np
import sys

def main():
    img_path = 'Favicon agrolide.png'
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print("Failed to load image")
        return

    # Extract alpha channel
    if img.shape[2] == 4:
        alpha = img[:, :, 3]
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, alpha = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY_INV)

    h, w = alpha.shape
    thickness = 3
    print(f"Image size: {w}x{h}, using stroke thickness: {thickness}")

    # SSAA: Scale up 4x for perfect anti-aliasing
    scale = 4
    w_scaled, h_scaled = w * scale, h * scale

    # Upsample with cubic interpolation to smooth the original curves
    alpha_scaled = cv2.resize(alpha, (w_scaled, h_scaled), interpolation=cv2.INTER_CUBIC)

    # Threshold to get a crisp binary mask
    _, alpha_binary = cv2.threshold(alpha_scaled, 127, 255, cv2.THRESH_BINARY)

    # Create a circular kernel for the stroke
    kernel_size = thickness * scale
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))

    # Calculate centered stroke (morphological gradient)
    dilated = cv2.dilate(alpha_binary, kernel)
    eroded = cv2.erode(alpha_binary, kernel)
    stroke_mask_scaled = cv2.subtract(dilated, eroded)

    # Downsample back to original size with Area interpolation (this performs the anti-aliasing)
    stroke_mask = cv2.resize(stroke_mask_scaled, (w, h), interpolation=cv2.INTER_AREA)

    # Build the final output images
    out_white = np.zeros((h, w, 4), dtype=np.uint8)
    out_white[:, :, 0:3] = 255
    out_white[:, :, 3] = stroke_mask

    out_black = np.zeros((h, w, 4), dtype=np.uint8)
    out_black[:, :, 0:3] = 0
    out_black[:, :, 3] = stroke_mask

    cv2.imwrite('favicon-contour-blanc.png', out_white)
    cv2.imwrite('favicon-contour-noir.png', out_black)

    print("Done")

if __name__ == "__main__":
    main()

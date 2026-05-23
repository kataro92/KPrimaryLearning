# Trống Đồng — glTF asset

Place the downloaded model here:

- **`scene.gltf`** (+ `scene.bin`, `textures/`) — default from `npm run fetch:models`
- or a single **`dong-son-drum.glb`** if you export/convert manually

## Source (Sketchfab)

- **Model:** [Trống Đồng Đông Sơn (Dong Son bronze drum)](https://sketchfab.com/3d-models/trong-ong-ong-son-dong-son-bronze-drum-c91e55f6db8742f09ad2d5815ca6b749)
- **Author:** [@Aaannnn](https://sketchfab.com/Aaannnn)
- **License:** [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) — credit required

## Download options

1. **Manual:** Open the model page → **Download 3D Model** → choose **glTF** or **GLB** → save as `dong-son-drum.glb` in this folder.

2. **Script (API token):** Create a [Sketchfab API token](https://sketchfab.com/settings/password), then from the repo root:

   ```bash
   SKETCHFAB_API_TOKEN=your_token npm run fetch:models
   ```

If the file is missing, the game uses a lightweight procedural bronze drum in the hero pane.

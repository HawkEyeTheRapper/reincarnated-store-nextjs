import os
import shutil

source_dir = '/home/admiralswan/Desktop/extraction/reincarnated-store/.idea/old-bucket-files-astro/astro-omniversal-aether/public/assets'
dest_dir = '/home/admiralswan/Desktop/extraction/reincarnated-store/public/assets'

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

for root, dirs, files in os.walk(source_dir):
    for file in files:
        src_file = os.path.join(root, file)
        rel_path = os.path.relpath(src_file, source_dir)
        dest_file = os.path.join(dest_dir, rel_path)
        
        dest_folder = os.path.dirname(dest_file)
        if not os.path.exists(dest_folder):
            os.makedirs(dest_folder)
            
        shutil.copy2(src_file, dest_file)
        print(f"Copied {src_file} to {dest_file}")

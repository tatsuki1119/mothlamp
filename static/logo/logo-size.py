import subprocess

orig = "logo.png"
size_list = [16, 32, 180, 256]
for s in size_list:
    subprocess.run(f"ffmpeg -i {orig} -vf scale={s}:{s} logo-{s}.png")

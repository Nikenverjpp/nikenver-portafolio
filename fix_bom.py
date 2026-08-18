from pathlib import Path

root = Path(r"C:/Users/Nikenver/Projects/nikenver-portfolio")

# Convert UTF-16 frontend TS files to UTF-8 and remove UTF-8 BOM from backend PHP files.
for p in root.rglob("frontend/src/**/*.ts"):
    data = p.read_bytes()
    if data.startswith(b"\xff\xfe") or data.startswith(b"\xfe\xff") or (len(data) >= 2 and data[1] == 0):
        text = data.decode("utf-16")
        p.write_text(text, encoding="utf-8")
        print("converted utf-16", p)

for p in root.rglob("backend/**/*.php"):
    data = p.read_bytes()
    if data.startswith(b"\xef\xbb\xbf"):
        p.write_bytes(data[3:])
        print("removed bom", p)

print("done")

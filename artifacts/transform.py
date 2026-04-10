import re

path = 'c:/Users/asifj/Downloads/WorkSphere_FINAL/WorkSphere_FINAL/frontend/src/utils/dummyData.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    items_raw = match.group(1)
    items = [x.strip().strip('\'' + '\"') for x in items_raw.split(',')]
    cat = items[0]
    servs = ', '.join([f"'{x}'" for x in items])
    return f"category: '{cat}', services: [{servs}]"

content = re.sub(r'skills:\s*\[(.*?)\]', replacer, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done transforming dummy data schema!')

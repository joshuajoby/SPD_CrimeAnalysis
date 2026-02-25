import sys

with open('fetch_news.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_loop = False
for i, line in enumerate(lines):
    if i < 14: # Keep lines 0-13 (imports and logger)
        new_lines.append(line)
        continue
    
    if "def fetch_and_store" in line:
        new_lines.extend([
            '# List of all Indian states/UTs for comprehensive crime databank\n',
            'STATES = [\n',
            '    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",\n',
            '    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",\n',
            '    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",\n',
            '    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",\n',
            '    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"\n',
            ']\n\n',
            'import urllib3\n',
            'urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)\n\n',
            'def fetch_and_store(db_path: Optional[str] = None) -> None:\n',
            '    logger.info("Fetching historical news from Google RSS for multiple states...")\n',
            '    new_count = 0\n',
            '    with get_connection(db_path) as conn:\n',
            '        cursor = conn.cursor()\n',
            '        \n',
            '        for state in STATES:\n',
            '            query = f"crime+{state.replace(\' \', \'+\')}"\n',
            '            rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"\n',
            '            logger.info(f"Fetching crime news for {state}...")\n',
            '            \n',
            '            try:\n',
            '                resp = requests.get(rss_url, timeout=15)\n',
            '                resp.raise_for_status()\n',
            '                root = ET.fromstring(resp.content)\n',
            '            except Exception as exc:\n',
            '                logger.error("Failed fetch/parse for %s: %s", state, exc)\n',
            '                continue\n\n'
        ])
        in_loop = True
        continue
    
    if in_loop:
        if "for item in root.findall" in line:
            new_lines.append("            for item in root.findall(\".//item\"):\n")
            
            # Now we add 4 spaces to everything after this until we reach the final logger.info
            for j in range(i+1, len(lines)):
                if "logger.info(" in lines[j] and 'News fetch complete' in lines[j]:
                    new_lines.append(lines[j]) # Keep original indentation
                    
                    # Add the remaining lines exactly as they are
                    for k in range(j+1, len(lines)):
                        new_lines.append(lines[k])
                    break
                
                if len(lines[j].strip()) > 0:
                    new_lines.append("    " + lines[j])
                else:
                    new_lines.append("\n")
            break

with open('fetch_news.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Modification complete.")

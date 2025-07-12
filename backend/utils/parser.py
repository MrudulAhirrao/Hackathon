import re

def split_into_sections(paper: str) -> dict:
    section_titles = [
        "Abstract", "Introduction", "Related Work", "Methodology", "Results", "Conclusion", "References"
    ]

    # Pattern to match headers like **Abstract**, **Introduction**, etc.
    # It looks for two asterisks, then the title, then two more asterisks,
    # followed by optional spaces/colon/dash and a newline.
    # The `(?m)` flag makes `^` and `$` match start/end of lines (multiline mode).
    # `\s*[:\-]?\s*` allows for optional colon/dash and spaces.
    # `\n` ensures it ends with a newline, making sure we match distinct headers.
    pattern = r"(?m)^\*\*(" + "|".join(section_titles) + r")\*\*\s*[:\-]?\s*\n"

    matches = list(re.finditer(pattern, paper))

    result = {}
    
    # Define all expected keys to ensure they are always present, even if empty
    section_keys = [
        "title",
        "abstract", "introduction", "related_work", "methodology",
        "results", "conclusion", "references"
    ]
    
    # Initialize all sections to empty string
    for key in section_keys:
        result[key] = ""

    # Heuristic for title extraction: The first non-header line before any sections.
    # Or assume the first block before the first header is the title.
    first_header_start = matches[0].start() if matches else len(paper)
    potential_title_content = paper[0:first_header_start].strip()
    
    # If the potential title content is short and doesn't look like a full abstract,
    # consider it the title. Otherwise, it might be abstract if no proper header found first.
    if potential_title_content and len(potential_title_content) < 200: # Heuristic
        # Simple title cleanup: take the first line that doesn't start with **
        first_line_match = re.match(r"^(.*?)\n", potential_title_content)
        if first_line_match:
            result["title"] = first_line_match.group(1).strip()
        else:
            result["title"] = potential_title_content # If only one line
    else:
        result["title"] = "Generated Research Paper" # Default if no clear title is found early

    if not matches:
        print("❌ No explicit section headers matched. Assigning ALL content to abstract as fallback.")
        result["abstract"] = paper.strip() # In this case, the whole thing is the abstract
        return result

    # Iterate through matches to extract content for each found section
    for i, match in enumerate(matches):
        # Extract the title string (e.g., "Abstract", "Introduction")
        title_raw = match.group(1) # Using group(1) to get the text inside the ( ) from the pattern
        
        # Convert to snake_case for dictionary keys
        # Specific mapping for consistency with frontend interface
        if title_raw.lower() == "related work":
            title_key = "related_work"
        elif title_raw.lower() == "results": # This will catch "Results" and "Results and Discussion"
            title_key = "results"
        else:
            title_key = title_raw.lower().replace(" ", "_").replace("-", "_")
        
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(paper)
        
        content = paper[start:end].strip()
        
        if title_key in result:
            result[title_key] = content
        else:
            print(f"⚠️ Warning: Unrecognized section key '{title_key}' from raw title '{title_raw}'. Content not assigned to a specific field.")

    print("✅ Parsed Sections:", [key for key, value in result.items() if value]) # Only print non-empty keys for brevity
    
    return result
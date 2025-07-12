def apply_formatting(paper_content: str, paper_format: str) -> str:
    if paper_format.lower() == "ieee":
        return f"📘 IEEE FORMATTED:\n\n{paper_content}"
    elif paper_format.lower() == "springer":
        return f"📕 Springer FORMAT:\n\n{paper_content}"
    elif paper_format.lower() == "elsevier":
        return f"📗 Elsevier FORMAT:\n\n{paper_content}"
    else:
        return f"📄 {paper_format.upper()} FORMAT:\n\n{paper_content}"
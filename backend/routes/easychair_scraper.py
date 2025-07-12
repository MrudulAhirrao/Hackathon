from fastapi import APIRouter, HTTPException, Query # Import Query for defining query parameters
from fastapi.responses import JSONResponse
import requests
from bs4 import BeautifulSoup
import time
import random
import logging

# Configure logging for this module to provide detailed console output
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO) # Set logging level to INFO
handler = logging.StreamHandler() # Output logs to console
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

router = APIRouter()

@router.get(
    "/scrape/easychair",
    summary="Scrape and filter conference data from EasyChair CFP",
    response_description="A list of dictionaries, each representing a conference with its details, filtered by provided criteria."
)
async def scrape_easychair_cfp(
    # Define query parameters the endpoint expects
    # 'None' makes them optional, but the frontend will always send a value.
    # 'description' provides helpful info for API documentation (e.g., in Swagger UI).
    domain: str = Query(None, description="Domain to filter conferences by (e.g., 'Artificial Intelligence'). Matches against conference topics."),
    paper_type: str = Query(None, description="Paper type (e.g., 'Research Paper'). Note: This parameter is received but not directly used for filtering from EasyChair's scraped data as it's not available on the page."),
    format: str = Query(None, description="Preferred format (e.g., 'IEEE Format'). Note: This parameter is received but not directly used for filtering from EasyChair's scraped data as it's not available on the page.")
):
    """
    Scrapes conference data (Acronym, Name, Location, Submission Deadline, Start Date, Topics)
    from the EasyChair Call for Papers (CFP) website.

    This endpoint first fetches all available conferences from the EasyChair CFP page.
    It then filters these conferences based on the `domain` provided in the query parameters,
    by checking if any of the conference's listed topics (case-insensitively) contain the
    specified domain.

    Parameters like `paper_type` and `format` are accepted but are currently not used
    for filtering, as this specific information is not explicitly available on the
    EasyChair CFP listing page.

    **Ethical Considerations & Best Practices for Web Scraping:**
    - **Respect robots.txt**: Always check `https://easychair.org/robots.txt` before scraping.
      This code does not programmatically check it, so manual verification is required.
      (For EasyChair, the `/cfp/` path is typically allowed).
    - **Rate Limiting**: A random delay is implemented before making the HTTP request to avoid
      overloading the target server and to mimic human browsing behavior. This helps prevent
      your IP from being blocked.
    - **User-Agent**: A custom User-Agent header is sent with the request to identify your scraper.
      This is good practice for transparency.
    - **Terms of Service**: Always ensure compliance with the target website's Terms of Service.
      Scraping publicly available data is generally permissible, but specific usage might be restricted.
    """
    url = "https://easychair.org/cfp/"
    headers = {
        'User-Agent': 'ConferenceFinderAPI/1.0 (contact: your_email@example.com; purpose: academic research)'
    }

    logger.info(f"Attempting to scrape EasyChair CFP from: {url}")
    # Log the received filtering criteria for debugging
    logger.info(f"Received filtering criteria: Domain='{domain}', Paper Type='{paper_type}', Format='{format}'")

    try:
        # Introduce a small random delay before making the HTTP request
        delay = random.uniform(1, 3) # Delay between 1 and 3 seconds to be polite
        time.sleep(delay)
        logger.info(f"Waiting for {delay:.2f} seconds before making the request...")

        # Make the HTTP GET request to the EasyChair CFP page
        # Added a timeout to prevent the request from hanging indefinitely
        response = requests.get(url, headers=headers, timeout=30)
        logger.info(f"Received HTTP response from EasyChair with status code: {response.status_code}")

        # Raise an HTTPError for bad responses (4xx or 5xx client/server errors)
        response.raise_for_status()
        logger.info("HTTP response status is OK (2xx). Proceeding to parse content.")

    except requests.exceptions.Timeout:
        # Handle cases where the request takes too long to get a response
        logger.error(f"Timeout occurred while fetching {url} after 30 seconds.")
        raise HTTPException(status_code=504, detail="Request to EasyChair timed out. The server might be slow to respond.")
    except requests.exceptions.RequestException as e:
        # Handle other request-related errors (e.g., network issues, DNS errors)
        logger.error(f"An error occurred while fetching EasyChair CFP page: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch EasyChair CFP page due to a network or request error: {e}")

    logger.info("Parsing HTML content with BeautifulSoup...")
    soup = BeautifulSoup(response.text, 'html.parser')
    all_conferences_data = [] # List to store all scraped conferences before filtering

    # CSS selector to find all conference entries.
    # 'table#ec\\:table1' targets the table with id 'ec:table1'.
    # 'tbody' targets the table body.
    # 'tr.green' targets table rows with the class 'green', which represent individual conferences.
    logger.info("Searching for conference entries using CSS selector 'table#ec\\:table1 tbody tr.green'...")
    conference_entries = soup.select('table#ec\\:table1 tbody tr.green')
    logger.info(f"Found {len(conference_entries)} potential conference entries in total.")

    if not conference_entries:
        logger.warning("No conference entries found with the specified selector. The HTML structure of EasyChair might have changed or the page is empty.")
        return JSONResponse(content=[], status_code=200) # Return empty list if no entries found

    # Iterate through each identified conference row to extract details
    for i, entry in enumerate(conference_entries):
        # Get all table data cells (<td>) within the current row
        cols = entry.find_all('td')

        # Basic validation: Ensure the row has enough columns to extract all expected data
        if len(cols) < 6:
            logger.warning(f"Skipping row {i+1} due to insufficient columns ({len(cols)} found). Expected at least 6.")
            continue

        # Extract Acronym and Link (from the first <td>)
        acronym_link_tag = cols[0].find('a')
        acronym = acronym_link_tag.text.strip() if acronym_link_tag else "N/A"
        link = acronym_link_tag['href'] if acronym_link_tag and 'href' in acronym_link_tag.attrs else "N/A"
        # Prepend base URL if the link is relative (e.g., /cfp/...)
        if link and not link.startswith(('http://', 'https://')):
            link = f"https://easychair.org{link}"

        # Extract Full Name (from the second <td>)
        name = cols[1].text.strip() if cols[1] else "N/A"

        # Extract Location (from the third <td>)
        location = cols[2].text.strip() if cols[2] else "N/A"

        # Extract Submission Deadline (from the fourth <td>)
        submission_deadline_span = cols[3].find('span', class_='cfp_date')
        submission_deadline = submission_deadline_span.text.strip() if submission_deadline_span else "N/A"

        # Extract Start Date (from the fifth <td>)
        start_date_span = cols[4].find('span', class_='cfp_date')
        start_date = start_date_span.text.strip() if start_date_span else "N/A"

        # Extract Topics (from the sixth <td>)
        topics_list = []
        # Topics are links containing spans with the 'tag' class
        for topic_link in cols[5].find_all('a'):
            topic_span = topic_link.find('span', class_='tag')
            if topic_span:
                topics_list.append(topic_span.text.strip())
        topics = topics_list if topics_list else ["N/A"] # Ensure it's always a list, even if empty

        # Create a dictionary for the current conference and add to the list
        conference = {
            "acronym": acronym,
            "name": name,
            "link": link,
            "location": location,
            "submission_deadline": submission_deadline,
            "start_date": start_date,
            "topics": topics
        }
        all_conferences_data.append(conference)

    # --- Backend Filtering Logic based on 'domain' parameter ---
    filtered_conferences = []
    if domain: # If a domain parameter was provided by the frontend
        selected_domain_lower = domain.lower() # Convert to lowercase for case-insensitive matching
        logger.info(f"Applying backend filter for domain: '{selected_domain_lower}'")
        for conf in all_conferences_data:
            # Check if any of the conference's topics (converted to lowercase)
            # contains the selected domain (also lowercase).
            # This allows for partial matches, e.g., "AI" matching "artificial intelligence".
            if any(selected_domain_lower in topic.lower() for topic in conf['topics']):
                filtered_conferences.append(conf)
    else:
        # If no domain parameter is provided, return all scraped conferences
        logger.info("No domain filter provided. Returning all scraped conferences.")
        filtered_conferences = all_conferences_data

    # Log the number of conferences after filtering
    logger.info(f"Scraped {len(all_conferences_data)} total conferences. Returning {len(filtered_conferences)} after filtering by domain.")
    return JSONResponse(content=filtered_conferences, status_code=200)


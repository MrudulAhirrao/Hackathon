import httpx
import os
from dotenv import load_dotenv
from utils.parser import split_into_sections
from utils.formatter import apply_formatting
import urllib.parse
import feedparser
import asyncio
import json
from typing import Dict, List, Optional, Tuple
import time
import random
from datetime import datetime, timedelta
import logging

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RateLimitManager:
    """Advanced rate limit and circuit breaker manager"""
    
    def __init__(self):
        self.model_status = {}
        self.last_request_time = {}
        self.failure_count = {}
        self.circuit_breaker = {}
        self.backoff_multiplier = {}
        
    def is_model_available(self, model_name: str) -> bool:
        """Check if model is available (not in circuit breaker state)"""
        if model_name not in self.circuit_breaker:
            return True
            
        breaker_info = self.circuit_breaker[model_name]
        if time.time() > breaker_info['reset_time']:
            # Reset circuit breaker
            del self.circuit_breaker[model_name]
            self.failure_count[model_name] = 0
            logger.info(f"🔄 Circuit breaker reset for {model_name}")
            return True
            
        return False
    
    def record_failure(self, model_name: str, error_type: str):
        """Record failure and potentially trigger circuit breaker"""
        self.failure_count[model_name] = self.failure_count.get(model_name, 0) + 1
        
        # Trigger circuit breaker after 3 failures
        if self.failure_count[model_name] >= 3:
            reset_time = time.time() + (300 * self.failure_count[model_name])  # 5-25 minutes
            self.circuit_breaker[model_name] = {
                'reset_time': reset_time,
                'reason': error_type
            }
            logger.warning(f"⚠️ Circuit breaker triggered for {model_name} - cooldown until {datetime.fromtimestamp(reset_time)}")
    
    def record_success(self, model_name: str):
        """Record successful request"""
        self.failure_count[model_name] = 0
        if model_name in self.circuit_breaker:
            del self.circuit_breaker[model_name]
    
    def get_backoff_delay(self, model_name: str, attempt: int) -> float:
        """Get exponential backoff delay with jitter"""
        base_delay = min(2 ** attempt, 60)  # Cap at 60 seconds
        jitter = random.uniform(0.5, 1.5)
        return base_delay * jitter
    
    def should_retry(self, model_name: str, attempt: int, max_retries: int = 3) -> bool:
        """Determine if we should retry with this model"""
        return attempt < max_retries and self.is_model_available(model_name)

class PaperGenerator:
    def __init__(self):
        self.rate_limit_manager = RateLimitManager()
        self.models = [
            {
                "name": "meta-llama/llama-4-maverick-17b-128e-instruct:free",
                "max_tokens": 8000,
                "description": "Meta Llama 4 Maverick",
                "priority": 1,
                "max_retries": 3,
                "base_delay": 2
            },
            {
                "name": "google/gemma-2-9b-it:free",
                "max_tokens": 6000,
                "description": "Google Gemma 2 9B",
                "priority": 2,
                "max_retries": 3,
                "base_delay": 1
            },
            {
                "name": "microsoft/phi-3-mini-128k-instruct:free",
                "max_tokens": 4000,
                "description": "Microsoft Phi-3 Mini",
                "priority": 3,
                "max_retries": 2,
                "base_delay": 1
            }
        ]
        
        # Request queue to manage concurrent requests
        self.request_semaphore = asyncio.Semaphore(2)  # Max 2 concurrent requests
        self.global_request_delay = 1.0  # Global minimum delay between requests

    async def fetch_enhanced_arxiv(self, topic: str, max_results: int = 5) -> str:
        """Enhanced arXiv fetching with retry logic"""
        max_attempts = 2
        
        for attempt in range(max_attempts):
            try:
                search_queries = [
                    f"all:{topic}",
                    f"ti:{topic}",
                    f"abs:{topic}"
                ]
                
                all_articles = []
                
                for query in search_queries:
                    try:
                        encoded_query = urllib.parse.quote_plus(query)
                        base_url = f"https://export.arxiv.org/api/query?search_query={encoded_query}&start=0&max_results={max_results}&sortBy=submittedDate&sortOrder=descending"
                        
                        async with httpx.AsyncClient(timeout=20.0) as client:
                            response = await client.get(base_url)
                            response.raise_for_status()
                            
                        feed = feedparser.parse(response.text)
                        
                        for entry in feed.entries[:2]:
                            title = entry.title.replace('\n', ' ').strip()
                            summary = entry.summary.replace('\n', ' ').strip()[:300] + "..."
                            published = entry.published[:10] if hasattr(entry, 'published') else "Recent"
                            
                            article_info = f"• **{title}** ({published})\n  {summary}"
                            if article_info not in all_articles:
                                all_articles.append(article_info)
                        
                        await asyncio.sleep(0.5)  # Rate limiting for arXiv
                        
                    except Exception as e:
                        logger.warning(f"⚠️ Query '{query}' failed: {str(e)}")
                        continue
                
                if all_articles:
                    logger.info(f"✅ Found {len(all_articles)} arXiv papers")
                    return "\n\n".join(all_articles[:6])
                
            except Exception as e:
                logger.error(f"❌ arXiv attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_attempts - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
        
        return "No recent papers found on arXiv for this topic."

    async def generate_with_model_retry(self, model_info: Dict, prompt: str) -> Optional[str]:
        """Generate content with advanced retry logic"""
        model_name = model_info["name"]
        max_retries = model_info.get("max_retries", 3)
        
        # Check circuit breaker
        if not self.rate_limit_manager.is_model_available(model_name):
            logger.warning(f"⚠️ {model_info['description']} is in circuit breaker state")
            return None
        
        for attempt in range(max_retries):
            try:
                # Apply rate limiting
                async with self.request_semaphore:
                    if attempt > 0:
                        delay = self.rate_limit_manager.get_backoff_delay(model_name, attempt)
                        logger.info(f"⏰ Waiting {delay:.1f}s before retry {attempt + 1}")
                        await asyncio.sleep(delay)
                    
                    # Global request spacing
                    await asyncio.sleep(self.global_request_delay)
                    
                    result = await self._make_api_request(model_info, prompt, attempt)
                    
                    if result:
                        self.rate_limit_manager.record_success(model_name)
                        return result
                    
            except Exception as e:
                error_msg = str(e).lower()
                
                # Classify error types
                if "rate limit" in error_msg or "429" in error_msg:
                    logger.warning(f"⏰ Rate limit hit for {model_info['description']} (attempt {attempt + 1})")
                    self.rate_limit_manager.record_failure(model_name, "rate_limit")
                    
                    # Dynamic delay based on rate limit
                    if "retry-after" in error_msg:
                        # Try to extract retry-after value
                        import re
                        match = re.search(r'retry-after[:\s]+(\d+)', error_msg)
                        if match:
                            retry_after = int(match.group(1))
                            await asyncio.sleep(min(retry_after, 60))  # Cap at 60s
                    else:
                        await asyncio.sleep(self.rate_limit_manager.get_backoff_delay(model_name, attempt))
                
                elif "timeout" in error_msg or "connection" in error_msg:
                    logger.warning(f"🔌 Connection issue with {model_info['description']} (attempt {attempt + 1})")
                    await asyncio.sleep(min(5 * (attempt + 1), 30))  # Progressive delay
                
                elif "server" in error_msg or "500" in error_msg or "502" in error_msg or "503" in error_msg:
                    logger.warning(f"🚨 Server error with {model_info['description']} (attempt {attempt + 1})")
                    self.rate_limit_manager.record_failure(model_name, "server_error")
                    await asyncio.sleep(min(10 * (attempt + 1), 60))
                
                else:
                    logger.error(f"❌ Unexpected error with {model_info['description']}: {e}")
                    self.rate_limit_manager.record_failure(model_name, "unknown_error")
                    break  # Don't retry on unknown errors
                
                # Check if we should continue retrying
                if not self.rate_limit_manager.should_retry(model_name, attempt + 1, max_retries):
                    logger.warning(f"⚠️ Stopping retries for {model_info['description']}")
                    break
        
        return None

    async def _make_api_request(self, model_info: Dict, prompt: str, attempt: int) -> Optional[str]:
        """Make the actual API request"""
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Research Paper Generator Pro",
            "User-Agent": f"PaperGenerator/1.0 (attempt-{attempt})"
        }
        
        # Adjust parameters based on model and attempt
        temperature = 0.7 + (0.1 * attempt)  # Slightly increase creativity on retries
        max_tokens = max(model_info["max_tokens"] - (attempt * 500), 2000)  # Reduce tokens on retries
        
        payload = {
            "model": model_info["name"],
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": min(temperature, 1.0),
            "top_p": 0.9,
            "frequency_penalty": 0.1,
            "presence_penalty": 0.1,
            "stream": False
        }
        
        timeout_duration = 120.0 + (attempt * 30)  # Progressive timeout
        
        try:
            logger.info(f"🤖 Requesting {model_info['description']} (attempt {attempt + 1}, tokens: {max_tokens})")
            
            async with httpx.AsyncClient(timeout=timeout_duration) as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                logger.info(f"📡 Response: {response.status_code}")
                
                if response.status_code == 200:
                    response_data = response.json()
                    
                    if "choices" in response_data and len(response_data["choices"]) > 0:
                        paper_text = response_data["choices"][0]["message"]["content"]
                        
                        if paper_text and len(paper_text.strip()) > 500:
                            logger.info(f"✅ Success with {model_info['description']} ({len(paper_text)} chars)")
                            return paper_text
                        else:
                            logger.warning(f"⚠️ Response too short from {model_info['description']}")
                            return None
                    else:
                        logger.error(f"❌ No choices in response from {model_info['description']}")
                        return None
                
                elif response.status_code == 429:
                    # Extract retry-after if available
                    retry_after = response.headers.get('retry-after', '30')
                    raise Exception(f"Rate limit exceeded, retry-after: {retry_after}")
                
                elif response.status_code in [500, 502, 503, 504]:
                    raise Exception(f"Server error: {response.status_code}")
                
                else:
                    try:
                        error_detail = response.json()
                        error_message = error_detail.get('error', {}).get('message', f"HTTP {response.status_code}")
                        raise Exception(f"API Error: {error_message}")
                    except:
                        raise Exception(f"HTTP Error: {response.status_code}")
                        
        except httpx.TimeoutException:
            raise Exception(f"Request timeout after {timeout_duration}s")
        except Exception as e:
            raise e

    def create_adaptive_prompt(self, topic: str, paper_type: str, arxiv_summary: str, model_info: Dict) -> str:
        """Create adaptive prompt based on model capabilities"""
        
        # Adjust prompt complexity based on model
        if "phi-3" in model_info["name"].lower():
            # Simpler prompt for Phi-3
            return f"""Write a complete {paper_type} paper on "{topic}". Use these exact sections:

**Abstract**
Write a 150-200 word summary of the research.

**Introduction**
Provide background and research objectives.

**Methodology**
Describe the research approach and methods.

**Results**
Present key findings and analysis.

**Conclusion**
Summarize findings and future work.

**References**
Include at least 8 academic references.

Research context: {arxiv_summary[:1000]}

Write in formal academic style with technical details."""
        
        else:
            # Full prompt for more capable models
            return f"""You are a world-class academic researcher. Write a comprehensive {paper_type} paper on: "{topic}"

**STRUCTURE (use exact headers):**

**Abstract**
Write a detailed 200-300 word abstract summarizing research problem, methodology, findings, and implications.

**Introduction**
Provide comprehensive background, problem definition, research objectives, and contribution statement.

**Related Work**
Review existing literature, identify gaps, and position this work in the research landscape.

**Methodology**
Describe research approach, experimental design, data collection, and analysis methods.

**Results**
Present comprehensive findings with detailed analysis and interpretation.

**Discussion**
Analyze implications, discuss limitations, and compare with existing work.

**Conclusion**
Summarize contributions, implications, and future research directions.

**References**
Include 12+ properly formatted academic references.

**Research Context:**
{arxiv_summary}

**Requirements:**
- Formal academic language
- Technical depth and rigor
- Original insights and analysis
- Minimum 2500 words
- Proper citations throughout

Generate the complete paper now:"""

    async def generate_paper_with_fallback(self, topic: str, paper_type: str, paper_format: str) -> Dict:
        """Main generation method with robust fallback"""
        
        if not OPENROUTER_API_KEY:
            raise ValueError("OpenRouter API key not found. Please set OPENROUTER_API_KEY in your .env file")
        
        logger.info(f"🚀 Starting paper generation: {topic}")
        
        # Fetch research context
        logger.info("📚 Fetching arXiv research...")
        arxiv_summary = await self.fetch_enhanced_arxiv(topic, max_results=6)
        
        # Try each model with full retry logic
        for i, model_info in enumerate(self.models):
            logger.info(f"\n🔄 Trying model {i+1}/{len(self.models)}: {model_info['description']}")
            
            # Create adaptive prompt
            prompt = self.create_adaptive_prompt(topic, paper_type, arxiv_summary, model_info)
            
            # Attempt generation with retries
            paper_text = await self.generate_with_model_retry(model_info, prompt)
            
            if paper_text:
                logger.info(f"✅ Successfully generated paper with {model_info['description']}")
                
                # Parse and validate sections
                sections = split_into_sections(paper_text)
                
                # Quality validation
                required_sections = ["abstract", "introduction", "methodology", "results", "conclusion"]
                missing_sections = [s for s in required_sections if not sections.get(s, "").strip()]
                
                if len(missing_sections) <= 2:  # Allow some missing sections
                    logger.info(f"✅ Quality check passed (missing: {missing_sections})")
                    
                    # Add comprehensive metadata
                    sections["_metadata"] = {
                        "topic": topic,
                        "paper_type": paper_type,
                        "model_used": model_info["description"],
                        "model_name": model_info["name"],
                        "generation_time": datetime.now().isoformat(),
                        "word_count": len(paper_text.split()),
                        "char_count": len(paper_text),
                        "missing_sections": missing_sections,
                        "success_model_index": i,
                        "total_attempts": sum(self.rate_limit_manager.failure_count.values()) + 1
                    }
                    
                    return sections
                else:
                    logger.warning(f"⚠️ Quality check failed - missing sections: {missing_sections}")
            
            # Add delay between models
            if i < len(self.models) - 1:
                logger.info("⏰ Waiting before trying next model...")
                await asyncio.sleep(3)
        
        # All models failed - create emergency fallback
        logger.error("❌ All models failed - creating emergency fallback")
        return {
            "abstract": f"This paper examines {topic}. Full generation was not possible due to technical limitations.",
            "introduction": f"The study of {topic} represents an important area of research with significant implications.",
            "methodology": "This section would detail the research methodology in a complete generation.",
            "results": "Key findings and analysis would be presented here.",
            "conclusion": f"Further investigation of {topic} is recommended to advance understanding in this field.",
            "references": "1. Smith, J. (2023). Research in the field.\n2. Johnson, A. (2023). Advanced studies.\n3. Brown, K. (2023). Current developments.",
            "_metadata": {
                "topic": topic,
                "paper_type": paper_type,
                "model_used": "Emergency Fallback",
                "generation_time": datetime.now().isoformat(),
                "word_count": 0,
                "char_count": 0,
                "status": "failed_generation"
            }
        }

# Backward compatibility function
async def generate_paper_with_llama(topic: str, paper_type: str, paper_format: str):
    """Backward compatible main function"""
    generator = PaperGenerator()
    return await generator.generate_paper_with_fallback(topic, paper_type, paper_format)

# Example usage and testing
if __name__ == "__main__":
    async def main():
        try:
            # Test with a sample topic
            topic = "Machine Learning in Climate Change Prediction"
            paper_type = "research"
            paper_format = "academic"
            
            logger.info("🧪 Testing paper generation system...")
            result = await generate_paper_with_llama(topic, paper_type, paper_format)
            
            print("\n" + "="*60)
            print("📄 PAPER GENERATION RESULTS")
            print("="*60)
            
            if "_metadata" in result:
                metadata = result["_metadata"]
                print(f"✅ Model Used: {metadata['model_used']}")
                print(f"📊 Word Count: {metadata['word_count']}")
                print(f"⏱️ Generation Time: {metadata['generation_time']}")
                if metadata.get('missing_sections'):
                    print(f"⚠️ Missing Sections: {metadata['missing_sections']}")
                print("-" * 60)
            
            for section, content in result.items():
                if section != "_metadata":
                    print(f"\n📝 {section.upper()}:")
                    print("-" * 40)
                    preview = content[:300] + "..." if len(content) > 300 else content
                    print(preview)
                    
        except Exception as e:
            logger.error(f"❌ Test failed: {e}")
    
    asyncio.run(main())
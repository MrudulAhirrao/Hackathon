from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import generate # Assuming this is your existing router
from routes import easychair_scraper # Import the new scraper router
from routes import generatequestion
import traceback
import os # For creating data directory if not exists
import logging

# Configure basic logging for the application
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create data directory if it doesn't exist
if not os.path.exists("data"):
    os.makedirs("data")
    logger.info("Created 'data/' directory.")

app = FastAPI(title="Conference Finder API", version="1.0.0",
              description="API for discovering academic and tech conferences.")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"❌ Global exception caught by handler: {str(exc)}")
    traceback.print_exc() # Print full traceback for debugging
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {type(exc).__name__} - {str(exc)}"}
    )

# Include both routers
app.include_router(generate.router)
app.include_router(easychair_scraper.router) # Include the new EasyChair scraper router
app.include_router(generatequestion.router) # Assuming this is your existing question generation router
# Health Check Endpoint
@app.get("/health", summary="Health check endpoint")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

# Run app if executed directly
if __name__ == "__main__":
    import uvicorn
    # Use reload=True for development, remove for production
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

